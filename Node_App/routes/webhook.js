/**
 * EMQX Cloud → MongoDB Webhook Handler
 * 
 * EMQX Rule Engine posts to POST /api/webhook whenever a message
 * arrives on the "vehicle_vcu_data" topic.
 * 
 * Expected EMQX payload (set in Rule Engine body template):
 * {
 *   "topic":    "vehicle_vcu_data",
 *   "payload":  "{\"user\":\"VH001\",\"v1\":\"A\",...}",   ← JSON string
 *   "clientid": "device_abc123",
 *   "ts":       1234567890123
 * }
 * 
 * Required env vars:
 *   EMQX_WEBHOOK_SECRET   — same value set in EMQX HTTP Action header
 *   FIREBASE_PROJECT_ID   — optional, for FCM push notifications
 *   FIREBASE_CLIENT_EMAIL — optional
 *   FIREBASE_PRIVATE_KEY  — optional
 */

const express = require('express');
const router  = express.Router();
const Data         = require('../model/dataSchema');
const WebhookLog   = require('../model/webhookLogSchema');
const { setLatest, updateHeartbeat } = require('../lib/redis');

const IST_TIME_ZONE = 'Asia/Kolkata';

// ── IST date helper (same as data.js / mqtt.js) ─────────────────────────────
function getIstDateString(utcDate) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIME_ZONE,
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  }).formatToParts(utcDate);

  const year  = parts.find((p) => p.type === 'year')?.value  || '0000';
  const month = parts.find((p) => p.type === 'month')?.value || '00';
  const day   = parts.find((p) => p.type === 'day')?.value   || '00';
  return `${year}-${month}-${day}`;
}

// ── POST /api/webhook ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const receivedAt = new Date();
  const secret = process.env.EMQX_WEBHOOK_SECRET || '';

  // 1. Validate shared secret (EMQX sends it as a request header)
  if (secret) {
    const incoming = req.headers['x-webhook-secret'] || '';
    if (incoming !== secret) {
      console.warn('[Webhook] Unauthorized — bad secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const body = req.body; 

  // 2. Parse EMQX payload (JSON string inside body.payload)
  let payload = body.payload;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      console.error('[Webhook] Failed to parse payload JSON:', payload);
      return res.status(400).json({ error: 'Invalid payload JSON' });
    }
  }
  // Fallback: if EMQX rule sends the whole body as the data object
  if (!payload || typeof payload !== 'object') {
    payload = body;
  }

  const topic    = body.topic    || 'unknown';
  const clientId = body.clientid || body.client_id || 'unknown';
  const user     = payload.user  || null;

  // 3. Only handle vehicle_vcu_data topic
  if (topic !== 'vehicle_vcu_data') {
    return res.status(200).json({ ok: true, skipped: true, reason: 'topic not handled' });
  }

  try {
    // 4. Build document with IST timestamp + date (same logic as mqtt.js / data.js)
    const currentUTCDate = new Date();
    const istTimestamp   = new Date(currentUTCDate.getTime() + 5.5 * 60 * 60 * 1000);

    const dataToInsert = {
      ...payload,
      timestamp: istTimestamp,
      date:      new Date(getIstDateString(currentUTCDate)),
    };

    console.log(`[Webhook] user=${user} v49=${payload.v49} v50=${payload.v50} ts=${istTimestamp.toISOString()}`);

    // 5. Save to MongoDB via Mongoose Data model
    const doc = new Data(dataToInsert);
    await doc.save();

    // 6. Cache latest data in Redis (for SSE stream)
    await setLatest(user, dataToInsert).catch((e) =>
      console.error('[Webhook] Redis setLatest error:', e.message)
    );

    // 7. Update heartbeat (device is alive)
    await updateHeartbeat(user).catch((e) =>
      console.error('[Webhook] Redis heartbeat error:', e.message)
    );

    // 9. Log success
    const processedAt = new Date();
    WebhookLog.create({
      topic, clientId, user,
      status:      'success',
      receivedAt,
      processedAt,
      durationMs:  processedAt - receivedAt,
    }).catch((e) => console.error('[Webhook] Log error:', e.message));

    return res.status(200).json({ ok: true, id: doc._id });

  } catch (err) {
    console.error('[Webhook] Error processing payload:', err);

    // Log failure
    WebhookLog.create({
      topic, clientId, user,
      status:    'error',
      errorMsg:  err.message,
      receivedAt,
    }).catch((e) => console.error('[Webhook] Log error:', e.message));

    return res.status(500).json({ error: err.message });
  }
});

// ── GET /api/webhook/logs ────────────────────────────────────────────────────
// Returns the last 100 webhook log entries (useful for debugging)
router.get('/logs', async (req, res) => {
  try {
    const { status, limit = 100 } = req.query;
    const query = status ? { status } : {};
    const logs = await WebhookLog.find(query)
      .sort({ receivedAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 100, 500))
      .lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/webhook/health ──────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EMQX Webhook Handler',
    emqxSecretConfigured: !!process.env.EMQX_WEBHOOK_SECRET,
    redisConfigured:      !!process.env.UPSTASH_REDIS_REST_URL,
    fcmConfigured:        !!process.env.FIREBASE_PROJECT_ID,
    timestamp:            new Date().toISOString(),
  });
});

module.exports = router;
