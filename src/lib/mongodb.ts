import { MongoClient, Db } from 'mongodb';

// Use env if provided, otherwise fall back to local MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/futurepath';
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown MongoDB error';
    throw new Error(
      `Failed to connect to MongoDB: ${errorMessage}. Please ensure MongoDB is running and the connection string is correct.`
    );
  }
}

export async function getCollection(collectionName: string) {
  try {
    const db = await getDb();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
}
