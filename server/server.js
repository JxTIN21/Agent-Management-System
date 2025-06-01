const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize express app FIRST
const app = express();

// Use cors before other middlewares or routes
app.use(cors({
  origin: 'https://agent-management-system.netlify.app/',  // Replace after deploying frontend
  credentials: true,
}));

// Connect to MongoDB database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration for Netlify frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-app-name.netlify.app' // Your Netlify domain
    : 'http://localhost:3000', // Local development frontend URL
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware with configuration
app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes for authentication, agents, and lists
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));

// Base route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'API is running...', environment: process.env.NODE_ENV });
});

// Custom error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server gracefully before exiting
  server.close(() => {
    process.exit(1);
  });
});