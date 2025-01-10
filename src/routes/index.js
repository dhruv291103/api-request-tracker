const { validateRequest } = require('../middleware/requestValidator');
const { sendAlert } = require('../services/alertService');

const setupRoutes = (app) => {

  //  Api for send alert : /api/sendAlert route
  app.post('/api/sendAlert', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email id is required' });
    }
    const ip = req.ip;

    // Send an email alert
    try {
      await sendAlert(email, ip, 5);  // 5 failed attempts
      return res.status(200).json({ message: 'Alert sent successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send alert' });
    }
  });
  // post api for validate user request and response
  app.post('/api/submit', validateRequest, async (req, res) => {
    const ip = req.ip;
    const { email, password } = req.body;
    // Default Password: 12345678
    if (password !== '12345678') {
      await logFailedRequest(ip, 'Incorrect password', req);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: 'Request successful' });
  });
};

module.exports = { setupRoutes };
