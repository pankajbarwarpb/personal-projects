import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri);
const dbName = "mangaFavourites";

export default async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("mangas");
    const mangas = await collection.find({}).toArray();

    res.json(mangas);
  } catch (error) {
    res.status(500).json({ error: "Error fetching mangas" });
  }
};
