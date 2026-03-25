import mongoose from "mongoose";

/**
 * Announcement Schema
 * @description Represents the data configuration layout strictly defining 
 * what fields an Announcement Record is allowed to save in our MongoDB collection.
 */
const AnnouncementSchema = new mongoose.Schema({
  // The Shop context origin, necessary to differentiate multiple Shopify stores on the same backend
  shop: { 
    type: String, 
    required: true 
  },
  // The exact announcement text sent by the merchant in the React Dashboard
  text: { 
    type: String, 
    required: true 
  },
  // Automatically captured creation timestamp used for auditing the recent history table
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

// Compile the schema into a reusable model ensuring hot reload environments don't compile duplicates
const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
