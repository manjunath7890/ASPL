const Data = require('../model/dataSchema');
const Analytics = require('../model/analyticsSchema');
const AnalyticsMap = require('../model/analyticsMapSchema');
const SOH = require('../model/sohSchema');

const SOC_START_MIN = 20;
const SOC_START_MAX = 30;
const SOC_END_MIN = 70;
const SOC_END_MAX = 80;
const SESSION_GAP_MS = 300000;

const MAX_POINT_GAP_MS = 120000;
const MAX_GAP_RATIO = 0.10;
const MAX_SOC_DROP = 1;
const MIN_DATA_POINTS = 10;
const MIN_CURRENT_A = 0.5;
const MAX_ZERO_CURRENT_RATIO = 0.05;

const formatDuration = (totalMilliseconds) => {
  const totalSeconds = Math.floor((totalMilliseconds || 0) / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Telemetry timestamps are already persisted in IST-normalized form.
// Use UTC getters here so we don't apply a second +05:30 shift while formatting.
const formatIstTime = (value) => {
  const date = new Date(value);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const formatIstDate = (value) => {
  const date = new Date(value);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function getGrade(soh) {
  if (soh >= 90) return 'Excellent';
  if (soh >= 75) return 'Good';
  if (soh >= 60) return 'Fair';
  if (soh >= 40) return 'Poor';
  return 'Critical';
}

function aggregateDocs(docs, sessionType = 'daily') {
  const summary = {
    sessionType,
    startTime: docs.length > 0 ? formatIstTime(docs[0].timestamp) : '00:00:00',
    endTime: docs.length > 0 ? formatIstTime(docs[docs.length - 1].timestamp) : '23:59:59',
    summaryBlocks: {
      wattHourPerKm: { max: 0, avg: 0 },
      vehicleWeight: { max: 0 },
      speedometer: { max: 0, avg: 0 },
      distanceTravelled: { max: 0, trip: 0 },
      batterySoc: { min: 100, trip: 0 },
      current: { max: 0, avg: 0 },
      ahConsumed: { max: 0, trip: 0 },
      controllerTemp: { max: 0, avg: 0 },
      motorTemp: { max: 0, avg: 0 }
    },
    driveSession: {
      maxMinDiffMinutes: 0,
      sessionRanges: [],
      sessionRangeDetails: [],
      gearPercentages: {},
      modePercentages: {}
    },
    chargingSession: {
      initSoc: 100,
      finalSoc: 0,
      avgCurrent: 0,
      mosTemp: 0,
      temp1: 0,
      temp2: 0,
      temp3: 0,
      temp4: 0,
      timeMax: '00:00:00',
      timeMin: '00:00:00',
      timeMinutes: 0,
      ahConsumed: 0,
      faults: []
    },
    reportTable: {
      avgGradient: 0,
      ambTemperature: 0,
      initVoltage: 0,
      finalVoltage: 1000,
      cycles: 0,
      contCurrentMax: 0,
      contCurrentAvg: 0,
      batteryFault: [],
      controllerFault: [],
      AHConsumed: 0,
      maxMosTemperature: 0,
      highCellVoltage: 0,
      lowCellVoltage: 1000
    },
    barChart: {
      avgCurrentAtSoc: Array(10).fill(0),
      avgSpeedAtSoc: Array(10).fill(0),
      tripAtSoc: Array(10).fill(0),
      avgControllerTempAtSoc: Array(10).fill(0),
      avgMotorTempAtSoc: Array(10).fill(0)
    },
    polarChart: {}
  };

  const sums = { v39: 0, v33: 0, v45: 0, v46: 0, v47: 0, v4: 0, v24: 0 };
  const counts = { v39: 0, v33: 0, v45: 0, v46: 0, v47: 0, v4: 0, v24: 0 };
  const v38PerKmMap = new Map();

  const driveTimestamps = [];
  const driveModesCount = {};
  const driveGearsCount = {};

  const chargeTimestamps = [];
  let chargeCurrentSum = 0;
  let chargeCurrentCount = 0;
  const chargeFaults = new Set();

  const driveBatteryFaults = new Set();
  const driveControllerFaults = new Set();

  const barAccumulators = Array(10).fill(null).map(() => ({
    currentSum: 0,
    currentCount: 0,
    speedSum: 0,
    speedCount: 0,
    contTempSum: 0,
    contTempCount: 0,
    motorTempSum: 0,
    motorTempCount: 0,
    distMin: Infinity,
    distMax: -Infinity
  }));

  const polarAccumulators = {};

  let distMin = Infinity;
  let distMax = -Infinity;
  let socMax = -Infinity;
  let socMin = Infinity;
  let socMinNonZero = Infinity;
  let ahMin = Infinity;
  let ahMax = -Infinity;
  let chargeSocMin = Infinity;
  let chargeSocMax = -Infinity;
  let chargeSocMinNonZero = Infinity;
  let chargeAhMin = Infinity;
  let chargeAhMax = -Infinity;

  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];

    if (d.v42 === 3) {
      if (d.v41 !== undefined) {
        distMin = Math.min(distMin, d.v41);
        distMax = Math.max(distMax, d.v41);
      }
      if (d.v32 !== undefined) {
        socMin = Math.min(socMin, d.v32);
        socMax = Math.max(socMax, d.v32);
        if (d.v32 > 0) socMinNonZero = Math.min(socMinNonZero, d.v32);
      }
      if (d.v35 !== undefined) {
        ahMin = Math.min(ahMin, d.v35);
        ahMax = Math.max(ahMax, d.v35);
      }
      if (d.v30 !== undefined) summary.summaryBlocks.vehicleWeight.max = Math.max(summary.summaryBlocks.vehicleWeight.max, d.v30);

      if (d.v34 !== undefined) {
        summary.reportTable.initVoltage = Math.max(summary.reportTable.initVoltage, d.v34);
        summary.reportTable.finalVoltage = Math.min(summary.reportTable.finalVoltage, d.v34);
      }
      if (d.v11 !== undefined) summary.reportTable.maxMosTemperature = Math.max(summary.reportTable.maxMosTemperature, d.v11);
      if (d.v18 !== undefined) summary.reportTable.highCellVoltage = Math.max(summary.reportTable.highCellVoltage, d.v18);
      if (d.v17 !== undefined && d.v17 > 0) summary.reportTable.lowCellVoltage = Math.min(summary.reportTable.lowCellVoltage, d.v17);
      if (d.v22 !== undefined) summary.reportTable.cycles = Math.max(summary.reportTable.cycles, d.v22);
      if (d.v39 > 0) {
        summary.summaryBlocks.speedometer.max = Math.max(summary.summaryBlocks.speedometer.max, d.v39);
        sums.v39 += d.v39;
        counts.v39++;
      }
      if (d.v33 !== undefined && d.v33 !== 0) {
        summary.summaryBlocks.current.max = Math.max(summary.summaryBlocks.current.max, Math.abs(d.v33));
        sums.v33 += Math.abs(d.v33);
        counts.v33++;
      }
      if (d.v45 > 0) {
        summary.summaryBlocks.controllerTemp.max = Math.max(summary.summaryBlocks.controllerTemp.max, d.v45);
        sums.v45 += d.v45;
        counts.v45++;
      }
      if (d.v46 > 0) {
        summary.summaryBlocks.motorTemp.max = Math.max(summary.summaryBlocks.motorTemp.max, d.v46);
        sums.v46 += d.v46;
        counts.v46++;
      }
      if (d.v4 !== undefined && d.v4 > 0) {
        sums.v4 += d.v4;
        counts.v4++;
      }
      if (d.v24 !== undefined && d.v24 > 0) {
        summary.reportTable.contCurrentMax = Math.max(summary.reportTable.contCurrentMax, d.v24);
        sums.v24 += d.v24;
        counts.v24++;
      }

      if (d.v38 !== undefined && d.v38 > 0 && d.v41 !== undefined) {
        const km = Math.floor(d.v41);
        if (!v38PerKmMap.has(km)) v38PerKmMap.set(km, d.v38);
      }
      if (d.v47 !== undefined && d.v47 > 0) {
        sums.v47 += d.v47;
        counts.v47++;
      }

      if (d.v8 !== undefined && d.v8 > 0) driveBatteryFaults.add(d.v8);
      if (d.v7 !== undefined && d.v7 > 0) driveControllerFaults.add(d.v7);

      if (d.timestamp) {
        driveTimestamps.push(new Date(d.timestamp).getTime());
      }

      if (d.v44 !== undefined) driveModesCount[d.v44] = (driveModesCount[d.v44] || 0) + 1;
      if (d.v23 !== undefined && d.v23 > 0) driveGearsCount[d.v23] = (driveGearsCount[d.v23] || 0) + 1;

      if (d.v32 !== undefined) {
        const soc = d.v32;
        let binIndex = 0;
        if (soc <= 10) binIndex = 0;
        else if (soc <= 20) binIndex = 1;
        else if (soc <= 30) binIndex = 2;
        else if (soc <= 40) binIndex = 3;
        else if (soc <= 50) binIndex = 4;
        else if (soc <= 60) binIndex = 5;
        else if (soc <= 70) binIndex = 6;
        else if (soc <= 80) binIndex = 7;
        else if (soc <= 90) binIndex = 8;
        else if (soc <= 100) binIndex = 9;

        const bin = barAccumulators[binIndex];
        if (d.v33 !== undefined && d.v33 !== 0) {
          bin.currentSum += Math.abs(d.v33);
          bin.currentCount++;
        }
        if (d.v39 > 0) {
          bin.speedSum += d.v39;
          bin.speedCount++;
        }
        if (d.v45 > 0) {
          bin.contTempSum += d.v45;
          bin.contTempCount++;
        }
        if (d.v46 > 0) {
          bin.motorTempSum += d.v46;
          bin.motorTempCount++;
        }
        if (d.v41 !== undefined) {
          bin.distMin = Math.min(bin.distMin, d.v41);
          bin.distMax = Math.max(bin.distMax, d.v41);
        }
      }

      if (d.v41 !== undefined && typeof d.v41 === 'number' && d.v38 !== undefined && d.v38 > 0) {
        const startKm = Math.floor(d.v41 / 5) * 5;
        const endKm = startKm + 5;
        const key = `avgWhrkmat${startKm}-${endKm}km`;
        if (!polarAccumulators[key]) polarAccumulators[key] = { sum: 0, count: 0 };
        polarAccumulators[key].sum += d.v38;
        polarAccumulators[key].count++;
      }
    }

    if (d.v42 === 2) {
      if (d.v22 !== undefined) summary.reportTable.cycles = Math.max(summary.reportTable.cycles, d.v22);
      if (d.v32 !== undefined) {
        chargeSocMin = Math.min(chargeSocMin, d.v32);
        chargeSocMax = Math.max(chargeSocMax, d.v32);
        if (d.v32 > 0) chargeSocMinNonZero = Math.min(chargeSocMinNonZero, d.v32);
      }
      if (d.v35 !== undefined) {
        chargeAhMin = Math.min(chargeAhMin, d.v35);
        chargeAhMax = Math.max(chargeAhMax, d.v35);
      }
      if (d.v33 !== undefined && d.v33 < 0) {
        chargeCurrentSum += d.v33;
        chargeCurrentCount++;
      }
      if (d.v11 !== undefined) summary.chargingSession.mosTemp = Math.max(summary.chargingSession.mosTemp, d.v11);
      if (d.v13 !== undefined) summary.chargingSession.temp1 = Math.max(summary.chargingSession.temp1, d.v13);
      if (d.v14 !== undefined) summary.chargingSession.temp2 = Math.max(summary.chargingSession.temp2, d.v14);
      if (d.v15 !== undefined) summary.chargingSession.temp3 = Math.max(summary.chargingSession.temp3, d.v15);
      if (d.v16 !== undefined) summary.chargingSession.temp4 = Math.max(summary.chargingSession.temp4, d.v16);
      if (d.v8 !== undefined && d.v8 > 0) chargeFaults.add(d.v8);

      if (d.timestamp && d.v33 < 0) {
        chargeTimestamps.push(new Date(d.timestamp).getTime());
      }
    }
  }

  const v38Values = Array.from(v38PerKmMap.values());
  if (v38Values.length > 0) {
    summary.summaryBlocks.wattHourPerKm.max = Math.max(...v38Values);
    summary.summaryBlocks.wattHourPerKm.avg = Math.floor(v38Values.reduce((s, v) => s + v, 0) / v38Values.length);
  }
  summary.summaryBlocks.speedometer.avg = counts.v39 ? Math.floor(sums.v39 / counts.v39) : 0;
  summary.summaryBlocks.current.avg = counts.v33 ? Math.floor(sums.v33 / counts.v33) : 0;
  summary.summaryBlocks.controllerTemp.avg = counts.v45 ? Math.floor(sums.v45 / counts.v45) : 0;
  summary.summaryBlocks.motorTemp.avg = counts.v46 ? Math.floor(sums.v46 / counts.v46) : 0;

  summary.summaryBlocks.distanceTravelled.max = distMax !== -Infinity ? distMax : 0;
  summary.summaryBlocks.distanceTravelled.trip = (distMax !== -Infinity && distMin !== Infinity) ? distMax - distMin : 0;
  const effectiveSocMin = socMinNonZero !== Infinity ? socMinNonZero : (socMin !== Infinity ? socMin : 0);
  summary.summaryBlocks.batterySoc.min = effectiveSocMin;
  summary.summaryBlocks.batterySoc.trip = socMax !== -Infinity ? socMax - effectiveSocMin : 0;
  summary.summaryBlocks.ahConsumed.max = ahMax !== -Infinity ? ahMax : 0;
  summary.summaryBlocks.ahConsumed.trip = (ahMax !== -Infinity && ahMin !== Infinity) ? parseFloat((ahMax - ahMin).toFixed(1)) : 0;

  summary.reportTable.avgGradient = counts.v47 ? Math.floor(sums.v47 / counts.v47) : 0;
  summary.reportTable.ambTemperature = counts.v4 ? Math.floor(sums.v4 / counts.v4) : 0;
  summary.reportTable.contCurrentAvg = counts.v24 ? Math.floor(sums.v24 / counts.v24) : 0;
  summary.reportTable.AHConsumed = summary.summaryBlocks.ahConsumed.trip;
  summary.reportTable.batteryFault = Array.from(driveBatteryFaults);
  summary.reportTable.controllerFault = Array.from(driveControllerFaults);
  if (summary.reportTable.finalVoltage === 1000) summary.reportTable.finalVoltage = 0;
  if (summary.reportTable.lowCellVoltage === 1000) summary.reportTable.lowCellVoltage = 0;

  const processSessionTimestamps = (timestampsArray) => {
    if (!timestampsArray.length) {
      return { maxMinDiffMinutes: 0, sessionRanges: [], sessionRangeDetails: [], max: '00:00:00', min: '00:00:00' };
    }

    timestampsArray.sort((a, b) => a - b);
    const minDate = new Date(timestampsArray[0]);
    const maxDate = new Date(timestampsArray[timestampsArray.length - 1]);
    const diffMin = Math.floor((maxDate - minDate) / 60000);

    const sessionRanges = [];
    const sessionRangeDetails = [];
    let segmentStart = timestampsArray[0];

    for (let i = 1; i < timestampsArray.length; i++) {
      if ((timestampsArray[i] - timestampsArray[i - 1]) >= 30000) {
        const segmentDurationMs = timestampsArray[i - 1] - segmentStart;
        const sT = formatIstTime(segmentStart);
        const eT = formatIstTime(timestampsArray[i - 1]);
        sessionRanges.push(`${sT} - ${eT}`);
        sessionRangeDetails.push({
          start: sT,
          end: eT,
          minutes: +(segmentDurationMs / 60000).toFixed(2),
          durationHHMMSS: formatDuration(segmentDurationMs)
        });
        segmentStart = timestampsArray[i];
      }
    }

    const finalDurationMs = timestampsArray[timestampsArray.length - 1] - segmentStart;
    const fsT = formatIstTime(segmentStart);
    const feT = formatIstTime(timestampsArray[timestampsArray.length - 1]);
    sessionRanges.push(`${fsT} - ${feT}`);
    sessionRangeDetails.push({
      start: fsT,
      end: feT,
      minutes: +(finalDurationMs / 60000).toFixed(2),
      durationHHMMSS: formatDuration(finalDurationMs)
    });

    return {
      maxMinDiffMinutes: diffMin,
      sessionRanges,
      sessionRangeDetails,
      min: formatIstTime(minDate),
      max: formatIstTime(maxDate)
    };
  };

  const drvSesh = processSessionTimestamps(driveTimestamps);
  summary.driveSession.maxMinDiffMinutes = drvSesh.maxMinDiffMinutes;
  summary.driveSession.sessionRanges = drvSesh.sessionRanges;
  summary.driveSession.sessionRangeDetails = drvSesh.sessionRangeDetails;

  const computePercents = (countsObj) => {
    const total = Object.values(countsObj).reduce((a, b) => a + b, 0);
    const output = {};
    if (total === 0) return output;

    Object.keys(countsObj).forEach((key) => {
      output[key] = parseFloat(((countsObj[key] / total) * 100).toFixed(1));
    });

    return output;
  };

  summary.driveSession.gearPercentages = computePercents(driveGearsCount);
  summary.driveSession.modePercentages = computePercents(driveModesCount);

  const chgSesh = processSessionTimestamps(chargeTimestamps);
  const effectiveChargeSocMin = chargeSocMinNonZero !== Infinity ? chargeSocMinNonZero : (chargeSocMin !== Infinity ? chargeSocMin : 10);
  summary.chargingSession.timeMax = chgSesh.max;
  summary.chargingSession.timeMin = chgSesh.min;
  summary.chargingSession.timeMinutes = chgSesh.maxMinDiffMinutes;
  summary.chargingSession.initSoc = effectiveChargeSocMin;
  summary.chargingSession.finalSoc = chargeSocMax !== -Infinity ? chargeSocMax : 10;
  summary.chargingSession.avgCurrent = chargeCurrentCount ? parseFloat((chargeCurrentSum / chargeCurrentCount).toFixed(2)) : 0;
  summary.chargingSession.ahConsumed = (chargeAhMax !== -Infinity && chargeAhMin !== Infinity) ? parseFloat((chargeAhMax - chargeAhMin).toFixed(1)) : 0;
  summary.chargingSession.faults = Array.from(chargeFaults);

  barAccumulators.forEach((bin, index) => {
    summary.barChart.avgCurrentAtSoc[index] = bin.currentCount ? Math.floor(bin.currentSum / bin.currentCount) : 0;
    summary.barChart.avgSpeedAtSoc[index] = bin.speedCount ? Math.floor(bin.speedSum / bin.speedCount) : 0;
    summary.barChart.avgControllerTempAtSoc[index] = bin.contTempCount ? Math.floor(bin.contTempSum / bin.contTempCount) : 0;
    summary.barChart.avgMotorTempAtSoc[index] = bin.motorTempCount ? Math.floor(bin.motorTempSum / bin.motorTempCount) : 0;
    summary.barChart.tripAtSoc[index] = (bin.distMax !== -Infinity && bin.distMin !== Infinity) ? bin.distMax - bin.distMin : 0;
  });

  Object.keys(polarAccumulators).forEach((key) => {
    summary.polarChart[key] = Math.floor(polarAccumulators[key].sum / polarAccumulators[key].count);
  });

  return summary;
}

function groupIntoChargeSessions(docs) {
  if (!docs.length) return [];

  const sessions = [];
  let current = [docs[0]];

  for (let i = 1; i < docs.length; i++) {
    const gap = new Date(docs[i].timestamp).getTime() - new Date(docs[i - 1].timestamp).getTime();
    if (gap > SESSION_GAP_MS) {
      sessions.push(current);
      current = [];
    }
    current.push(docs[i]);
  }

  if (current.length) sessions.push(current);
  return sessions;
}

function validateContinuity(windowDocs) {
  const details = {
    totalPoints: windowDocs.length,
    totalTimeMs: 0,
    maxGapMs: 0,
    totalGapMs: 0,
    gapRatio: 0,
    socDrops: 0,
    maxSocDrop: 0,
    zeroCurrent: 0,
    zeroCurrRatio: 0
  };

  if (windowDocs.length < MIN_DATA_POINTS) {
    return { valid: false, reason: `Too few data points: ${windowDocs.length} (need >=${MIN_DATA_POINTS})`, details };
  }

  let totalGapMs = 0;
  let maxGapMs = 0;
  let socDrops = 0;
  let maxSocDrop = 0;
  let zeroCurrent = 0;

  for (let i = 1; i < windowDocs.length; i++) {
    const dt = new Date(windowDocs[i].timestamp).getTime() - new Date(windowDocs[i - 1].timestamp).getTime();
    if (dt > MAX_POINT_GAP_MS) totalGapMs += dt;
    maxGapMs = Math.max(maxGapMs, dt);

    const drop = (windowDocs[i - 1].v32 || 0) - (windowDocs[i].v32 || 0);
    if (drop > MAX_SOC_DROP) {
      socDrops++;
      maxSocDrop = Math.max(maxSocDrop, drop);
    }

    if (Math.abs(windowDocs[i].v33 || 0) < MIN_CURRENT_A) zeroCurrent++;
  }

  const totalTimeMs = new Date(windowDocs[windowDocs.length - 1].timestamp).getTime() - new Date(windowDocs[0].timestamp).getTime();
  const gapRatio = totalTimeMs > 0 ? totalGapMs / totalTimeMs : 0;
  const zeroCurrRatio = (windowDocs.length - 1) > 0 ? zeroCurrent / (windowDocs.length - 1) : 0;

  Object.assign(details, {
    totalTimeMs,
    maxGapMs,
    totalGapMs,
    gapRatio: Math.round(gapRatio * 1000) / 10,
    socDrops,
    maxSocDrop,
    zeroCurrent,
    zeroCurrRatio: Math.round(zeroCurrRatio * 1000) / 10
  });

  if (maxGapMs > MAX_POINT_GAP_MS) {
    return { valid: false, reason: `Data gap too large: ${(maxGapMs / 1000).toFixed(0)}s (max ${MAX_POINT_GAP_MS / 1000}s)`, details };
  }
  if (gapRatio > MAX_GAP_RATIO) {
    return { valid: false, reason: `Too much gap time: ${(gapRatio * 100).toFixed(1)}% (max ${MAX_GAP_RATIO * 100}%)`, details };
  }
  if (socDrops > 0) {
    return { valid: false, reason: `SOC dropped ${socDrops} time(s) (max drop: ${maxSocDrop}%) - charger likely unplugged`, details };
  }
  if (zeroCurrRatio > MAX_ZERO_CURRENT_RATIO) {
    return { valid: false, reason: `${(zeroCurrRatio * 100).toFixed(1)}% near-zero current - charger inactive`, details };
  }

  return { valid: true, reason: 'OK', details };
}

function analyzeChargeSession(sessionDocs) {
  let startIdx = -1;
  for (let i = 0; i < sessionDocs.length; i++) {
    const soc = sessionDocs[i].v32;
    if (soc !== undefined && soc >= SOC_START_MIN && soc <= SOC_START_MAX) {
      startIdx = i;
      break;
    }
  }

  let endIdx = -1;
  for (let i = sessionDocs.length - 1; i >= 0; i--) {
    const soc = sessionDocs[i].v32;
    if (soc !== undefined && soc >= SOC_END_MIN && soc <= SOC_END_MAX) {
      endIdx = i;
      break;
    }
  }

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;

  const windowDocs = sessionDocs.slice(startIdx, endIdx + 1);
  const continuity = validateContinuity(windowDocs);
  if (!continuity.valid) return { skipped: true, reason: continuity.reason, details: continuity.details };

  let practicalAh = 0;
  let currentSum = 0;
  let currentCount = 0;

  for (let i = 1; i < windowDocs.length; i++) {
    const previousCurrent = Math.abs(windowDocs[i - 1].v33 || 0);
    const current = Math.abs(windowDocs[i].v33 || 0);
    const dtHours = (new Date(windowDocs[i].timestamp).getTime() - new Date(windowDocs[i - 1].timestamp).getTime()) / 3600000;
    practicalAh += ((previousCurrent + current) / 2) * dtHours;
    currentSum += current;
    currentCount++;
  }

  if (practicalAh <= 0) return null;

  const ratedCapacityAh = windowDocs.find((doc) => doc.v9 && doc.v9 > 0)?.v9 || 0;
  if (!ratedCapacityAh) return null;

  const socStart = windowDocs[0].v32;
  const socEnd = windowDocs[windowDocs.length - 1].v32;
  const deltaSoc = socEnd - socStart;
  if (deltaSoc <= 0) return null;

  const theoreticalAh = ratedCapacityAh * (deltaSoc / 100);
  const practicalTimeMin = (new Date(windowDocs[windowDocs.length - 1].timestamp) - new Date(windowDocs[0].timestamp)) / 60000;
  const avgCurrent = currentCount > 0 ? currentSum / currentCount : 0;
  const theoreticalTimeMin = avgCurrent > 0 ? (theoreticalAh / avgCurrent) * 60 : 0;
  const efficiency = (practicalAh / theoreticalAh) * 100;
  const cycleCount = windowDocs[windowDocs.length - 1].v22 || windowDocs[0].v22 || 0;
  const soh = Math.round(Math.min(efficiency, 100) * 10) / 10;

  return {
    skipped: false,
    date: formatIstDate(windowDocs[0].timestamp),
    cycleCount,
    ratedCapacityAh,
    socWindow: {
      start: socStart,
      end: socEnd,
      delta: Math.round(deltaSoc * 10) / 10
    },
    practical: {
      ah: Math.round(practicalAh * 100) / 100,
      timeMinutes: Math.round(practicalTimeMin * 10) / 10,
      avgCurrentA: Math.round(avgCurrent * 100) / 100,
      dataPoints: windowDocs.length
    },
    theoretical: {
      ah: Math.round(theoreticalAh * 100) / 100,
      timeMinutes: Math.round(theoreticalTimeMin * 10) / 10
    },
    efficiency: Math.round(efficiency * 10) / 10,
    soh,
    grade: getGrade(soh),
    continuity: continuity.details
  };
}

function buildAnalyticsPayloadFromDocs(vehicleId, date, docs) {
  const wholeDay = aggregateDocs(docs, 'daily');
  const sessions = [];
  const mapRoutes = [];
  let currentSessionDocs = [];
  let currentType = null;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    if (doc.v49 !== undefined && doc.v50 !== undefined) {
      mapRoutes.push({ lat: doc.v49, lng: doc.v50, timestamp: doc.timestamp });
    }

    let timeDelta = 0;
    if (i > 0 && currentSessionDocs.length > 0) {
      timeDelta = new Date(doc.timestamp).getTime() - new Date(docs[i - 1].timestamp).getTime();
    }

    const isGap = timeDelta >= 1800000;
    const mode = doc.v42;

    let targetType = null;
    if (mode === 3) targetType = 'Drive Session';
    else if (mode === 2) targetType = 'Charge Session';

    if (
      currentSessionDocs.length > 0 &&
      (isGap || (targetType !== currentType && targetType !== null) || (mode !== 3 && mode !== 2))
    ) {
      if (currentType !== null && currentSessionDocs.length > 0) {
        sessions.push(aggregateDocs(currentSessionDocs, currentType));
      }
      currentSessionDocs = [];
      currentType = null;
    }

    if (targetType) {
      if (!currentType) currentType = targetType;
      currentSessionDocs.push(doc);
    }
  }

  if (currentSessionDocs.length > 0 && currentType !== null) {
    sessions.push(aggregateDocs(currentSessionDocs, currentType));
  }

  return {
    vehicleId,
    date,
    wholeDay,
    sessions,
    mapRoutes
  };
}

function buildSohPayloadFromDocs(vehicleId, date, docs) {
  const chargingDocs = docs.filter((doc) => doc.v42 === 2);
  if (!chargingDocs.length) return null;

  const rawSessions = groupIntoChargeSessions(chargingDocs);
  const validSessions = [];
  const skippedReasons = [];

  for (const session of rawSessions) {
    const result = analyzeChargeSession(session);
    if (!result) continue;
    if (result.skipped) skippedReasons.push(result.reason);
    else validSessions.push(result);
  }

  return {
    vehicleId,
    date,
    ratedCapacityAh: validSessions.length ? validSessions[0].ratedCapacityAh : 0,
    sessions: validSessions,
    skippedReasons,
    computedAt: new Date()
  };
}

async function fetchDayDocs(vehicleId, date) {
  return Data.find({ user: vehicleId, date }).sort({ timestamp: 1 }).lean();
}

async function upsertSohPayload(sohPayload) {
  if (!sohPayload) return null;

  return SOH.findOneAndUpdate(
    { vehicleId: sohPayload.vehicleId, date: sohPayload.date },
    sohPayload,
    { new: true, upsert: true }
  );
}

async function computeAndStoreSohForDate(vehicleId, date, docs) {
  const dayDocs = docs || await fetchDayDocs(vehicleId, date);
  if (!dayDocs.length) return null;

  const sohPayload = buildSohPayloadFromDocs(vehicleId, date, dayDocs);
  const doc = await upsertSohPayload(sohPayload);
  return doc ? (doc.toObject ? doc.toObject() : doc) : null;
}

async function generateAndStoreVehicleMetrics(vehicleId, date) {
  const docs = await fetchDayDocs(vehicleId, date);
  if (!docs.length) return null;

  const analyticsPayload = buildAnalyticsPayloadFromDocs(vehicleId, date, docs);
  const sohPayload = buildSohPayloadFromDocs(vehicleId, date, docs);

  const [analyticsDoc, analyticsMapDoc, sohDoc] = await Promise.all([
    Analytics.findOneAndUpdate(
      { vehicleId, date },
      {
        vehicleId,
        date,
        wholeDay: analyticsPayload.wholeDay,
        sessions: analyticsPayload.sessions
      },
      { new: true, upsert: true }
    ),
    AnalyticsMap.findOneAndUpdate(
      { vehicleId, date },
      { vehicleId, date, mapRoutes: analyticsPayload.mapRoutes },
      { new: true, upsert: true }
    ),
    upsertSohPayload(sohPayload)
  ]);

  return {
    docs,
    analytics: analyticsDoc ? (analyticsDoc.toObject ? analyticsDoc.toObject() : analyticsDoc) : {
      vehicleId,
      date,
      wholeDay: analyticsPayload.wholeDay,
      sessions: analyticsPayload.sessions
    },
    analyticsMap: analyticsMapDoc ? (analyticsMapDoc.toObject ? analyticsMapDoc.toObject() : analyticsMapDoc) : {
      vehicleId,
      date,
      mapRoutes: analyticsPayload.mapRoutes
    },
    soh: sohDoc ? (sohDoc.toObject ? sohDoc.toObject() : sohDoc) : null
  };
}

module.exports = {
  computeAndStoreSohForDate,
  generateAndStoreVehicleMetrics,
  getGrade
};
