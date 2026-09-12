import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  useTheme,
  Grid,
  Button,
  InputLabel,
  Select,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import { EnergySavingsLeaf, SwapCalls } from "@mui/icons-material";

import { tokens } from "../../theme";
import RepoData from "../../components/ReportData";

import { getGrade } from "./utils/helpers";
import {
  QUICK_FILTERS,
  MODE_LABELS,
  getBaseChartOptions,
} from "./utils/constants";
import SkeletonCard from "./components/SkeletonCard";
import TabPanel from "./components/TabPanel";

import TemperatureTab from "./tabs/TemperatureTab";
import PerformanceTab from "./tabs/PerformanceTab";
import ChargingTab from "./tabs/ChargingTab";
import HealthTab from "./tabs/HealthTab";
import SessionTableTab from "./tabs/SessionTableTab";

export default function MultiAnalytics() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const p = colors.palette;

  // ── State ──────────────────────────────────────────────────────────────────
  const [userId, setUserId] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclesData, setVehiclesData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [quickFilter, setQuickFilter] = useState(1); // default: Last 7d
  const [metrics, setMetrics] = useState(null);
  const [sohData, setSohData] = useState(null);

  // ── Design tokens ──────────────────────────────────────────────────────────
  const fg = p[150];
  const tx = p[100];
  const tip = isDark ? "dark" : "light";
  const cardBg = isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)";
  const hdrBg = isDark ? "rgba(66,69,71,0.78)" : "rgba(255,255,255,0.82)";

  const style = {
    color: colors.palette[110],
    margin: "0.2rem",
    fontSize: "2rem",
    padding: "0.1rem",
  };

  const cardSx = {
    border: isDark
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)",
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)",
    boxShadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)",
    borderRadius: "0.9rem",
    backdropFilter: "blur(8px)",
  };

  const base = getBaseChartOptions(fg, theme.typography.fontFamily);
  const baseTooltip = { theme: tip };

  const themeOptions = { fg, tx, p, cardSx, cardBg, hdrBg, base, baseTooltip };

  // ── Fetch vehicles once ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${p[50]}/vehicles`)
      .then((r) => r.json())
      .then((vd) => {
        setVehiclesData(vd);
        // Auto-select first vehicle if userId is empty
        if (!userId && vd.length > 0) {
          setUserId(vd[0].vehicleId);
          setVehicleNo(vd[0].vehicleNo);
          setVehicleModel(vd[0].name);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line
  }, []);

  // ── Fetch analytics data ───────────────────────────────────────────────────
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const s = startDate.format("YYYY-MM-DD");
      const e = endDate.format("YYYY-MM-DD");
      const res = await fetch(
        `${p[50]}/analytics/${userId}?startDate=${s}&endDate=${e}`,
      );
      const json = await res.json();
      setData(json);

      // Fetch Soh
      try {
        const sohRes = await fetch(
          `${p[50]}/soh/${userId}?startDate=${s}&endDate=${e}`,
        );
        const sohJson = await sohRes.json();
        setSohData(sohJson);
      } catch (err) {
        console.error("SOH fetch error:", err);
        setSohData({ error: true });
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Aggregate data ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data || data.length === 0) {
      setMetrics(null);
      return;
    }

    const getFaultArray = (f) =>
      Array.isArray(f) ? f : f && f !== "None" ? [String(f)] : [];

    let tDist = 0,
      tOdo = 0,
      tAh = 0;
    let totalDriveSessions = 0,
      totalChargeSessions = 0;
    let overallAvgCurrent = 0,
      totalAvgCurrentCount = 0;
    let overallWhSum = 0,
      overallWhCount = 0,
      overallSpdMax = 0,
      overallSpdSum = 0,
      overallSpdCount = 0;
    let overallMtrSum = 0,
      overallMtrCount = 0,
      overallCtrlSum = 0,
      overallCtrlCount = 0,
      overallMosSum = 0,
      overallMosCount = 0;
    let overallEcoSum = 0,
      overallEcoCount = 0;
    let overallFaults = [];
    let minC = Infinity,
      maxC = -Infinity;

    const dates = [],
      distSeries = [],
      ahSeries = [],
      kwhSeries = [],
      whSeries = [],
      whPerKmSeries = [];
    const spdMaxSeries = [],
      spdAvgSeries = [];
    const ctrlMaxSeries = [],
      ctrlAvgSeries = [];
    const mtrMaxSeries = [],
      mtrAvgSeries = [];
    const mosMaxSeries = [];
    const socMinSeries = [],
      volMinSeries = [],
      cellMinSeries = [],
      cellMaxSeries = [];
    const chargeSocSeries = [],
      chargeSocRangeSeries = [],
      chargeCurrentSeries = [],
      chargeDurationSeries = [],
      chargeMosSeries = [];
    const t1Series = [],
      t2Series = [],
      t3Series = [],
      t4Series = [];
    const bmsFaultSeries = [],
      tableRows = [];
    const gradeNumericSeries = [],
      gradePctSeries = [],
      gradeColorSeries = [];
    const parkSeries = [],
      ecoSeries = [],
      driveSeries = [],
      revSeries = [],
      gear1Series = [],
      gear2Series = [];
    const chargeKwhSeries = [],
      cRateSeries = [],
      cellDeltaSeries = [],
      packInitVSeries = [],
      packFinalVSeries = [],
      socSeries = [],
      cyclesSeries = [];

    let mergedMode = {},
      mergedGear = {},
      mergedPolar = {};
    const socA = Array(10).fill(0),
      socSpd = Array(10).fill(0);
    const socTrip = Array(10).fill(0),
      socCtrl = Array(10).fill(0);
    const socMtr = Array(10).fill(0),
      socSpdCount = Array(10).fill(0);

    data.forEach((day) => {
      const w = day.wholeDay;
      if (!w) return;

      const dist = w.summaryBlocks?.distanceTravelled?.trip || 0;
      const spdMax = w.summaryBlocks?.speedometer?.max || 0;
      const cMin = w.chargingSession?.timeMinutes || 0;

      // Skip days where nothing happened
      if (dist === 0 && spdMax === 0 && cMin === 0) return;

      const totalDist = w.summaryBlocks?.distanceTravelled?.max || 0;
      const socM = w.summaryBlocks?.batterySoc?.min ?? 0;
      const socMax = w.summaryBlocks?.batterySoc?.max || 0;
      const ah = w.summaryBlocks?.ahConsumed?.trip || 0;
      const socConsumed =
        w.summaryBlocks?.batterySoc?.trip ||
        Math.max(0, socMax - socM) ||
        +((ah / 170) * 100).toFixed(1);
      const wh = w.summaryBlocks?.wattHourPerKm?.avg || 0;
      const spd = w.summaryBlocks?.speedometer?.max || 0;
      const spdAvg = w.summaryBlocks?.speedometer?.avg || 0;
      const cur = w.summaryBlocks?.current?.avg || 0;
      const ctMax = w.summaryBlocks?.controllerTemp?.max || 0;
      const ctAvg = w.summaryBlocks?.controllerTemp?.avg || 0;
      const mtMax = w.summaryBlocks?.motorTemp?.max || 0;
      const mtAvg = w.summaryBlocks?.motorTemp?.avg || 0;
      const mosMax = w.reportTable?.maxMosTemperature || 0;
      const volM = w.reportTable?.finalVoltage ?? 0;
      const cellMin = w.reportTable?.lowCellVoltage ?? 0;
      const cellMax = w.reportTable?.highCellVoltage ?? 0;
      const cyc = parseInt(w.reportTable?.cycles) || 0;

      if (cyc > 0) {
        if (cyc < minC) minC = cyc;
        if (cyc > maxC) maxC = cyc;
      }

      tDist += dist;
      tAh += ah;
      overallSpdMax = Math.max(overallSpdMax, spd);
      tOdo = Math.max(tOdo, totalDist);

      dates.push(day.date);
      distSeries.push(+dist.toFixed(2));
      ahSeries.push(+ah.toFixed(2));
      whSeries.push(+wh.toFixed(2));
      whPerKmSeries.push(+wh.toFixed(2));
      spdMaxSeries.push(spd);
      spdAvgSeries.push(spdAvg);
      ctrlMaxSeries.push(ctMax);
      ctrlAvgSeries.push(ctAvg);
      mtrMaxSeries.push(mtMax);
      mtrAvgSeries.push(mtAvg);
      mosMaxSeries.push(mosMax);
      socMinSeries.push(socM);
      volMinSeries.push(volM);
      cellMinSeries.push(cellMin);
      cellMaxSeries.push(cellMax);
      socSeries.push(socConsumed);
      cyclesSeries.push(cyc);

      // Charging
      const cInit = w.chargingSession?.initSoc ?? 0;
      const cFinal = w.chargingSession?.finalSoc ?? 0;
      const cSoc = cFinal - cInit;
      const cCur = Math.abs(w.chargingSession?.avgCurrent || 0);
      const cDur = w.chargingSession?.timeMinutes || 0;

      chargeSocSeries.push(+cSoc.toFixed(1));
      chargeSocRangeSeries.push({ x: day.date, y: [cInit, cFinal] });
      chargeCurrentSeries.push(+cCur.toFixed(1));
      chargeDurationSeries.push(cDur);
      const NOM_CAP_AH = 170; // estimated nominal capacity from payload
      const chargeAhDay = Math.abs(w.chargingSession?.ahConsumed || 0);
      const chargeCurAbs = Math.abs(w.chargingSession?.avgCurrent || 0);
      const cRate =
        chargeCurAbs > 0 ? +(chargeCurAbs / NOM_CAP_AH).toFixed(4) : 0;
      const chargeKwhDay = +(chargeAhDay * 0.072).toFixed(2);
      const cDeltaMv = +((cellMax - cellMin) * 1000).toFixed(1);

      chargeKwhSeries.push(chargeKwhDay);
      cRateSeries.push(cRate);
      cellDeltaSeries.push(cDeltaMv > 0 ? cDeltaMv : 0);
      packInitVSeries.push(
        w.reportTable?.initVoltage > 0
          ? +w.reportTable.initVoltage.toFixed(2)
          : null,
      );
      packFinalVSeries.push(
        w.reportTable?.finalVoltage > 0
          ? +w.reportTable.finalVoltage.toFixed(2)
          : null,
      );

      // Thermal
      const cs = w.chargingSession || {};
      t1Series.push(cs.temp1 ?? 0);
      t2Series.push(cs.temp2 ?? 0);
      t3Series.push(cs.temp3 ?? 0);
      t4Series.push(cs.temp4 ?? 0);
      chargeMosSeries.push(cs.mosTemp ?? 0);

      const bmsF = (cs.faults || []).length;
      bmsFaultSeries.push(bmsF);

      // ── Sessions Processing (Expanded View Data) ──
      const rawSessions = day.sessions || [];
      const driveSessionsInDay = rawSessions.filter(
        (s) => s.sessionType !== "Charge Session",
      );
      const chargeSessionsInDay = rawSessions.filter(
        (s) => s.sessionType === "Charge Session",
      );
      
      totalChargeSessions += chargeSessionsInDay.length;

      const processedSessionsPerDay = rawSessions.map((s, si) => {
        if (s.sessionType === "Charge Session") {
          const cs = s.chargingSession || {};
          return {
            type: "Charge",
            id: `${day.date}_${si}`,
            start: s.startTime || cs.timeMin || "?",
            end: s.endTime || cs.timeMax || "?",
            duration: Math.round(cs.timeMinutes || 0),
            grade: "—",
            dist: "—",
            energy: cs.ahConsumed || 0,
            kwh: +((cs.ahConsumed || 0) * 0.072).toFixed(3),
            faults: getFaultArray(cs.faults),
          };
        }

        const sb = s.summaryBlocks || {};
        const ds = s.driveSession || {};
        const rt = s.reportTable || {};
        const rangeDetails = ds.sessionRangeDetails || [];
        const firstSegment = rangeDetails[0] || {};
        const lastSegment =
          rangeDetails[rangeDetails.length - 1] || firstSegment;

        const dur = rangeDetails.reduce((acc, r) => acc + (r.minutes || 0), 0);
        const sF = getFaultArray(rt.batteryFault).concat(
          getFaultArray(rt.controllerFault),
        );

        const sGrade = getGrade({
          whr: sb.wattHourPerKm?.avg || 0,
          mtrAvg: sb.motorTemp?.avg || 0,
          mtrMax: sb.motorTemp?.max || 0,
          ctrlAvg: sb.controllerTemp?.avg || 0,
          ctrlMax: sb.controllerTemp?.max || 0,
          mosMax: rt.maxMosTemperature || 0,
          faults: sF,
          eco: ds.modePercentages?.["2"] || 0,
          socMin: sb.batterySoc?.min ?? 100,
        });

        const sEnergy = rt.AHConsumed ?? sb.ahConsumed?.trip ?? 0;

        return {
          type: "Drive",
          id: `${day.date}_${si}`,
          start: s.startTime || firstSegment.start || "?",
          end: s.endTime || lastSegment.end || "?",
          duration: Math.round(dur),
          grade: sGrade.grade,
          dist: sb.distanceTravelled?.trip || 0,
          energy: sEnergy,
          kwh: +(sEnergy * 0.072).toFixed(3),
          faults: sF,
        };
      });

      const chargeSessionsCount = chargeSessionsInDay.length;
      totalDriveSessions += driveSessionsInDay.length;

      // ── Modes & Gears ──
      Object.keys(w.driveSession?.modePercentages || {}).forEach((k) => {
        mergedMode[k] =
          (mergedMode[k] || 0) + w.driveSession.modePercentages[k];
      });
      Object.keys(w.driveSession?.gearPercentages || {}).forEach((k) => {
        mergedGear[k] =
          (mergedGear[k] || 0) + w.driveSession.gearPercentages[k];
      });

      const totalDayDur = (w.driveSession?.sessionRangeDetails || []).reduce(
        (acc, r) => acc + (r.minutes || 0),
        0,
      );
      const totalHrs = Math.floor(totalDayDur / 60);
      const totalMins = Math.round(totalDayDur % 60);

      // ── Series Aggregation ──
      const mP = w.driveSession?.modePercentages || {};
      parkSeries.push(+((mP["1"] || 0) * (totalDayDur / 100)).toFixed(1));
      ecoSeries.push(+((mP["2"] || 0) * (totalDayDur / 100)).toFixed(1));
      driveSeries.push(+((mP["3"] || 0) * (totalDayDur / 100)).toFixed(1));
      revSeries.push(+((mP["4"] || 0) * (totalDayDur / 100)).toFixed(1));

      const gP = w.driveSession?.gearPercentages || {};
      gear1Series.push(+((gP["1"] || 0) * (totalDayDur / 100)).toFixed(1));
      gear2Series.push(+((gP["2"] || 0) * (totalDayDur / 100)).toFixed(1));

      const dayKwh = +(ah * 0.072).toFixed(3);
      kwhSeries.push(dayKwh);

      // SoC bands
      (w.barChart?.avgSpeedAtSoc || []).forEach((v, i) => {
        if (v > 0) {
          socSpd[i] += v;
          socSpdCount[i]++;
        }
      });
      (w.barChart?.avgCurrentAtSoc || []).forEach((v, i) => {
        socA[i] += v;
      });
      (w.barChart?.tripAtSoc || []).forEach((v, i) => {
        socTrip[i] += v;
      });
      (w.barChart?.avgControllerTempAtSoc || []).forEach((v, i) => {
        socCtrl[i] += v;
      });
      (w.barChart?.avgMotorTempAtSoc || []).forEach((v, i) => {
        socMtr[i] += v;
      });

      // Polar
      if (w.polarChart && typeof w.polarChart === "object") {
        Object.keys(w.polarChart).forEach((k) => {
          mergedPolar[k] = (mergedPolar[k] || 0) + w.polarChart[k];
        });
      }

      // ── Grading & Faults ──
      const bF = getFaultArray(w.reportTable?.batteryFault);
      const cF = getFaultArray(w.reportTable?.controllerFault);
      const dayFaults = [...bF, ...cF];
      overallFaults.push(...dayFaults);

      const ecoPct = w.driveSession?.modePercentages?.["2"] || 0;
      const { grade: dayGrade, score: dayScore } = getGrade({
        whr: wh,
        mtrAvg: mtAvg,
        mtrMax: mtMax,
        ctrlAvg: ctAvg,
        ctrlMax: ctMax,
        mosMax,
        faults: dayFaults,
        eco: ecoPct,
        socMin: socM,
      });

      const gradeMap = { A: 5, "B+": 4, B: 3, C: 2, D: 1, F: 0 };
      const colorMap = {
        A: "#2ECC71",
        "B+": "#27AE60",
        B: "#F1C40F",
        C: "#E67E22",
        D: "#D35400",
        F: "#E74C3C",
      };
      gradeNumericSeries.push(gradeMap[dayGrade] ?? 0);
      gradePctSeries.push(dayScore);
      gradeColorSeries.push(colorMap[dayGrade] ?? "#95A5A6");

      // ── Overall Performance Stats ──
      if (wh > 0) {
        overallWhSum += wh;
        overallWhCount++;
      }
      if (spdAvg > 0) {
        overallSpdSum += spdAvg;
        overallSpdCount++;
      }
      if (cur > 0) {
        overallAvgCurrent += cur;
        totalAvgCurrentCount++;
      }
      if (mtMax > 0) {
        overallMtrSum += mtMax;
        overallMtrCount++;
      }
      if (ctMax > 0) {
        overallCtrlSum += ctMax;
        overallCtrlCount++;
      }
      if (mosMax > 0) {
        overallMosSum += mosMax;
        overallMosCount++;
      }
      if (ecoPct > 0) {
        overallEcoSum += ecoPct;
        overallEcoCount++;
      }

      const durLabel =
        totalHrs > 0 ? `${totalHrs}h ${totalMins}m` : `${totalMins}m`;

      const chargeSessionMins = chargeSessionsInDay.reduce((acc, s) => acc + (s.chargingSession?.timeMinutes || 0), 0);
      const chargeHrs = Math.floor(chargeSessionMins / 60);
      const chargeMins = Math.round(chargeSessionMins % 60);
      const chargeDurLabel = chargeHrs > 0 ? `${chargeHrs}h ${chargeMins}m` : `${chargeMins}m`;

      tableRows.push({
        date: day.date,
        totalDistance: +dist.toFixed(1),
        duration: durLabel,
        chargeDuration: chargeDurLabel,
        batteryFault: bF.length > 0 ? bF.join("; ") : "None",
        controllerFault: cF.length > 0 ? cF.join("; ") : "None",
        cycles: w.reportTable?.cycles ?? "—",
        driveSessions: driveSessionsInDay.length,
        chargeSessions: chargeSessionsCount,
        grade: dayGrade,
        score: dayScore,
        sessions: processedSessionsPerDay,
        faults: dayFaults,
      });
    });

    const n = data.length;
    const overallMtrMax = Math.max(0, ...mtrMaxSeries.filter((v) => v > 0));
    const overallCtrlMax = Math.max(0, ...ctrlMaxSeries.filter((v) => v > 0));
    const overallMosMax = Math.max(0, ...mosMaxSeries.filter((v) => v > 0));

    const aggregateGrade = getGrade({
      whr: overallWhCount > 0 ? overallWhSum / overallWhCount : 0,
      mtrAvg: overallMtrCount > 0 ? overallMtrSum / overallMtrCount : 0,
      mtrMax: overallMtrMax,
      ctrlAvg: overallCtrlCount > 0 ? overallCtrlSum / overallCtrlCount : 0,
      ctrlMax: overallCtrlMax,
      mosMax: overallMosMax,
      faults: overallFaults,
      eco: overallEcoCount > 0 ? overallEcoSum / overallEcoCount : 0,
      socMin: Math.min(...socMinSeries.filter((v) => v > 0), 100),
    });

    const modePieLabels = Object.keys(mergedMode).map(
      (k) => MODE_LABELS[k] || `Mode ${k}`,
    );
    const modePieSeries = Object.values(mergedMode).map((v) => Math.floor(v));

    const totalChargeFaults = bmsFaultSeries.reduce((a, b) => a + b, 0);
    const totalChargeKwh = +chargeKwhSeries
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
    const avgChargeDuration = chargeDurationSeries.length
      ? Math.round(
          chargeDurationSeries.reduce((a, b) => a + b, 0) /
            chargeDurationSeries.length,
        )
      : 0;
    const avgCellDeltaMv = cellDeltaSeries.length
      ? +(
          cellDeltaSeries.reduce((a, b) => a + b, 0) / cellDeltaSeries.length
        ).toFixed(1)
      : 0;
    const avgCRate = cRateSeries.length
      ? cRateSeries.reduce((a, b) => a + b, 0) / cRateSeries.length
      : 0;
    const maxChargeTemp = Math.max(
      0,
      ...[
        ...chargeMosSeries,
        ...t1Series,
        ...t2Series,
        ...t3Series,
        ...t4Series,
      ].filter((v) => v > 0),
    );

    let chargingHealthScore = 100;
    if (totalChargeFaults > 0)
      chargingHealthScore -= Math.min(40, totalChargeFaults * 20);
    if (avgCellDeltaMv > 80) chargingHealthScore -= 25;
    else if (avgCellDeltaMv > 50) chargingHealthScore -= 15;
    else if (avgCellDeltaMv > 30) chargingHealthScore -= 8;
    if (maxChargeTemp > 60) chargingHealthScore -= 20;
    else if (maxChargeTemp > 50) chargingHealthScore -= 10;
    chargingHealthScore = Math.max(
      0,
      Math.min(100, Math.round(chargingHealthScore)),
    );

    setMetrics({
      tDist,
      totalDist: tOdo,
      totalAh: tAh.toFixed(1),
      totalKwh: (tAh * 0.072).toFixed(2),
      avgWhKm:
        overallWhCount > 0 ? (overallWhSum / overallWhCount).toFixed(1) : "0",
      totalCycles:
        minC !== Infinity
          ? `${minC} ➡ ${maxC}`
          : tableRows.length > 0
            ? tableRows[tableRows.length - 1].cycles
            : "—",
      topSpeed: overallSpdMax,
      totalDriveSessions,
      totalChargeSessions,
      days: n,
      grade: aggregateGrade,
      dates,
      distSeries,
      ahSeries,
      kwhSeries,
      whSeries,
      whPerKmSeries,
      spdMaxSeries,
      spdAvgSeries,
      ctrlMaxSeries,
      ctrlAvgSeries,
      mtrMaxSeries,
      mtrAvgSeries,
      mosMaxSeries,
      socMinSeries,
      soc: socSeries,
      volMinSeries,
      cellMinSeries,
      cellMaxSeries,
      chargeSocSeries,
      chargeSocRangeSeries,
      chargeCurrentSeries,
      chargeDurationSeries,
      t1Series,
      t2Series,
      t3Series,
      t4Series,
      chargeMosSeries,
      bmsFaultSeries,
      gradeNumericSeries,
      gradePctSeries,
      gradeColorSeries,
      modeStackData: [
        { name: "Drive", data: driveSeries },
        { name: "ECO", data: ecoSeries },
        { name: "Park", data: parkSeries },
        { name: "Reverse", data: revSeries },
      ],
      gearStackData: [
        { name: "Gear 1", data: gear1Series },
        { name: "Gear 2", data: gear2Series },
      ],
      socSpd: socSpd.map(
        (v, i) => +(socSpdCount[i] > 0 ? v / socSpdCount[i] : 0).toFixed(1),
      ),
      socA: socA.map((v) => +(v / n).toFixed(1)),
      socTrip: socTrip.map((v) => +v.toFixed(1)),
      socCtrl: socCtrl.map((v) => +(v / n).toFixed(1)),
      socMtr: socMtr.map((v) => +(v / n).toFixed(1)),
      modePies: { labels: modePieLabels, series: modePieSeries },
      gearPies: {
        labels: Object.keys(mergedGear).map((k) => `Gear ${k}`),
        series: Object.values(mergedGear).map((v) => Math.floor(v)),
      },
      mergedPolar,
      tableRows,
      chargeKwhSeries,
      cRateSeries,
      cellDeltaSeries,
      packInitVSeries,
      packFinalVSeries,
      cyclesSeries,
      totalChargeKwh,
      avgChargeDuration,
      avgCellDeltaMv,
      avgCRate,
      totalChargeFaults,
      maxChargeTemp,
      chargingHealthScore,
      totalFaultCount: overallFaults.filter(
        (f) => f && f !== "None" && f !== "" && f !== "0",
      ).length,
      peakMotorTemp: overallMtrMax,
      peakCtrlTemp: overallCtrlMax,
      peakMosTemp: overallMosMax,
      avgSpeed:
        overallSpdCount > 0 ? +(overallSpdSum / overallSpdCount).toFixed(1) : 0,
    });
  }, [data]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: p[130],
        "&::before": { content: '""', display: "none" },
        "& .analytics-anim": {
          opacity: 0,
          transform: "translateY(16px)",
          animation:
            "analyticsFadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        },
        "& .analytics-card": {
          transition: "transform 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: colors.palette[210],
          },
        },
        "@keyframes analyticsFadeUp": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "0.9rem", md: "1.4rem 1.6rem 2rem 1.6rem" },
        }}
      >
        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          bgcolor={hdrBg}
          p="1rem 1.4rem"
          borderRadius="1rem"
          mb={3}
          gap={2}
          sx={{
            backdropFilter: "blur(12px)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.3)"
              : "1px solid rgba(0, 0, 0, 0.25)",
            boxShadow: isDark
              ? "0 10px 22px rgba(0,0,0,0.28)"
              : "0 2px 12px rgba(14, 21, 29, 0.1)",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              color={tx}
              sx={{
                fontWeight: 800,
                margin: 0,
                fontSize: { xs: "1.35rem", md: "1.75rem" },
                letterSpacing: "0.02em",
              }}
            >
              Multi-Day Analytics
            </Typography>
            <Typography
              variant="caption"
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Aggregate fleet telemetry over a custom date range.
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
            {/* Vehicle Select */}
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Vehicle</InputLabel>
              <Select
                value={userId}
                label="Vehicle"
                onChange={(e) => {
                  setUserId(e.target.value);
                  const v = vehiclesData.find(
                    (x) => x.vehicleId === e.target.value,
                  );
                  if (v) {
                    setVehicleNo(v.vehicleNo);
                    setVehicleModel(v.name);
                  }
                }}
              >
                {vehiclesData.map((v) => (
                  <MenuItem key={v.vehicleId} value={v.vehicleId}>
                    {v.vehicleNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Quick Filters */}
            <Box display="flex" gap={0.5}>
              {QUICK_FILTERS.map((qf, i) => (
                <Button
                  key={i}
                  size="small"
                  variant={quickFilter === i ? "contained" : "outlined"}
                  onClick={() => {
                    setQuickFilter(i);
                    if (qf.fn) {
                      const [s, e] = qf.fn();
                      setStartDate(s);
                      setEndDate(e);
                    }
                  }}
                  sx={{
                    textTransform: "none",
                    fontSize: 11,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: "0.4rem",
                    ...(quickFilter === i
                      ? {
                          background: `linear-gradient(90deg,${p[500]},${p[550]})`,
                          color: "#fff",
                          border: "none",
                        }
                      : { borderColor: p[400] }),
                  }}
                >
                  {qf.label}
                </Button>
              ))}
            </Box>
            {/* Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker", "DatePicker"]}
                sx={{ p: 0, m: 0, overflow: "visible" }}
              >
                <DatePicker
                  label="Start"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: "small" } }}
                  sx={{ width: 140 }}
                />
                <DatePicker
                  label="End"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { size: "small" } }}
                  sx={{ width: 140 }}
                />
              </DemoContainer>
            </LocalizationProvider>
            {/* Compute Button */}
            <Button
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              sx={{
                height: "2.3rem",
                borderRadius: "0.4rem",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(90deg,${p[500]} 0%,${p[550]} 100%)`,
                "&:hover": {
                  background: `linear-gradient(90deg,${p[550]} 0%,${p[500]} 100%)`,
                },
              }}
            >
              {loading ? "Loading…" : "Compute"}
            </Button>
          </Box>
        </Box>

        {/* ── LOADING SKELETONS ──────────────────────────────────────────────── */}
        {loading && (
          <Grid container spacing={2} mb={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                <Box sx={cardSx}>
                  <SkeletonCard />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── MAIN DASHBOARD ─────────────────────────────────────────────────── */}
        {vehicleNo && !loading && metrics && (
          <>
            {/* ── KPI CARDS ─────────────────────────────────────────────────── */}
            <Grid container spacing={2} mb={3}>
              {[
                {
                  title: `${startDate.format("DD MMM YYYY")} - ${endDate.format("DD MMM YYYY")}`,
                  primary: vehicleModel,
                  secondary: vehicleNo,
                  icon: <LocalShippingIcon style={style} />,
                  color: p[500],
                },
                {
                  title: "Odometer Reading",
                  primary: `${metrics.totalDist}`,
                  secondary: "kilometer (km)",
                  icon: <SpeedIcon style={style} />,
                  color: p[500],
                },
                {
                  title: "Trip Distance",
                  primary: `${metrics.tDist}`,
                  secondary: "kilometer (km)",
                  icon: <SwapCalls style={style} />,
                  color: p[500],
                },
                {
                  title: "Average Efficiency",
                  primary: `${metrics.avgWhKm}`,
                  secondary: "WH/km",
                  icon: <ElectricRickshawIcon style={style} />,
                  color: p[500],
                },
                {
                  title: "Total Energy Consumption",
                  primary: `${metrics.totalKwh}`,
                  secondary: "kWH",
                  icon: <EnergySavingsLeaf style={style} />,
                  color: p[500],
                },
                {
                  title: "Battery Cycles",
                  primary: `${metrics.totalCycles}`,
                  secondary: "Cycles",
                  icon: <BrightnessAutoIcon style={style} />,
                  color: p[500],
                },
              ].map((kpi, i) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                  <Box sx={{ ...cardSx, p: "0.25rem" }}>
                    <RepoData
                      title={kpi.title}
                      primary={kpi.primary}
                      secondary={kpi.secondary}
                      icon={kpi.icon}
                      iconColor={kpi.color}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* ── TABS ──────────────────────────────────────────────────────── */}
            <Box
              sx={{
                bgcolor: cardBg,
                borderRadius: "1rem",
                boxShadow: `0 4px 20px ${p[200]}`,
                mb: 3,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 2,
                  pt: 1,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 400,
                    fontSize: 15,
                    minWidth: 130,
                  },
                }}
              >
                <Tab label="Temperature" />
                <Tab label="Performance" />
                <Tab label="Charging" />
                <Tab label="Battery Health" />
                <Tab label="Session Table" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <TemperatureTab
                  metrics={metrics}
                  themeOptions={themeOptions}
                  isDark={isDark}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <PerformanceTab
                  metrics={metrics}
                  themeOptions={themeOptions}
                  isDark={isDark}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <ChargingTab
                  metrics={metrics}
                  themeOptions={themeOptions}
                  isDark={isDark}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={3}>
                <HealthTab
                  sohData={sohData}
                  themeOptions={themeOptions}
                  isDark={isDark}
                />
              </TabPanel>
              <TabPanel value={activeTab} index={4}>
                <SessionTableTab
                  metrics={metrics}
                  themeOptions={themeOptions}
                  isDark={isDark}
                />
              </TabPanel>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
