const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhruvdpk03@gmail.com',  // Your Gmail address
    pass: 'xzts czvl vsvn hvai'  // Use App Password (if you have 2FA enabled)
  }
});

/// In /services/alertService.js, wrap the sendMail function call in a try-catch block
const sendAlert = async (userEmail, ip, failedAttempts) => {
  const mailOptions = {
    from: "dhruvdpk03@gmail.com",  // Sender's email
    to: userEmail,  // Recipient's email (the user who failed to login)
    subject: 'Security Alert: Multiple Failed Login Attempts Detected',
    html: `
      <html>
        <head>
          <style>
            /* Mobile Responsive Styles */
            @media screen and (max-width: 600px) {
              body {
                font-size: 14px !important;
                padding: 10px !important;
              }
              .container {
                padding: 20px !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              text-align: center;
            }
            p {
              font-size: 16px;
              color: #333;
              margin-bottom: 15px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
            }
            .highlight {
              color: #d9534f;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Security Alert: Multiple Failed Login Attempts</h1>
            <p>Dear <span class="highlight">${userEmail}</span>,</p>
            <p>We noticed multiple failed login attempts from your account.</p>
            <p><strong>IP Address:</strong> <span class="highlight">${ip}</span></p>
            <p><strong>Number of Failed Attempts:</strong> <span class="highlight">${failedAttempts}</span></p>
            <p>Please check your account security or reset your password if necessary.</p>
            <p>Thank you,<br>Your Security Team</p>
            <div class="footer">
              <p>If you didn't attempt to log in, please disregard this message.</p>
            </div>
          </div>
        </body>
      </html>`
  };

  try {
    await transporter.sendMail(mailOptions);

    // Log the alert to MongoDB with full metadata (custom fields)
    logger.info('Alert sent to user: ' + userEmail, {
      ip: ip,
      failedAttempts: failedAttempts,
      email: userEmail,
      timestamp: new Date(),
      message: `Alert sent to user: ${userEmail} for IP: ${ip}`,
    });
  } catch (error) {
    logger.error('Error sending alert:', error);
  }
};


module.exports = { sendAlert };