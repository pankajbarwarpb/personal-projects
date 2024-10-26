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
    const { url, chapterName, chapterLink, title, extractType } = req.body; // Add extractType to the request body

    console.log({
      url,
      chapterName,
      chapterLink,
      title,
      extractType,
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(chapterName);

    const chapterTitles = await page.$$eval(chapterName, (chapter_titles) =>
      chapter_titles.map((chapter) => chapter.textContent.trim())
    );

    let chapterLinks;
    if (extractType === "href") {
      chapterLinks = await page.$$eval(
        chapterName,
        (chapter_titles) => chapter_titles.map((chapter) => chapter.href) // Extract href
      );
    } else if (extractType === "src") {
      chapterLinks = await page.$$eval(
        chapterName,
        (chapter_titles) => chapter_titles.map((chapter) => chapter.src) // Extract src if applicable
      );
    } else {
      throw new Error("Invalid extractType specified. Use 'href' or 'src'.");
    }

    const postTitle = title;

    await browser.close();

    // Construct manga object
    const manga = {
      title: postTitle,
      chapters: chapterTitles.map((chapterTitle, index) => ({
        title: chapterTitle,
        link: chapterLinks[index],
      })),
      readTill: 0,
    };

    // Save manga to MongoDB
    const db = client.db(dbName);
    const collection = db.collection("mangas");

    await collection.insertOne(manga);

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

// Delete Manga Route
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure id is provided
    if (!id) {
      return res.status(400).send("Manga ID is required");
    }

    const db = client.db(dbName);
    const collection = db.collection("mangas");

    // Delete the manga by ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send("Manga not found");
    }

    res.status(200).send("Manga deleted successfully");
  } catch (error) {
    console.error("Error deleting manga:", error);
    res.status(500).send("Error deleting manga");
  }
});

// Start the server
app.listen(3080, () => {
  console.log("Server running on http://192.168.0.102:3080");
});
