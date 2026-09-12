const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: MongoDB automatically removes the document after OTP_EXPIRY_MINUTES
    expires: (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5) * 60,
  },
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
