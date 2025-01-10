const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.MongoDB({
      db: 'mongodb://localhost:27017/SMTP_test',
      collection: 'failed_requests',
      level: 'info', 
      storeHost: true,
      capped: true,
      tryReconnect: true,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      meta: true, // to metadata in logs
    }),
    new winston.transports.File({ filename: 'error.log', level: 'info' }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info'
  }));
}

module.exports = { logger };
