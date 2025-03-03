// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://burgerbites-hostinger:Sahajvirktencent870@nodejs.86ilhsl.mongodb.net/burgerbites?retryWrites=true&w=majority&appName=nodejs";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * In production, you can safely remove this caching.
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectToDB };
