const mongoose = require('mongoose');

const failedRequestSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  reason: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  headers: {
    type: Object
  }
});

const FailedRequest = mongoose.model('FailedRequest', failedRequestSchema, 'failed_requests');

module.exports = FailedRequest;