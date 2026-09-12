const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cryptojs = require('crypto-js');
const User = require('../model/userSchema');
const Otp = require('../model/otpSchema');

const SECRET_KEY = process.env.CRYPTO_KEY || 'telematics_secure_local_storage_key';

async function setOtp(email, otp) {
  // Delete any existing OTP for this email before creating a new one
  await Otp.deleteOne({ email });
  await Otp.create({ email, otp });
}

async function getOtp(email) {
  const entry = await Otp.findOne({ email });
  if (!entry) return null;
  return entry.otp;
}

// --- Email transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// POST /signup
router.post('/signup', async (req, res) => {
  const { userName, role, email, contact, accessToken, dealerToken, financeToken, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = new User({
      userName, role, contact, email,
      accessToken, dealerToken, financeToken, password,
    });
    await user.save(); // password hashed by pre-save hook

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    let decryptedPassword = password;
    try {
      const bytes = cryptojs.AES.decrypt(password, SECRET_KEY);
      const originalText = bytes.toString(cryptojs.enc.Utf8);
      if (originalText) {
        decryptedPassword = originalText;
      }
    } catch (e) {
      // Fallback: If decryption fails, it could be a plaintext password coming from Postman or an old client
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(decryptedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'User logged in successfully',
      role: user.role,
      accessToken: user.accessToken,
      dealerToken: user.dealerToken,
      financeToken: user.financeToken,
      name: user.userName,
      email: user.email,
      contact: user.contact,
    });
    console.log("Login Success");
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setOtp(email, otp);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.json({ message: 'OTP sent to email' });
    });
  } catch (err) {
    console.error('Forgot-password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = await getOtp(email);
    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }
    if (storedOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP matched — delete from DB
    await Otp.deleteOne({ email });
    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error('Verify-OTP error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    user.password = password; // hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset-password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
