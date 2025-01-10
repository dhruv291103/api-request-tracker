const winston = require('winston');
require('winston-mongodb'); // Import the winston-mongodb transport

const logger = winston.createLogger({
  level: 'info', // Capture 'info' and higher level logs for MongoDB
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Format the log as JSON to capture all fields in metadata
  ),
  transports: [
    // Store info and error logs in MongoDB
    new winston.transports.MongoDB({
      db: 'mongodb://localhost:27017/SMTP_test', // MongoDB URI
      collection: 'failed_requests', // Collection name to store failed requests
      level: 'info', // Store logs at info level and above
      storeHost: true, // Optionally store host information
      capped: true, // Log rotation
      tryReconnect: true, // Automatically reconnect if connection fails
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      meta: true, // Ensure metadata is stored in MongoDB as part of the log entry
    }),
    new winston.transports.File({ filename: 'error.log', level: 'info' }), // File transport for error logs
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info' // Display all logs in console for non-production
  }));
}

module.exports = { logger };
