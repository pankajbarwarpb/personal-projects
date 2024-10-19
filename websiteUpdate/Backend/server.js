import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri);

const dbName = "mangaFavourites"; // Your database name
const app = express();

// Enable CORS for all routes
app.use(cors());

// Add middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Add New Manga Route
app.post("/add-new", async (req, res) => {
  try {
    const { url, searchFor, title: titleSelector } = req.body;

    console.log({
      url,
      searchFor,
      title: titleSelector,
    });

    // Launch Puppeteer
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
    console.log({ title: titleSelector, postTitles });

    const postTitle = postTitles[0];

    await browser.close();

    console.log({ chapters });

    // Construct manga object
    const manga = {
      title: postTitle, // Example to extract a title from URL
      chapters: chapters,
      readTill: 0, // Initial value for readTill
    };

    // Save manga to MongoDB
    const db = client.db(dbName);
    const collection = db.collection("mangas"); // Changed collection name to 'mangas'

    // Insert manga into the database
    await collection.insertOne(manga);

    // Send the added manga as JSON
    res.json({ manga });
  } catch (error) {
    console.error("Error adding new manga:", error);
    res.status(500).send("Error adding new manga");
  }
});

// List Route
app.get("/list", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("mangas"); // Ensure this matches the collection where mangas are stored

    // Fetch mangas from MongoDB
    const mangas = await collection.find({}).toArray();

    console.log("returning : ", { mangas: JSON.stringify(mangas) });

    res.json({ mangas: JSON.stringify(mangas) });
  } catch (error) {
    console.error("Error retrieving mangas from MongoDB:", error);
    res.status(500).send("Error retrieving mangas");
  }
});

app.put("/update-last-read", async (req, res) => {
  try {
    const { id, readTill } = req.body;

    console.log({ id, readTill });

    // Ensure id is provided and is not undefined
    if (!id) {
      return res.status(400).send("Manga ID is required");
    }

    // Find the manga by ID and update the readTill value
    const db = client.db(dbName);
    const collection = db.collection("mangas");

    // Create ObjectId using the string ID
    const result = await collection.updateOne(
      { _id: new ObjectId(String(id)) }, // Convert to string if necessary
      { $set: { readTill } } // Update the readTill field
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Manga not found or no changes made");
    }

    res.status(200).send("Last read updated successfully");
  } catch (error) {
    console.error("Error updating last read:", error);
    res.status(500).send("Error updating last read");
  }
});

// Start the server
app.listen(3080, () => {
  console.log("Server running on http://localhost:3080");
});
