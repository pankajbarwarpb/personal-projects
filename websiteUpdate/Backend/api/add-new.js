import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri);
const dbName = "mangaFavourites";

export default async (req, res) => {
  try {
    const { url, searchFor, title: titleSelector } = req.body;

    // Puppeteer code for scraping chapters
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(searchFor);

    const chapters = await page.$$eval(searchFor, (chapterLinks) =>
      chapterLinks.map((chapter) => ({
        title: chapter.textContent.trim(),
        link: chapter.href,
      }))
    );

    const postTitles = await page.$eval(titleSelector, (element) =>
      element.textContent.trim()
    );
    const postTitle = postTitles[0];
    await browser.close();

    // Save to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("mangas");
    await collection.insertOne({
      title: postTitle,
      chapters: chapters,
      readTill: 0,
    });

    res.json({ message: "Manga added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding new manga" });
  }
};
