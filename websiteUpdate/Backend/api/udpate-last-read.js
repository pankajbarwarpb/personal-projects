import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri);
const dbName = "mangaFavourites";

export default async (req, res) => {
  try {
    const { id, readTill } = req.body;
    if (!id) {
      return res.status(400).send("Manga ID is required");
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("mangas");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { readTill } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Manga not found or no changes made");
    }

    res.status(200).send("Last read updated successfully");
  } catch (error) {
    res.status(500).json({ error: "Error updating last read" });
  }
};
