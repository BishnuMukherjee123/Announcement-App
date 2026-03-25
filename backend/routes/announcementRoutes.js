import express from "express";
import { getAnnouncements, createAnnouncement } from "../controllers/announcementController.js";
import rateLimit from "express-rate-limit";

// Initialize standard Express router context
const router = express.Router();

/**
 * API Rate Limiter
 * @description Prevents brute force DDoS or massive spam payloads by strictly limiting 
 * each IP address to interacting safely over 15-minute rolling windows.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Top threshold hits per IP
  message: { error: "Too many requests from this IP, please try again later" }
});

// =======================
// ROUTES DEFINITION
// =======================

// Maps to POST /api/announcement
// Implements the security Limiter middleware prior to touching the controller logic.
router.route("/announcement")
  .post(apiLimiter, createAnnouncement);

// Maps to GET /api/announcements
// Remains mostly unlimited natively so live storefronts fetching this data don't drop traffic.
router.route("/announcements")
  .get(getAnnouncements);

export default router;
