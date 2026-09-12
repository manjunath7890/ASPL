const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  topic: {
    type: String,
    default: 'unknown',
  },
  clientId: {
    type: String,
    default: 'unknown',
  },
  user: {
    type: String,   // vehicle/user identifier extracted from payload
    default: null,
  },
  status: {
    type: String,
    enum: ['success', 'error'],
    required: true,
  },
  errorMsg: {
    type: String,
    default: null,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
    default: null,
  },
  durationMs: {
    type: Number,   // processing time in milliseconds
    default: null,
  },
});

// TTL: auto-delete logs older than 30 days
webhookLogSchema.index({ receivedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
webhookLogSchema.index({ status: 1, receivedAt: -1 });

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);
module.exports = WebhookLog;
