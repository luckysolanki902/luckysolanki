import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || "luckyportfolio";

declare global {
  var portfolioMongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise() {
  if (!uri) return undefined;

  const cachedPromise =
    process.env.NODE_ENV === "development"
      ? global.portfolioMongoClientPromise
      : clientPromise;
  if (cachedPromise) return cachedPromise;

  const client = new MongoClient(uri);
  const connectionPromise = client.connect();
  const recoverablePromise = connectionPromise.catch((error) => {
    if (clientPromise === recoverablePromise) clientPromise = undefined;
    if (global.portfolioMongoClientPromise === recoverablePromise) {
      global.portfolioMongoClientPromise = undefined;
    }
    throw error;
  });

  clientPromise = recoverablePromise;
  if (process.env.NODE_ENV === "development") {
    global.portfolioMongoClientPromise = recoverablePromise;
  }
  return recoverablePromise;
}

export function isDatabaseConfigured() {
  return Boolean(uri);
}

export async function getDatabase(): Promise<Db> {
  const promise = getClientPromise();
  if (!promise) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = await promise;
  return client.db(databaseName);
}
