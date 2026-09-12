const mongoose = require('mongoose');

const sohSessionSchema = new mongoose.Schema({
  date: { type: String },
  cycleCount: { type: Number, default: 0 },
  ratedCapacityAh: { type: Number, default: 0 },
  socWindow: {
    start: { type: Number, default: 0 },
    end:   { type: Number, default: 0 },
    delta: { type: Number, default: 0 }
  },
  practical: {
    ah:          { type: Number, default: 0 },
    timeMinutes: { type: Number, default: 0 },
    avgCurrentA: { type: Number, default: 0 },
    dataPoints:  { type: Number, default: 0 }
  },
  theoretical: {
    ah:          { type: Number, default: 0 },
    timeMinutes: { type: Number, default: 0 }
  },
  efficiency: { type: Number, default: 0 },
  soh:        { type: Number, default: 0 },
  grade:      { type: String, default: '' },
  continuity: {
    totalPoints:   { type: Number, default: 0 },
    totalTimeMs:   { type: Number, default: 0 },
    maxGapMs:      { type: Number, default: 0 },
    totalGapMs:    { type: Number, default: 0 },
    gapRatio:      { type: Number, default: 0 },
    socDrops:      { type: Number, default: 0 },
    maxSocDrop:    { type: Number, default: 0 },
    zeroCurrent:   { type: Number, default: 0 },
    zeroCurrRatio: { type: Number, default: 0 }
  }
}, { _id: false });

const sohSchema = new mongoose.Schema({
  vehicleId:       { type: String, required: true },
  date:            { type: String, required: true },   // YYYY-MM-DD
  ratedCapacityAh: { type: Number, default: 0 },
  sessions:        [sohSessionSchema],
  skippedReasons:  [{ type: String }],
  computedAt:      { type: Date, default: Date.now }
});

sohSchema.index({ vehicleId: 1, date: 1 }, { unique: true });

const SOH = mongoose.model('SOH', sohSchema);
module.exports = SOH;
