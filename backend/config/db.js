import mongoose from "mongoose";

/**
 * connectDB
 * @description Creates an asynchronous connection instance to the MongoDB Atlas or Local Database using Mongoose.
 * It strictly relies on environment variables for credentials over hardcoding.
 */
const connectDB = async () => {
  try {
    // Attempt the connection using the defined connection string
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/announcement-app");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the database absolutely fails to connect on boot, the rest of the application is useless.
    // It's safer to crash immediately logging the reason.
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
