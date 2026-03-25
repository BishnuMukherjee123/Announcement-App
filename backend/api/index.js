import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import app from "../app.js";

// Connect to MongoDB (Vercel reuses warm instances so this is safe)
await connectDB();

// Export the Express app as a Vercel serverless handler
export default app;
