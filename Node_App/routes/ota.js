const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const otaFolder = path.resolve(__dirname, '..', 'otaFiles');

router.get('/latest', (req, res) => {
  const latestPath = path.resolve(otaFolder, 'latest.json');
  fs.readFile(latestPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read latest.json:', err);
      return res.status(500).json({ error: 'Could not fetch latest version info' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Invalid version info format' });
    }
  });
});

router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const resolvedPath = path.resolve(otaFolder, filename);
  if (!resolvedPath.startsWith(otaFolder + path.sep)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      console.error('OTA file stat error:', err);
      return res.status(500).json({ error: 'Unable to access file' });
    }

    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Requested path is not a file' });
    }

    res.download(resolvedPath, filename, (downloadErr) => {
      if (downloadErr) {
        console.error('OTA download error:', downloadErr);
        if (!res.headersSent) {
          res.status(500).json({ error: 'File download failed' });
        }
      }
    });
  });
});

module.exports = router;
