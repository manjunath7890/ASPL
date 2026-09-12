const express = require('express');
const router = express.Router();
const Data = require('../model/dataSchema');
const LEGACY_DATA_CUTOFF = new Date('2026-02-01T00:00:00.000Z');
const IST_TIME_ZONE = 'Asia/Kolkata';

const getIstDateString = (value) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(value);

  const year = parts.find((part) => part.type === 'year')?.value || '0000';
  const month = parts.find((part) => part.type === 'month')?.value || '00';
  const day = parts.find((part) => part.type === 'day')?.value || '00';
  return `${year}-${month}-${day}`;
};

// POST / — save telemetry data with IST timestamp
router.post('/', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const currentUTCDate = new Date();
    const istTimestamp = new Date(currentUTCDate.getTime() + 5.5 * 60 * 60 * 1000);

    const dataToInsert = {
      ...req.body,
      timestamp: istTimestamp,
      date: getIstDateString(currentUTCDate),
    };

    const data = new Data(dataToInsert);
    await data.save();
    res.json(dataToInsert);
  } catch (err) {
    console.error('Post data error:', err);
    res.status(500).json({ error: 'An error occurred while saving the data' });
  }
});

// GET / — get latest data by user
router.get('/', async (req, res) => {
  const userName = req.query.user;

  try {
    const data = await Data.findOne({ user: userName }).sort('-timestamp');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /documents — get document by date and user
router.get('/documents', async (req, res) => {
  const { fileName, userName } = req.query;

  try {
    const document = await Data.findOne({
      user: userName,
      date: `${fileName}`,
    }).sort('-timestamp');

    if (!document) {
      return res.status(404).json({ error: 'No document found for the given date and user' });
    }
    res.json([document]);
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /brush — brush chart data
router.get('/brush', async (req, res) => {
  const { fileName, userName } = req.query;

  try {
    const data = await Data.find({ date: fileName, user: userName });
    res.json(data);
  } catch (err) {
    console.error('Error fetching brush data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /range — time-range query
router.get('/data', async (req, res) => {
  const { date, user, start, end } = req.query;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const startTimeUTC = new Date(`${date}T${start}:00Z`);
    const endTimeUTC = new Date(`${date}T${end}:00Z`);

    const data = await Data.find({
      date: date,
      user: user,
      timestamp: { $gte: startTimeUTC, $lte: endTimeUTC },
    })
      .sort({ timestamp: 1 })
      .limit(100000);

    res.json(data);
  } catch (err) {
    console.error('Error fetching range data:', err);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// DELETE /temp-cleanup/legacy — temporary cleanup for old or undated telemetry
router.delete('/temp-cleanup/legacy', async (req, res) => {
  const { confirm } = req.query;

  try {
    const cleanupQuery = {
      $or: [
        { timestamp: { $lt: LEGACY_DATA_CUTOFF } },
        { date: { $exists: false } },
        { date: null },
        { date: '' },
        { date: /^\s*$/ }
      ]
    };

    const [matchingCount, dateTypeBreakdown] = await Promise.all([
      Data.collection.countDocuments(cleanupQuery),
      Data.collection.aggregate([
        {
          $project: {
            dateType: { $type: '$date' }
          }
        },
        {
          $group: {
            _id: '$dateType',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]).toArray()
    ]);

    if (confirm !== 'true') {
      return res.status(200).json({
        message: 'Preview only. Pass ?confirm=true to delete matching records.',
        cutoffDate: '2026-02-01',
        wouldDeleteCount: matchingCount,
        dateTypeBreakdown
      });
    }

    const result = await Data.collection.deleteMany(cleanupQuery);
    res.status(200).json({
      message: 'Temporary legacy data cleanup completed.',
      cutoffDate: '2026-02-01',
      deletedCount: result.deletedCount,
      dateTypeBreakdown
    });
  } catch (err) {
    console.error('Error deleting legacy data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE / — delete data by user and date range
router.delete('/', async (req, res) => {
  const { user, start, end } = req.query;

  try {
    const query = {
      user: user,
      date: { $gte: start, $lte: end },
    };

    const result = await Data.deleteMany(query);
    res.json({
      message: 'Data deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
