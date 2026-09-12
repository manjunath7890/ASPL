/**
 * Server-Sent Events (SSE) — Real-time vehicle telemetry stream
 * 
 * The client connects once; the server pushes updates every 2 seconds
 * by reading from Upstash Redis (written by the EMQX webhook handler).
 * 
 * Usage:
 *   const es = new EventSource('/api/sse/VH001');
 *   es.onmessage = ({ data }) => console.log(JSON.parse(data));
 * 
 * On Vercel:
 *   - Hobby plan: 10 s function timeout → EventSource auto-reconnects
 *   - Pro plan:   300 s → longer sessions
 *   The client-side EventSource handles reconnection transparently.
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

const express = require('express');
const router  = express.Router();
const { getLatest } = require('../lib/redis');

const POLL_INTERVAL_MS = 2000; // how often to check Redis for new data

// GET /api/sse/heartbeat — fleet-wide status for ALL registered vehicles
// Returns each vehicle's online/offline status + last-seen timestamp
const { isAlive, redis } = require('../lib/redis');
const Vehicle = require('../model/registerSchema');

router.get('/heartbeat', async (req, res) => {
  try {
    // 1. Get all registered vehicles from MongoDB
    const vehicles = await Vehicle.find({}, 'user vehicleNo accessToken dealerToken').lean();

    if (!vehicles.length) {
      return res.json({ total: 0, online: 0, offline: 0, vehicles: [] });
    }

    // 2. Check Redis heartbeat for all vehicles in parallel
    const results = await Promise.all(
      vehicles.map(async (v) => {
        const userId = v.user;
        if (!userId) return { ...v, alive: false, lastSeenMs: null };

        // Get the raw timestamp stored in heartbeat key
        const raw = await redis('GET', `heartbeat:${userId}`).catch(() => null);
        const lastSeenMs = raw ? parseInt(raw, 10) : null;

        return {
          user:        userId,
          vehicleNo:   v.vehicleNo   || null,
          accessToken: v.accessToken || null,
          dealerToken: v.dealerToken || null,
          alive:       !!raw,
          lastSeenMs,
          lastSeen:    lastSeenMs
            ? new Date(lastSeenMs).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : null,
          secondsAgo:  lastSeenMs
            ? Math.floor((Date.now() - lastSeenMs) / 1000)
            : null,
        };
      })
    );

    // 3. Sort: online first, then by most recently seen
    results.sort((a, b) => {
      if (a.alive !== b.alive) return a.alive ? -1 : 1;
      return (b.lastSeenMs || 0) - (a.lastSeenMs || 0);
    });

    const onlineCount = results.filter((r) => r.alive).length;

    res.json({
      total:    results.length,
      online:   onlineCount,
      offline:  results.length - onlineCount,
      checkedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      vehicles: results,
    });
  } catch (err) {
    console.error('[Heartbeat Fleet] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sse/heartbeat/:user — check if a single device is alive
router.get('/heartbeat/:user', async (req, res) => {
  try {
    const alive = await isAlive(req.params.user);
    res.json({ user: req.params.user, alive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sse/:user
router.get('/:user', (req, res) => {
  const { user } = req.params;

  // SSE headers
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // Send a comment ping immediately so the client knows the connection is alive
  res.write(': connected\n\n');

  let lastJson = null; // track last sent value to avoid duplicate events

  const sendUpdate = async () => {
    try {
      const data = await getLatest(user);
      if (!data) {
        // No data yet — send a heartbeat comment to keep connection alive
        res.write(': heartbeat\n\n');
        return;
      }

      const json = JSON.stringify(data);
      if (json === lastJson) {
        // Same data — send keep-alive ping instead
        res.write(': ping\n\n');
        return;
      }

      lastJson = json;
      res.write(`event: telemetry\ndata: ${json}\n\n`);
    } catch (err) {
      console.error(`[SSE] Error for user=${user}:`, err.message);
      res.write(`: error: ${err.message}\n\n`);
    }
  };

  // Start polling Redis
  sendUpdate(); // immediate first push
  const interval = setInterval(sendUpdate, POLL_INTERVAL_MS);

  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(interval);
  });
});




module.exports = router;
