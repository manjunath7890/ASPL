const express = require('express');
const router = express.Router();
const Data = require('../model/dataSchema');
const SOH = require('../model/sohSchema');
const { computeAndStoreSohForDate, getGrade } = require('./vehicleMetricsService');

router.get('/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  const { startDate, endDate, force } = req.query;

  try {
    const rawQuery = { user: vehicleId, v42: 2 };
    if (startDate && endDate) rawQuery.date = { $gte: startDate, $lte: endDate };
    else if (startDate) rawQuery.date = { $gte: startDate };
    else if (endDate) rawQuery.date = { $lte: endDate };

    const distinctDates = await Data.distinct('date', rawQuery);

    if (!distinctDates.length) {
      return res.status(404).json({ error: 'No charging data (v42=2) found for this vehicle.' });
    }

    const allDates = distinctDates
      .map((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10)))
      .sort();

    let cachedDocs = [];
    let datesToCompute = allDates;

    if (force !== 'true') {
      cachedDocs = await SOH.find({
        vehicleId,
        date: { $in: allDates }
      }).lean();

      const cachedDateSet = new Set(cachedDocs.map((doc) => doc.date));
      datesToCompute = allDates.filter((date) => !cachedDateSet.has(date));
    }

    const newDocs = [];
    for (const date of datesToCompute) {
      const doc = await computeAndStoreSohForDate(vehicleId, date);
      if (doc) newDocs.push(doc);
    }

    const allDocs = (force === 'true' ? newDocs : [...cachedDocs, ...newDocs])
      .sort((a, b) => a.date.localeCompare(b.date));

    const history = [];
    const allSkipped = [];

    for (const doc of allDocs) {
      for (const session of (doc.sessions || [])) {
        history.push(session);
      }
      for (const reason of (doc.skippedReasons || [])) {
        allSkipped.push({ date: doc.date, reason });
      }
    }

    if (!history.length) {
      return res.status(404).json({
        error: 'No valid charge sessions passed all filters.',
        datesScanned: allDates.length,
        fromCache: cachedDocs.length,
        freshlyComputed: datesToCompute.length,
        skippedSessions: allSkipped
      });
    }

    const earliest = history[0];
    const latest = history[history.length - 1];
    const recentResults = history.slice(-3);
    const avgSOH = Math.round(
      (recentResults.reduce((sum, record) => sum + record.soh, 0) / recentResults.length) * 10
    ) / 10;

    const capacityLoss = earliest.practical.ah - latest.practical.ah;
    const cycleDelta = latest.cycleCount - earliest.cycleCount;

    res.status(200).json({
      vehicleId,
      ratedCapacityAh: latest.ratedCapacityAh || 0,
      currentSOH: avgSOH,
      currentGrade: getGrade(avgSOH),
      summary: {
        validSessions: history.length,
        skippedSessions: allSkipped.length,
        datesScanned: allDates.length,
        fromCache: allDocs.length - newDocs.length,
        freshlyComputed: newDocs.length,
        dateRange: { from: earliest.date, to: latest.date },
        cycleRange: { from: earliest.cycleCount, to: latest.cycleCount },
        practicalAhRange: {
          earliest: earliest.practical.ah,
          latest: latest.practical.ah,
          lossAh: Math.round(capacityLoss * 100) / 100
        },
        degradationPerCycle: cycleDelta > 0
          ? `${(Math.round((capacityLoss / cycleDelta) * 1000) / 1000)} Ah/cycle`
          : 'Insufficient cycle data'
      },
      history,
      skippedSessions: allSkipped
    });
  } catch (err) {
    console.error('SOH calculation error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
