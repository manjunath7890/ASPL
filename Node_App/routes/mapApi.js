const express = require('express');
const router = express.Router();

// GET /token — proxy MapMyIndia OAuth token
router.get('/token', async (req, res) => {
  const clientId = process.env.MAPMYINDIA_CLIENT_ID;
  const clientSecret = process.env.MAPMYINDIA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'MapMyIndia API credentials not configured' });
  }

  try {
    const url = `https://outpost.mapmyindia.com/api/security/oauth/token?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to get Map API token' });
    }
  } catch (err) {
    console.error('Map API token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
