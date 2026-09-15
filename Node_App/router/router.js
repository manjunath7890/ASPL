const express = require('express');
const cors = require('cors');
const router = express.Router();

// Middleware — CORS locked to Vercel domain (update ALLOWED_ORIGIN env var if needed)
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
router.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Import specific route modules
const authRoutes        = require('../routes/auth');
const userRoutes        = require('../routes/users');
const vehicleRoutes     = require('../routes/vehicles');
const dataRoutes        = require('../routes/data');
const partsRoutes       = require('../routes/parts');
const faultCodeRoutes   = require('../routes/faultCodes');
const mapApiRoutes      = require('../routes/mapApi');
const analyticsRoutes   = require('../routes/analytics');
const sohRoutes         = require('../routes/soh');
const otaRoutes         = require('../routes/ota');
const webhookRoutes     = require('../routes/webhook');   // EMQX webhook
const sseRoutes         = require('../routes/sse');        // Server-Sent Events
const authSwitchRoutes  = require('../routes/authSwitch');

// The original monolithic routes typically had paths starting from the root of the router.
// Example: router.post("/signup", ...), router.get("/getdata", ...)
// To prevent breaking changes on the frontend, we are grouping them appropriately 
// but maintaining backward compatibility where necessary, or matching the exact old routes.

// Fix for frontend components hardcoded to send double "/api/api/..." prefixes
router.use('/api/verify-otp', (req, res, next) => { req.url = '/verify-otp'; authRoutes(req, res, next); });
router.use('/api/reset-password', (req, res, next) => { req.url = '/reset-password'; authRoutes(req, res, next); });
router.use('/api/forgot-password', (req, res, next) => { req.url = '/forgot-password'; authRoutes(req, res, next); });
router.use('/api/brush', (req, res, next) => { req.url = '/brush'; dataRoutes(req, res, next); });
router.use('/api/data', (req, res, next) => { req.url = '/data'; dataRoutes(req, res, next); });

// Analytics & SOH
router.use('/analytics', analyticsRoutes); 
router.use('/soh', sohRoutes);

// Auth: Login, Signup, Password reset flows
// Old paths: /signup, /login, /api/forgot-password, /api/verify-otp, /api/reset-password
// Since they varied, we just mount them on '/' and the auth file defines the exact paths.
// But wait, in auth.js we defined them as /signup, /login, /forgot-password, /verify-otp, /reset-password
// The frontend used /api/forgot-password, but since this router is mounted at /api anyway, 
// a route like '/forgot-password' inside auth.js becomes '/api/forgot-password'.
// Same goes for '/signup' -> '/api/signup'.
router.use('/', authRoutes);

// Users: 
// Old paths: /users, /dealer/users, /user/update, /user/delete
router.use('/users', userRoutes);

// Aliases for user update/delete to prevent double prefixing (e.g. /users/user/update)
router.put('/user/update/:id', (req, res, next) => {
  req.url = `/user/update/${req.params.id}`;
  userRoutes(req, res, next);
});
router.delete('/user/delete/:id', (req, res, next) => {
  req.url = `/user/delete/${req.params.id}`;
  userRoutes(req, res, next);
});

// Helper for exact old routes mapping (can be refactored on frontend later)

// Helper for exact old routes mapping (can be refactored on frontend later)
router.use('/getdata', (req, res, next) => {
  req.url = '/';
  dataRoutes(req, res, next);
});
router.use('/postdata', (req, res, next) => {
  req.url = '/';
  dataRoutes(req, res, next);
});
router.delete('/delete/data', (req, res, next) => {
  req.url = '/';
  dataRoutes(req, res, next);
});
router.use('/map-api/token', (req, res, next) => {
  req.url = '/token';
  mapApiRoutes(req, res, next);
});

// Data
router.use('/data', dataRoutes);

// Vehicles
// Old routes: /register, /vehicles, /dealer/vehicles, /fleet/vehicles, /financer/vehicles
router.use('/vehicles', vehicleRoutes);
router.use('/register', (req, res, next) => {
  req.url = '/register';
  vehicleRoutes(req, res, next);
});
router.use('/fleet/vehicles', (req, res, next) => {
  req.url = '/fleet';
  vehicleRoutes(req, res, next);
});
router.use('/dealer/vehicles', (req, res, next) => {
  req.url = '/dealer';
  vehicleRoutes(req, res, next);
});
router.use('/financer/vehicles', (req, res, next) => {
  req.url = '/financer';
  vehicleRoutes(req, res, next);
});

// Aliases for legacy vehicle update/delete explicit paths
router.put('/vehicle/update/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  vehicleRoutes(req, res, next);
});
router.delete('/vehicle/delete/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  vehicleRoutes(req, res, next);
});

// Parts
// Old routes: /put/vehicleparts, /get/vehicleparts/:chassisnumber etc.
router.use('/vehicleparts', partsRoutes);
// Aliases for old non-RESTful paths
router.post('/put/vehicleparts', (req, res, next) => {
  req.url = '/';
  partsRoutes(req, res, next);
});
router.get('/get/vehicleparts/:chassisnumber', (req, res, next) => {
  req.url = `/${req.params.chassisnumber}`;
  partsRoutes(req, res, next);
});
router.delete('/delete/vehicleparts/:chassisNumber/:partId', (req, res, next) => {
  req.url = `/${req.params.chassisNumber}/${req.params.partId}`;
  partsRoutes(req, res, next);
});
router.put('/edit/vehicleparts/:chassisNumber/:partId', (req, res, next) => {
  req.url = `/${req.params.chassisNumber}/${req.params.partId}`;
  partsRoutes(req, res, next);
});
router.get('/replace/vehicleparts/:chassisNumber/:partId', (req, res, next) => {
  req.url = `/${req.params.chassisNumber}/${req.params.partId}/history`;
  partsRoutes(req, res, next);
});

// SwitchData — mapped to authSwitch routes for frontend
router.use('/getinput', (req, res, next) => {
  req.url = '/';
  authSwitchRoutes(req, res, next);
});
router.use('/postinput', (req, res, next) => {
  req.url = '/';
  authSwitchRoutes(req, res, next);
});

// FaultCodes
// Old routes: /faultcode
router.use('/faultcode', faultCodeRoutes);

// OTA file downloads
router.use('/ota', otaRoutes);

// EMQX Webhook (receives telemetry from EMQX Cloud Rule Engine)
router.use('/webhook', webhookRoutes);

// SSE — real-time telemetry stream (reads from Upstash Redis)
router.use('/sse', sseRoutes);

// Other standalone utilities from old router:
router.get('/getTime', (req, res) => {
  const currentUTCDate = new Date();
  res.status(200).json({
    hr: currentUTCDate.getHours(),
    min: currentUTCDate.getMinutes(),
    sec: currentUTCDate.getSeconds(),
    year: currentUTCDate.getFullYear(),
    month: currentUTCDate.getMonth(),
    date: currentUTCDate.getDate()
  });
});

module.exports = router;
