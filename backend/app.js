// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- Import all required route files ---
const authRoutes = require('./routes/auth');
const skinRoutes = require('./routes/skin');

const app = express();

// --- Global Middleware ---

// Enable Cross-Origin Resource Sharing (CORS) - Allows frontend on port 3000 to talk to backend on port 3001
app.use(cors());

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (uploaded images) from the 'uploads' directory
// The frontend will access images via http://localhost:3001/uploads/image.jpg
app.use('/uploads', express.static('uploads'));

// --- Route Registration ---

// Routes for user authentication (e.g., /api/auth/login, /api/auth/register)
app.use('/api/auth', authRoutes);

// Routes for skin prediction and history (e.g., /api/skin/predict, /api/skin/history)
app.use('/api/skin', skinRoutes);

// --- Export the configured app instance ---
module.exports = app;
