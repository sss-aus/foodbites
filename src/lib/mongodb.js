import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function connectToDB() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(
      "mongodb+srv://burgerbites-hostinger:Sahajvirktencent870@nodejs.86ilhsl.mongodb.net/burgerbites?retryWrites=true&w=majority&appName=nodejs",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
