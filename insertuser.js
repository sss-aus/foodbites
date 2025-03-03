import mongoose from "mongoose";
import User from "./src/lib/models/User.js"; // Ensure correct path to your User model
import { connectToDB } from "./src/lib/mongodb.js"; // Ensure correct path

async function seedUsers() {
  await connectToDB();

  const users = [
    {
      username: "admin",
      password: "$2b$10$eY4gVD1FVZG3HHzkmBJe7uC8y95lpgpZ8UKgBMLOj86InOjo71H8C",
      role: "admin",
    },
    {
      username: "admin123",
      password: "$2b$10$pyV9EWTEtVfKmOwIZtUX.efPB.Ts7LJs0J4WaSHHn2.eJ.rru2lC6",
      role: "admin",
    },
  ];

  try {
    await User.insertMany(users);
    console.log("Users added successfully");
  } catch (error) {
    console.error("Error inserting users:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedUsers();
