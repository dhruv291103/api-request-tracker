const FailedRequest = require('../models/FailedRequest');
const { sendAlert } = require('../services/alertService');
const { logger } = require('../utils/logger');

const validateRequest = async (req, res, next) => {
  const ip = req.ip;

  // Example call when a login fails due to an incorrect password
if (password !== correctPassword) {
  await logFailedRequest(req.ip, 'Incorrect password', req);
  return res.status(401).json({ message: 'Unauthorized' });
}

  // Validate headers and token
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    await logFailedRequest(ip, 'Invalid or missing authorization header', req);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check for threshold breach
  const timeWindow = parseInt(process.env.TIME_WINDOW); // Time window (in milliseconds)
  const threshold = parseInt(process.env.ALERT_THRESHOLD); // Threshold for failed attempts

  // Count failed attempts from the same IP in the specified time window
  const failedAttempts = await FailedRequest.countDocuments({
    ip,
    timestamp: { $gte: new Date(Date.now() - timeWindow) },
  });

  // If the threshold is exceeded, send an alert
  if (failedAttempts >= threshold) {
    const userEmail = req.body.email; // Assuming the email is passed in the request body
    await sendAlert(userEmail, ip, failedAttempts);
  }

  // Proceed to the next middleware
  next();
};

const logFailedRequest = async (ip, reason, req) => {
  // console.log(`Logging failed request for IP: ${ip} due to ${reason}`);  // Debug log

  try {
    // Log failed request to the database (MongoDB)
    const failedRequest = await FailedRequest.create({
      ip,
      reason,
      endpoint: req.originalUrl,
      headers: req.headers,
    });

    console.log('Failed request logged to database:', failedRequest);  // Debug log for DB logging

    // Log breach to winston (MongoDB logging)
    logger.info('IP Breach Detected: Failed POST requests threshold exceeded', {
      ip: ip,
      reason: reason,   // Reason for failure (e.g., 'Incorrect password')
      timestamp: new Date(),
      endpoint: req.originalUrl,  // The endpoint that failed (e.g., '/login')
      headers: req.headers,       // Request headers, if you need them
    });
  } catch (error) {
    console.error('Error logging failed request:', error);
    logger.error('Error logging failed request:', error);
  }
};

module.exports = { validateRequest };
