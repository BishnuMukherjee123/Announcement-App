import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/error.js";
import announcementRoutes from "./routes/announcementRoutes.js";

// Initialize the core Express application
const app = express();

/**
 * ==========================================
 * PRODUCTION MIDDLEWARE STACK
 * ==========================================
 * These middlewares execute on every incoming HTTP request to sanitize,
 * log, and secure the application prior to hitting our custom routes.
 */

// 1. Helmet: Sets diverse HTTP headers to secure against cross-site scripting (XSS), clickjacking, etc.
app.use(helmet());

// 2. CORS: Restrict API access exclusively to the approved Frontend to deny unauthorized hijacking
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(",") 
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    
    // In production, strictly enforce exact domain matching
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Strict Security: Unauthorized by CORS"));
    }
  },
  credentials: true
}));

// 3. Request Logging (Morgan): Logs incoming requests to the console.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Verbose, colored output in dev
} else {
  app.use(morgan("combined")); // Standardized Apache-style format for production analytics
}

// 4. Body Parser: Extracts the body portion of an incoming request stream and exposes it on req.body
app.use(express.json());

// 5. HTTP Parameter Pollution (HPP): Protects against scenarios where users send arrays parameters when strings are expected
app.use(hpp());

/**
 * ==========================================
 * APPLICATION ROUTES
 * ==========================================
 */

// Bind the API router mapped prefix '/api' to our decoupled Announcement routers.
app.use("/api", announcementRoutes);

// Simple Healthcheck Endpoint for monitoring tools (like AWS Route53 or Docker) to confirm the app is alive.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "up", timestamp: new Date() });
});

/**
 * ==========================================
 * CUSTOM ERROR HANDLING PIPELINE
 * ==========================================
 * These are placed strictly AFTER the routes because they act as 
 * "Catch-all nets" for any requests or errors that fell through.
 */

// Catches 404 Not Found requests (endpoints that simply don't exist)
app.use(notFound);

// Standardized error handler that returns formatted JSON stack-traces (hidden in prod) rather than raw HTML exceptions.
app.use(errorHandler);

export default app;
