const express = require('express');
const { validateRequest } = require('../middleware/requestValidator');
const FailedRequest = require('../models/FailedRequest');
const { sendAlert } = require('../services/alertService'); // Import sendAlert from alertService

// Endpoint to simulate sending a test email
const setupRoutes = (app) => {

  // to test email alert
  app.get('/test-email', async (req, res) => {
    try {
      const mailOptions = {
        from: 'dhruvdpk03@gmail.com',
        to: 'dhruvdpk03@example.com',  // Test recipient
        subject: 'Test Email',
        text: 'This is a test email.'
      };

      // call sendAlert here if needed for testing
      await sendAlert('dhruvdpk03@example.com', req.ip, 1);  // Example usage
      res.status(200).send('Test email sent successfully!');
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).send('Failed to send test email');
    }
  });

  // Define the /api/sendAlert route
  app.post('/api/sendAlert', async (req, res) => {
    const { email } = req.body; // email is passed in the body

    // If email is missing in the request, return an error
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Get the client's IP from the request
    const ip = req.ip;  // You might want to adjust this depending on your setup

    // Log failed attempts or send an email alert to the user
    try {
      await sendAlert(email, ip, 5);  // Assuming 5 failed attempts as an example
      return res.status(200).json({ message: 'Alert sent successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send alert' });
    }
  });  

  // Protected endpoint
  app.post('/api/submit', validateRequest, async (req, res) => {
    const ip = req.ip;
    const { email, password } = req.body;

    // Check if password is correct, and if not, log the failed request
    if (password !== '12345678') {
      await logFailedRequest(ip, 'Incorrect password', req);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ message: 'Request successful' });
  });
};

module.exports = { setupRoutes };
