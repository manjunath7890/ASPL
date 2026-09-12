const mongoose = require('mongoose');

const analyticsMapSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  
  // Dedicated array for raw map route coordinates
  mapRoutes: [{ lat: Number, lng: Number, timestamp: Date }]
});

// Enforce unique record per vehicle per day
analyticsMapSchema.index({ vehicleId: 1, date: 1 }, { unique: true });

const AnalyticsMap = mongoose.model('AnalyticsMap', analyticsMapSchema);
module.exports = AnalyticsMap;
