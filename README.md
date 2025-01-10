## How to run this project? 

install pakages :  npm install
Start the server:  npm run dev


# POST `/api/submit`

Description: A protected endpoint that requires a Bearer token for authentication. It tracks invalid POST requests and logs them for monitoring.

Security: 
  - Rate limiting to avoid abuse.
  - Authorization header validation.
  - IP-based monitoring for detecting abnormal activity.


# Request Monitoring System

A robust Node.js backend system for monitoring and alerting on failed POST requests.

## Features

- Monitors POST endpoints for failed requests
- Tracks invalid requests by IP address
- Email alerts for threshold breaches
- Metrics logging and analysis
- Rate limiting for high traffic handling
- Scalable architecture

## Tech Stack

- Node.js
- Express
- MongoDB
- Nodemailer for email alerts
- Winston for logging  (all logs will be stored on mongoDB as well as in local file 'error.log')
- Express Rate Limit for request throttling


### Endpoints

- POST /api/submit
  - Protected endpoint requiring Bearer token
  - Monitors for invalid requests

## Monitoring and Logging

- Failed requests are logged to MongoDB

## Security Features

- Rate limiting
- IP-based monitoring
- Authorization header validation
- Configurable alert thresholds


## 🌱 Environment Variables

configure the following environment variables in your `.env` file. Here is a list of required variables:

```plaintext
MONGODB_URI=mongodb://localhost:27017/your-database-name      # MongoDB connection URI
SMTP_USER=your-email@example.com                                # Email address used for sending alerts
SMTP_PASS=your-email-password                                    # Email password for sending alerts
ALERT_THRESHOLD=5                                                # Number of failed requests before triggering an email alert
TIME_WINDOW=600000                                              # Time window (in milliseconds) for counting failed requests
PORT=3000                                                       # Port number to run the application