const mongoose = require('mongoose');

const sessionMetricsSchema = new mongoose.Schema({
  sessionType: { type: String, default: 'daily' }, // 'daily', 'drive', 'charge'
  startTime: { type: String, default: '00:00:00' },
  endTime: { type: String, default: '23:59:59' },

  summaryBlocks: {
    wattHourPerKm: { max: { type: Number, default: 0 }, avg: { type: Number, default: 0 } },
    vehicleWeight: { max: { type: Number, default: 0 } },
    speedometer: { max: { type: Number, default: 0 }, avg: { type: Number, default: 0 } },
    distanceTravelled: { max: { type: Number, default: 0 }, trip: { type: Number, default: 0 } },
    batterySoc: { min: { type: Number, default: 0 }, trip: { type: Number, default: 0 } },
    current: { max: { type: Number, default: 0 }, avg: { type: Number, default: 0 } },
    ahConsumed: { max: { type: Number, default: 0 }, trip: { type: Number, default: 0 } },
    controllerTemp: { max: { type: Number, default: 0 }, avg: { type: Number, default: 0 } },
    motorTemp: { max: { type: Number, default: 0 }, avg: { type: Number, default: 0 } },
  },

  driveSession: {
    maxMinDiffMinutes: { type: Number, default: 0 },
    sessionRanges: [{ type: String }],
    sessionRangeDetails: [{
      start: String, end: String, minutes: Number, durationHHMMSS: String
    }],
    gearPercentages: { type: Map, of: Number, default: {} },
    modePercentages: { type: Map, of: Number, default: {} },
  },

  chargingSession: {
    initSoc: { type: Number, default: 0 }, finalSoc: { type: Number, default: 0 },
    avgCurrent: { type: Number, default: 0 }, mosTemp: { type: Number, default: 0 },
    temp1: { type: Number, default: 0 }, temp2: { type: Number, default: 0 },
    temp3: { type: Number, default: 0 }, temp4: { type: Number, default: 0 },
    timeMax: { type: String, default: '00:00:00' }, timeMin: { type: String, default: '00:00:00' },
    timeMinutes: { type: Number, default: 0 }, ahConsumed: { type: Number, default: 0 },
    faults: [{ type: Number }]
  },

  reportTable: {
    avgGradient: { type: Number, default: 0 }, ambTemperature: { type: Number, default: 0 },
    initVoltage: { type: Number, default: 0 }, finalVoltage: { type: Number, default: 0 },
    cycles: { type: Number, default: 0 }, contCurrentMax: { type: Number, default: 0 },
    contCurrentAvg: { type: Number, default: 0 }, batteryFault: [{ type: Number }],
    controllerFault: [{ type: Number }], AHConsumed: { type: Number, default: 0 },
    maxMosTemperature: { type: Number, default: 0 }, highCellVoltage: { type: Number, default: 0 },
    lowCellVoltage: { type: Number, default: 0 },
  },

  barChart: {
    avgCurrentAtSoc: [{ type: Number }], avgSpeedAtSoc: [{ type: Number }],
    tripAtSoc: [{ type: Number }], avgControllerTempAtSoc: [{ type: Number }],
    avgMotorTempAtSoc: [{ type: Number }]
  },

  polarChart: { type: Map, of: Number, default: {} }
}, { _id: false });

const analyticsSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  
  wholeDay: sessionMetricsSchema,
  sessions: [sessionMetricsSchema]
});

analyticsSchema.index({ vehicleId: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
