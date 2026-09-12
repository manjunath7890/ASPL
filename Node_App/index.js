require('dotenv').config();
const express = require('express');
const path    = require('path');
const helmet  = require('helmet');

const connectDB = require('./db doc/atlas_conn');
const app = express();

// ── 1️⃣  Security headers ───────────────────────────────────────────────────
app.use(helmet({
  // Allow React to load scripts/styles from same origin + CDNs
  contentSecurityPolicy: false,
}));

// ── 2️⃣  Core middleware ────────────────────────────────────────────────────
const compression = require('compression');
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── 3️⃣  Ensure DB is connected before handling requests ────────────────────
// connectDB() is idempotent — safe to call on every cold start
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// ── 4️⃣  Mount API routes ───────────────────────────────────────────────────
const router = require('./router/router');
app.use('/api', router);

// ── 5️⃣  Serve React build static files ────────────────────────────────────
// The React_App is built by CI and its build/ folder copied here.
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '7d',          // cache static assets for 7 days
  etag: true,
  lastModified: true,
}));

// ── 6️⃣  SPA fallback: send index.html for all unmatched routes ─────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ── 7️⃣  Start server (local dev only) ─────────────────────────────────────
// On Vercel, the module is imported by @vercel/node — listen() is not called.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;