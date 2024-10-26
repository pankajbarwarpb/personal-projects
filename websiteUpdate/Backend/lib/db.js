import { MongoClient } from "mongodb";
let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  await client.connect();
  cachedClient = client;

  return client;
}
