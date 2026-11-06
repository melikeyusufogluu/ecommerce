import { Db, MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to your .env file.");
}

// Reuse one client across hot reloads in dev so we don't open a new
// connection pool every time a file changes.
const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

const client = globalForMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

export async function connectToDb(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  await client.connect(); // no-op if already connected

  cachedClient = client;
  cachedDb = client.db("ecommerce-nextjs");
  return { client, db: client.db("ecommerce-nextjs") };
}
