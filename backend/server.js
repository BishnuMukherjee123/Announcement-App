import dotenv from "dotenv";
dotenv.config(); // Loads environment variables from the .env file

import connectDB from "./config/db.js";
import app from "./app.js";

/**
 * ENTRY POINT CONFIGURATION
 * This file handles exactly two things: Connecting to the external services (MongoDB)
 * and booting up the Express Server defined in app.js.
 */

// Step 1: Connect to the defined MongoDB cluster asynchronously
await connectDB();

// Determine the active port based on environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Step 2: Boot up the Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Production Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

/**
 * GRACEFUL SHUTDOWN & RESILIENCY
 * These listeners catch catastrophic errors that bypassed all error middlewares.
 * Rather than letting the Node process remain in a broken/'zombie' state,
 * it shuts down gracefully ensuring no requests are left hanging.
 */

// Catch unhandled Promise rejections (e.g., if MongoDB is completely offline during runtime)
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error (Unhandled Rejection): ${err.message}`);
  // Attempt to close horizontal server connections before tearing down the process
  server.close(() => process.exit(1));
});

// Catch deeply fatal synchronous errors
process.on("uncaughtException", (err) => {
  console.error(`Error (Uncaught Exception): ${err.message}`);
  server.close(() => process.exit(1));
});
