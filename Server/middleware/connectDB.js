import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB with additional options for better reliability
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ita602-database", // This will create the database if it doesn't exist
    });
    console.log("Server connected successfully to database: ita602-database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Make sure your MongoDB server is running and accessible");
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
