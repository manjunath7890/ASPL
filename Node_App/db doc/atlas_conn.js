const mongoose = require('mongoose');

// Cached connection — reused across serverless warm invocations.
// On Vercel each function instance is reused for multiple requests;
// this avoids opening a new connection on every request.
let _cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (_cachedPromise) return _cachedPromise;         // connection in progress

  _cachedPromise = mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      _cachedPromise = null; // allow retry on next call
      console.error('Error connecting to MongoDB:', error);
      throw error;
    });

  return _cachedPromise;
}

// Connect immediately on module load (same as before for non-serverless use)
connectDB();

module.exports = connectDB;