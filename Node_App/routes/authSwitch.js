const express = require('express');
const router = express.Router();
const SwitchData = require('../model/inputSchema');

// POST / — create or update switch input
router.post('/', async (req, res) => {
  const { var1, var2, var3 } = req.body;

  try {
    let inputdata = await SwitchData.findOne({ var2 });
    if (!inputdata) {
      inputdata = new SwitchData({ var1, var2, var3 });
      await inputdata.save();
      return res.status(201).json({ message: 'Document created successfully' });
    }

    inputdata.var1 = var1;
    inputdata.var3 = var3;
    await inputdata.save();
    res.status(200).json({ message: 'Document updated successfully' });
  } catch (err) {
    console.error('Switch data error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// GET / — get latest switch input for a user
router.get('/', async (req, res) => {
  const userName = req.query.user;

  try {
    const data = await SwitchData.findOne({ var2: userName }).sort('-timestamp');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
