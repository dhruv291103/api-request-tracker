const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { setupRoutes } = require('./routes');
const { connectDB } = require('./config/database');
const { logger } = require('./utils/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB().then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection failed:', err);
  });
  

// Setup routes
setupRoutes(app);

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// app.listen(PORT, () => {
//     logger.info(`Server running on port ${PORT}`);
// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
  // Log to the console but don't use winston's MongoDB transport for startup logs
  if (process.env.NODE_ENV !== 'production') {
    console.log('Server running on port 3000');
  }
});
