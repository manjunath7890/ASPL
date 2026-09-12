const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const Analytics = require('../model/analyticsSchema');
const AnalyticsMap = require('../model/analyticsMapSchema');
const Data = require('../model/dataSchema');
const Vehicle = require('../model/registerSchema');
const { generateAndStoreVehicleMetrics } = require('./vehicleMetricsService');

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

// Vercel Serverless Cron Endpoint — triggers every day at 23:59 IST
router.get('/cron-daily', async (req, res) => {
  // Optional security: Ensure request comes from Vercel by checking CRON_SECRET
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized cron request' });
  }

  console.log('Starting daily auto-generation of analytics for all active vehicles...');
  try {
    const todayStr = getIstDateString(new Date());
    
    // Find all registered vehicleIds
    const vehicleIds = await Vehicle.distinct('vehicleId');
    
    if (!vehicleIds || vehicleIds.length === 0) {
      console.log('No registered vehicles found. Skipping analytics generation.');
      return res.status(200).json({ status: 'skipped', message: 'No vehicles found' });
    }

    console.log(`Found ${vehicleIds.length} registered vehicles. Processing...`);

    // In a serverless environment, you might want to return 200 OK immediately and process in background,
    // OR wait for it if it takes less than 10 seconds. Since it's a cron job, we can wait.
    for (const vehicleId of vehicleIds) {
      try {
        await generateAndStoreVehicleMetrics(vehicleId, todayStr);
        console.log(`Successfully generated analytics for vehicle: ${vehicleId}`);
      } catch (innerErr) {
        console.error(`Error generating analytics for vehicle ${vehicleId}:`, innerErr.message);
      }
    }
    console.log('Daily auto-generation of analytics completed.');
    return res.status(200).json({ status: 'success', processed: vehicleIds.length });
  } catch (error) {
    console.error('Error in daily analytics cron job:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  const { vehicleId, date } = req.body;
  if (!vehicleId || !date) {
    return res.status(400).json({ error: 'vehicleId and date (YYYY-MM-DD) are required' });
  }

  try {
    const result = await generateAndStoreVehicleMetrics(vehicleId, date);

    if (!result) {
      return res.status(404).json({ error: 'No data found for this vehicle on this date' });
    }

    res.status(200).json({
      message: result.soh ? 'Daily analytics and SOH generated successfully' : 'Daily analytics generated successfully',
      summary: result.analytics,
      soh: result.soh
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/:vehicleId', async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { vehicleId: req.params.vehicleId };

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = startDate;
  }

  try {
    const records = await Analytics.find(query).sort({ date: 1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:vehicleId/map', async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { vehicleId: req.params.vehicleId };

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = startDate;
  }

  try {
    const records = await AnalyticsMap.find(query).sort({ date: 1 }).lean();
    res.status(200).json(records);
  } catch (error) {
    console.error('Analytics Map fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
