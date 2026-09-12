/**
 * Upstash Redis client (REST-based).
 * Works in serverless environments with no persistent TCP connection.
 * 
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL   — from Upstash dashboard
 *   UPSTASH_REDIS_REST_TOKEN — from Upstash dashboard
 * 
 * Free tier: 10,000 requests/day, 256 MB storage
 */

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Execute a Redis command via Upstash REST API.
 * @param {...string} args  Redis command + args, e.g. ('SET', 'key', 'value')
 * @returns {Promise<any>}  The Redis response result
 */
async function redis(...args) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    // Redis not configured — silently skip (SSE/cache won't work but app still runs)
    return null;
  }

  const res = await fetch(`${REDIS_URL}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.result;
}

/**
 * Cache latest telemetry data for a user/vehicle.
 * Key: latest:<user>  TTL: 1 hour
 */
async function setLatest(user, data) {
  await redis('SET', `latest:${user}`, JSON.stringify(data), 'EX', '3600');
}

/**
 * Get the latest cached telemetry for a user/vehicle.
 * Returns parsed object or null if not found.
 */
async function getLatest(user) {
  const raw = await redis('GET', `latest:${user}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Update the last-seen heartbeat timestamp for a device.
 * Device sends every 2s → TTL = 30s (flags offline after ~15 missed messages).
 */
async function updateHeartbeat(user) {
  await redis('SET', `heartbeat:${user}`, Date.now().toString(), 'EX', '30');
}

/**
 * Check if a device has been seen recently.
 * Returns true if heartbeat key exists (device is alive).
 */
async function isAlive(user) {
  const result = await redis('EXISTS', `heartbeat:${user}`);
  return result === 1;
}

module.exports = { redis, setLatest, getLatest, updateHeartbeat, isAlive };
