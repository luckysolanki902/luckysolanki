import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || "portfolio";

declare global {
  var portfolioMongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

if (uri) {
  const client = new MongoClient(uri);

  clientPromise =
    process.env.NODE_ENV === "development"
      ? (global.portfolioMongoClientPromise ??=
          client.connect())
      : client.connect();
}

export function isDatabaseConfigured() {
  return Boolean(clientPromise);
}

export async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = await clientPromise;
  return client.db(databaseName);
}
