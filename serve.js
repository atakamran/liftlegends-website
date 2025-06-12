// Simple static file server for testing the build
import { createServer } from "http";
import { readFile } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";

// Import cors using ES module syntax
import cors from "cors";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const DIST_DIR = join(__dirname, "dist");

// Create Express app
const app = express();

// Enable CORS for all routes with specific options
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

// Add OPTIONS handling for preflight requests
app.options("*", cors());

// Add JSON body parser middleware
app.use(express.json());

// MIME types for different file extensions
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".jsx": "application/javascript",
  ".ts": "application/javascript",
  ".tsx": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".webp": "image/webp",
};

// Proxy endpoint for Zarinpal payment request
app.post("/api/zarinpal/payment-request", async (req, res) => {
  console.log("Received Zarinpal payment request:", JSON.stringify(req.body));

  try {
    // Set headers for the Zarinpal API request
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    console.log("Sending request to Zarinpal API...");

    const response = await axios.post(
      "https://staging.zarinpal.com/pg/v4/payment/request.json",
      req.body,
      { headers }
    );

    console.log("Zarinpal API response:", JSON.stringify(response.data));

    // Set CORS headers explicitly for the response
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

    // Return the Zarinpal response
    res.json(response.data);
  } catch (error) {
    console.error("Zarinpal API error:", error.message);

    // Log more detailed error information
    if (error.response) {
      console.error(
        "Error response data:",
        JSON.stringify(error.response.data)
      );
      console.error("Error response status:", error.response.status);
      console.error(
        "Error response headers:",
        JSON.stringify(error.response.headers)
      );
    } else if (error.request) {
      console.error("Error request:", JSON.stringify(error.request));
    }

    // Set CORS headers for error response
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

    // Return error details
    res.status(500).json({
      error: true,
      message: error.message,
      data: error.response?.data || null,
      status: error.response?.status || null,
    });
  }
});

// Proxy endpoint for Zarinpal payment verification
app.post("/api/zarinpal/verify", async (req, res) => {
  console.log("Received Zarinpal verification request:", JSON.stringify(req.body));

  try {
    // Set headers for the Zarinpal API request
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    console.log("Sending verification request to Zarinpal API...");

    const response = await axios.post(
      "https://staging.zarinpal.com/pg/v4/payment/verify.json",
      req.body,
      { headers }
    );

    console.log("Zarinpal verification response:", JSON.stringify(response.data));

    // Set CORS headers explicitly for the response
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

    // Return the Zarinpal response
    res.json(response.data);
  } catch (error) {
    console.error("Zarinpal verification error:", error.message);

    // Log more detailed error information
    if (error.response) {
      console.error(
        "Error response data:",
        JSON.stringify(error.response.data)
      );
      console.error("Error response status:", error.response.status);
      console.error(
        "Error response headers:",
        JSON.stringify(error.response.headers)
      );
    } else if (error.request) {
      console.error("Error request:", JSON.stringify(error.request));
    }

    // Set CORS headers for error response
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

    // Return error details
    res.status(500).json({
      error: true,
      message: error.message,
      data: error.response?.data || null,
      status: error.response?.status || null,
    });
  }
});

// Serve static files from the dist directory with proper MIME types
app.use(express.static(DIST_DIR, {
  setHeaders: (res, path) => {
    const ext = extname(path);
    if (MIME_TYPES[ext]) {
      res.setHeader('Content-Type', MIME_TYPES[ext]);
    }
    // Set proper cache headers for static assets
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Handle SPA routing - serve index.html for all non-static-file requests
app.get("*", (req, res) => {
  console.log(`GET ${req.url}`);

  const ext = extname(req.url);
  
  // If it's a request for a static file that wasn't found by express.static
  if (ext && MIME_TYPES[ext]) {
    // Return 404 for missing static files
    res.status(404).send("File not found");
    return;
  }
  
  // For SPA routes (no extension or not a known static file type), serve index.html
  const indexPath = join(DIST_DIR, "index.html");
  readFile(indexPath, (err, data) => {
    if (err) {
      console.error("Error loading index.html:", err);
      res.status(500).send("Error loading application");
      return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Prevent caching of the SPA entry point
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from ${DIST_DIR}`);
});
