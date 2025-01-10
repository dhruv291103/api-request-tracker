const FailedRequest = require('../models/FailedRequest');
const { sendAlert } = require('../services/alertService');
const { logger } = require('../utils/logger');

const validateRequest = async (req, res, next) => {
  const ip = req.ip;

  if (password !== correctPassword) {
    await logFailedRequest(req.ip, 'Incorrect password', req);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate headers and Bearer token
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    await logFailedRequest(ip, 'Invalid or missing authorization header', req);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const timeWindow = parseInt(process.env.TIME_WINDOW);
  const threshold = parseInt(process.env.ALERT_THRESHOLD);
  const failedAttempts = await FailedRequest.countDocuments({
    ip,
    timestamp: { $gte: new Date(Date.now() - timeWindow) },
  });

  // If the threshold is exceeded, send an alert
  if (failedAttempts >= threshold) {
    const userEmail = req.body.email;
    await sendAlert(userEmail, ip, failedAttempts);
  }
  next();
};

const logFailedRequest = async (ip, reason, req) => {
  try {
    const failedRequest = await FailedRequest.create({
      ip,
      reason,
      endpoint: req.originalUrl,
      headers: req.headers,
    });
    console.log('Failed request logged to database:', failedRequest);
    logger.info('IP Breach Detected: Failed POST requests threshold exceeded', {
      ip: ip,
      reason: reason,
      timestamp: new Date(),
      endpoint: req.originalUrl,
      headers: req.headers,
    });
  } catch (error) {
    console.error('Error logging failed request:', error);
    logger.error('Error logging failed request:', error);
  }
};

module.exports = { validateRequest };
