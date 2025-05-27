// Simple static file server for testing the build
import { createServer } from 'http';
import { readFile } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';

// Import cors using ES module syntax
import cors from 'cors';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const DIST_DIR = join(__dirname, 'dist');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Add JSON body parser middleware
app.use(express.json());

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.jsx': 'application/javascript',
  '.ts': 'application/javascript',
  '.tsx': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.webp': 'image/webp'
};

// Proxy endpoint for Zarinpal API
app.post('/api/zarinpal/payment-request', async (req, res) => {
  try {
    const response = await axios.post(
      'https://staging.zarinpal.com/pg/v4/payment/request.json',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Zarinpal API error:', error.message);
    res.status(500).json({
      error: true,
      message: error.message,
      data: error.response?.data || null
    });
  }
});

// Serve static files from the dist directory
app.use(express.static(DIST_DIR));

// Handle SPA routing - serve index.html for all non-file requests
app.get('*', (req, res) => {
  console.log(`GET ${req.url}`);
  
  // Try to serve the requested file
  const filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, serve index.html for SPA routing
      if (err.code === 'ENOENT') {
        const indexPath = join(DIST_DIR, 'index.html');
        readFile(indexPath, (err, data) => {
          if (err) {
            res.status(500).send('Error loading index.html');
            return;
          }
          
          res.setHeader('Content-Type', 'text/html');
          res.send(data);
        });
        return;
      }
      
      // For other errors
      res.status(500).send(`Server Error: ${err.code}`);
      return;
    }
    
    // Determine the file's MIME type
    const ext = extname(filePath);
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Special handling for JavaScript modules
    if (ext === '.js' && req.url.includes('type=module')) {
      contentType = 'application/javascript';
    }
    
    res.setHeader('Content-Type', contentType);
    res.send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from ${DIST_DIR}`);
});