import React, { useEffect, useState, useMemo } from "react";
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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";

import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EvStationIcon from "@mui/icons-material/EvStation";
import DownloadIcon from "@mui/icons-material/Download";

import { tokens } from "../../theme";
import RepoData from "../../components/ReportData";
import Polarchart from "../../components/PolarChart";
import { EnergySavingsLeaf, Padding, SwapCalls } from "@mui/icons-material";

// ─── SOC Band labels ─────────────────────────────────────────────────────────
const SOC_LABELS = [
  "0-10%",
  "10-20%",
  "20-30%",
  "30-40%",
  "40-50%",
  "50-60%",
  "60-70%",
  "70-80%",
  "80-90%",
  "90-100%",
];

// ─── Drive mode map ───────────────────────────────────────────────────────────
const MODE_LABELS = { 1: "Park", 2: "ECO", 3: "Drive", 4: "Reverse" };
const MODE_COLORS_IDX = [1400, 500, 1300, 1100];

// ─── Quick filter presets ─────────────────────────────────────────────────────
const QUICK_FILTERS = [
  { label: "Today", fn: () => [dayjs(), dayjs()] },
  { label: "Last 7d", fn: () => [dayjs().subtract(7, "day"), dayjs()] },
  { label: "Last 30d", fn: () => [dayjs().subtract(30, "day"), dayjs()] },
  { label: "Custom", fn: null },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Box p={2} borderRadius="1rem" overflow="hidden">
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{ mb: 1, borderRadius: 1 }}
      />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, tx }) {
  return (
    <Box p={"0.5rem 0 0 0.5rem"}>
      <Typography
        variant="subtitle2"
        fontSize={"1rem"}
        fontWeight={500}
        color={tx}
      >
        {title}
      </Typography>
      {sub && (
        <Typography
          variant="caption"
          fontSize={"0.7rem"}
          color="text.secondary"
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ─── Tab panel ────────────────────────────────────────────────────────────────
function TabPanel({ children, value, index }) {
  return value === index ? <Box pt={1}>{children}</Box> : null;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportCSV(rows) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows
    .map((r) =>
      Object.values(r)
        .map((v) => `"${v}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics_export_${dayjs().format("YYYY-MM-DD")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Performance Grading Utility ─────────────────────────────────────────────
const getGrade = (stats) => {
  const { whr, spd, cur, mtr, ctrl, mos, faults = [], eco = 0 } = stats;

  // 1. System Health - Instant Failure for active faults
  const hasFaults =
    faults.length > 0 &&
    faults.some((f) => f !== "None" && f !== "—" && f !== "" && f !== "0");
  if (hasFaults) return { grade: "F", score: 0 };

  let score = 0;

  // 2. Efficiency: Wh/km (Max 40 pts)
  if (whr < 80) score += 40;
  else if (whr < 90) score += 25;
  else if (whr < 110) score += 10;

  // 3. Thermal Health: Max(Mtr, Ctrl, Mos) (Max 30 pts)
  const maxTemp = Math.max(mtr, ctrl, mos);
  if (maxTemp < 55) score += 30;
  else if (maxTemp < 65) score += 20;
  else if (maxTemp < 75) score += 10;

  // 4. Drive Behavior: Current & Speed (Max 20 pts)
  // Optimal: Speed 15-28 km/h, Current < 22A
  if (spd >= 15 && spd <= 28) score += 10;
  else if (spd > 0) score += 5;

  if (cur < 22) score += 10;
  else if (cur < 35) score += 5;

  // 5. Drive Mode Usage: ECO preference (Max 10 pts)
  if (eco > 75) score += 10;
  else if (eco > 50) score += 5;

  // Grade Mapping
  let grade = "D";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B+";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C";

  return { grade, score };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CustomDateAnalytics = () => {
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
  const [useKwh, setUseKwh] = useState(false); // toggle Ah vs kWh
  const [tableSort, setTableSort] = useState({ col: "date", dir: "desc" });
  const [metrics, setMetrics] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // For table expansion

  // ── Design tokens ──────────────────────────────────────────────────────────
  const fg = p[150];
  const tx = p[100];
  const tip = isDark ? "dark" : "light";
  const cardBg = isDark ? p[130] : "#ffffff";
  const bgGrad = isDark
    ? "linear-gradient(132deg,#0d1117 0%,#101a26 56%,#0f2028 100%)"
    : "linear-gradient(132deg,#edf4f7 0%,#f8fafc 55%,#eef6ef 100%)";
  const hdrBg = isDark ? "rgba(66,69,71,0.78)" : "rgba(255,255,255,0.82)";

  const style = {
    color: colors.palette[110],
    margin: "0.2rem",
    fontSize: "2rem",
    padding: "0.1rem",
  };

  const cardSx = {
    border: "none",
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)",
    boxShadow: isDark
      ? "0 14px 30px rgba(0,0,0,0.24)"
      : "0 12px 28px rgba(15, 23, 42, 0.1)",
    borderRadius: "0.9rem",
    backdropFilter: "blur(8px)",
  };
  const base = {
    toolbar: { show: false },
    foreColor: fg,
    background: "transparent",
    fontFamily: theme.typography.fontFamily,
  };
  const baseTooltip = { theme: tip };

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
    const socMinSeries = [];
    const volMinSeries = [];
    const cellMinSeries = [];
    const cellMaxSeries = [];
    const chargeSocSeries = [];
    const chargeSocRangeSeries = [];
    const chargeCurrentSeries = [];
    const chargeDurationSeries = [];
    const chargeMosSeries = [];
    const t1Series = [],
      t2Series = [],
      t3Series = [],
      t4Series = [];
    const bmsFaultSeries = [];
    const tableRows = [];
    const gradeNumericSeries = [],
      gradePctSeries = [],
      gradeColorSeries = [];
    const parkSeries = [],
      ecoSeries = [],
      driveSeries = [],
      revSeries = [],
      gear1Series = [],
      gear2Series = [];
    const chargeKwhSeries = []; // kWh charged per day
    const cRateSeries = []; // C-rate (fraction of capacity per hour)
    const cellDeltaSeries = []; // cell imbalance in mV
    const packInitVSeries = []; // pack init voltage
    const packFinalVSeries = []; // pack final voltage

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
      const ah = w.summaryBlocks?.ahConsumed?.trip || 0;
      const wh = w.summaryBlocks?.wattHourPerKm?.avg || 0;
      const spd = w.summaryBlocks?.speedometer?.max || 0;
      const spdAvg = w.summaryBlocks?.speedometer?.avg || 0;
      const cur = w.summaryBlocks?.current?.avg || 0;
      const ctMax = w.summaryBlocks?.controllerTemp?.max || 0;
      const ctAvg = w.summaryBlocks?.controllerTemp?.avg || 0;
      const mtMax = w.summaryBlocks?.motorTemp?.max || 0;
      const mtAvg = w.summaryBlocks?.motorTemp?.avg || 0;
      const mosMax = w.reportTable?.maxMosTemperature || 0;
      const socM = w.summaryBlocks?.batterySoc?.min ?? 0;
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

      // Thermal (T1-T4 from chargingSession if available, otherwise 0)
      const cs = w.chargingSession || {};
      t1Series.push(cs.temp1 ?? 0);
      t2Series.push(cs.temp2 ?? 0);
      t3Series.push(cs.temp3 ?? 0);
      t4Series.push(cs.temp4 ?? 0);
      chargeMosSeries.push(cs.mosTemp ?? 0);

      const bmsF = (cs.faults || []).length;
      bmsFaultSeries.push(bmsF);

      if (cDur > 0) totalChargeSessions++;

      // ── Sessions Processing (Expanded View Data) ──
      const rawSessions = day.sessions || [];
      const processedSessionsPerDay = rawSessions.map((s, si) => {
        const sb = s.summaryBlocks || {};
        const ds = s.driveSession || {};
        const rt = s.reportTable || {};
        const rd = ds.sessionRangeDetails?.[0] || {};
        const dur = (ds.sessionRangeDetails || []).reduce(
          (acc, r) => acc + (r.minutes || 0),
          0,
        );

        const sGrade = getGrade({
          whr: sb.wattHourPerKm?.avg || 0,
          spd: sb.speedometer?.avg || 0,
          cur: sb.current?.avg || 0,
          mtr: sb.motorTemp?.max || 0,
          ctrl: sb.controllerTemp?.max || 0,
          mos: rt.maxMosTemperature || 0,
          faults: (rt.batteryFault || []).concat(rt.controllerFault || []),
          eco: ds.modePercentages?.["2"] || 0,
        });

        return {
          id: `${day.date}_${si}`,
          start: rd.start || s.startTime || "?",
          end: rd.end || s.endTime || "?",
          duration: Math.round(dur),
          grade: sGrade.grade,
          dist: sb.distanceTravelled?.trip || 0,
          energy: rt.AHConsumed || sb.ahConsumed?.trip || 0,
          kwh: +((rt.AHConsumed || sb.ahConsumed?.trip || 0) * 0.072).toFixed(
            3,
          ),
          faults: (rt.batteryFault || []).concat(rt.controllerFault || []),
        };
      });

      totalDriveSessions += processedSessionsPerDay.length;

      // ── Modes & Gears ──
      Object.keys(w.driveSession?.modePercentages || {}).forEach((k) => {
        mergedMode[k] =
          (mergedMode[k] || 0) + w.driveSession.modePercentages[k];
      });
      Object.keys(w.driveSession?.gearPercentages || {}).forEach((k) => {
        mergedGear[k] =
          (mergedGear[k] || 0) + w.driveSession.gearPercentages[k];
      });

      // ── Series Aggregation ──
      const mP = w.driveSession?.modePercentages || {};
      parkSeries.push(+(mP["1"] || 0).toFixed(1));
      ecoSeries.push(+(mP["2"] || 0).toFixed(1));
      driveSeries.push(+(mP["3"] || 0).toFixed(1));
      revSeries.push(+(mP["4"] || 0).toFixed(1));

      const gP = w.driveSession?.gearPercentages || {};
      gear1Series.push(+(gP["1"] || 0).toFixed(1));
      gear2Series.push(+(gP["2"] || 0).toFixed(1));

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
      const bF = w.reportTable?.batteryFault || [];
      const cF = w.reportTable?.controllerFault || [];
      const dayFaults = [...bF, ...cF];
      overallFaults.push(...dayFaults);

      const ecoPct = w.driveSession?.modePercentages?.["2"] || 0;
      const { grade: dayGrade, score: dayScore } = getGrade({
        whr: wh,
        spd: spdAvg,
        cur: cur,
        mtr: mtAvg,
        ctrl: ctAvg,
        mos: mosMax,
        faults: dayFaults,
        eco: ecoPct,
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

      // ── Table Row Metadata ──
      const totalDayDur = (w.driveSession?.sessionRangeDetails || []).reduce(
        (acc, r) => acc + (r.minutes || 0),
        0,
      );
      const totalHrs = Math.floor(totalDayDur / 60);
      const totalMins = Math.round(totalDayDur % 60);
      const durLabel =
        totalHrs > 0 ? `${totalHrs}h ${totalMins}m` : `${totalMins}m`;

      tableRows.push({
        date: day.date,
        totalDistance: +dist.toFixed(1),
        duration: durLabel,
        batteryFault: bF.join("; ") || "None",
        controllerFault: cF.join("; ") || "None",
        cycles: w.reportTable?.cycles ?? "—",
        driveSessions: processedSessionsPerDay.length,
        grade: dayGrade,
        score: dayScore,
        sessions: processedSessionsPerDay,
        faults: dayFaults,
      });
    });

    const n = data.length;

    const aggregateGrade = getGrade({
      whr: overallWhCount > 0 ? overallWhSum / overallWhCount : 0,
      spd: overallSpdCount > 0 ? overallSpdSum / overallSpdCount : 0,
      cur:
        totalAvgCurrentCount > 0 ? overallAvgCurrent / totalAvgCurrentCount : 0,
      mtr: overallMtrCount > 0 ? overallMtrSum / overallMtrCount : 0,
      ctrl: overallCtrlCount > 0 ? overallCtrlSum / overallCtrlCount : 0,
      mos: overallMosCount > 0 ? overallMosSum / overallMosCount : 0,
      faults: overallFaults,
      eco: overallEcoCount > 0 ? overallEcoSum / overallEcoCount : 0,
    });

    const modePieLabels = Object.keys(mergedMode).map(
      (k) => MODE_LABELS[k] || `Mode ${k}`,
    );
    const modePieSeries = Object.values(mergedMode).map((v) => Math.floor(v));

    // ── Paste this block immediately before setMetrics({ ──────────────────────

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
      // KPIs
      tDist: tDist,
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
      // Time-series
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
      // SoC bands
      socSpd: socSpd.map(
        (v, i) => +(socSpdCount[i] > 0 ? v / socSpdCount[i] : 0).toFixed(1),
      ),
      socA: socA.map((v) => +(v / n).toFixed(1)),
      socTrip: socTrip.map((v) => +v.toFixed(1)),
      socCtrl: socCtrl.map((v) => +(v / n).toFixed(1)),
      socMtr: socMtr.map((v) => +(v / n).toFixed(1)),
      // Pies / Polar
      modePies: { labels: modePieLabels, series: modePieSeries },
      gearPies: {
        labels: Object.keys(mergedGear).map((k) => `Gear ${k}`),
        series: Object.values(mergedGear).map((v) => Math.floor(v)),
      },
      mergedPolar,
      // Table
      tableRows,
      chargeKwhSeries,
      cRateSeries,
      cellDeltaSeries,
      packInitVSeries,
      packFinalVSeries,
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
      peakMotorTemp: Math.max(0, ...mtrMaxSeries.filter((v) => v > 0)),
      peakCtrlTemp: Math.max(0, ...ctrlMaxSeries.filter((v) => v > 0)),
      peakMosTemp: Math.max(0, ...mosMaxSeries.filter((v) => v > 0)),
      avgSpeed:
        overallSpdCount > 0 ? +(overallSpdSum / overallSpdCount).toFixed(1) : 0,
    });
  }, [data]);

  // ── Sorted table rows ──────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!metrics?.tableRows) return [];
    return [...metrics.tableRows].sort((a, b) => {
      const va = a[tableSort.col] ?? "";
      const vb = b[tableSort.col] ?? "";
      const cmp = String(va).localeCompare(String(vb), undefined, {
        numeric: true,
      });
      return tableSort.dir === "asc" ? cmp : -cmp;
    });
  }, [metrics, tableSort]);

  const toggleSort = (col) => {
    setTableSort((prev) => ({
      col,
      dir: prev.col === col && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  // ── Chart helpers ──────────────────────────────────────────────────────────
  const xCat = (cats) => ({
    categories: cats,
    labels: { style: { colors: fg, fontSize: "10px" } },
  });
  const xSoc = {
    categories: SOC_LABELS,
    labels: { style: { colors: fg, fontSize: "9px" }, rotate: -35 },
  };
  const yAx = (label) => ({
    title: { text: label, style: { color: fg, fontWeight: "400" } },
    labels: { style: { colors: fg } },
  });

  const gradeColorMap = {
    A: "#2ECC71",
    "B+": "#27AE60",
    B: "#F1C40F",
    C: "#E67E22",
    D: "#D35400",
    F: "#E74C3C",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGrad,
        p: { xs: "0.9rem", md: "1.4rem" },
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        bgcolor={hdrBg}
        sx={{ backdropFilter: "blur(12px)" }}
        p="1rem 1.4rem"
        borderRadius="1rem"
        mb={3}
        gap={2}
        boxShadow={
          isDark
            ? "0 14px 32px rgba(0,0,0,.25)"
            : "0 12px 28px rgba(15,23,42,.1)"
        }
      >
        <Box>
          <Typography
            variant="h5"
            color={tx}
            sx={{
              fontWeight: 800,
              margin: 0,
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              color: colors.palette[100],
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
          {/* vehicle select */}
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

          {/* Quick filters */}
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

          {/* Date pickers – shown for Custom or aways editable */}
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

          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading}
            sx={{
              height: "2.3rem",
              borderRadius: "0.4rem",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
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
                secondary: `kilometer (km)`,
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
              <Tab label="Session Table" />
            </Tabs>

            {/* ── TAB 1: TEMPERATURE TRENDS ────────────────────────────── */}
            <TabPanel value={activeTab} index={0}>
              <Box p={2}>
                {!metrics ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                  >
                    <Typography color={fg}>
                      Please click "Compute" to view Temperature analytics.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {/* ── Row 0: Thermal KPI Mini-Cards ───────────────────────── */}
                    {[
                      {
                        label: "Peak Motor Temp",
                        value: `${metrics.peakMotorTemp}°C`,
                        sub:
                          metrics.peakMotorTemp < 65
                            ? "✓ Within safe limits"
                            : metrics.peakMotorTemp < 75
                              ? "⚠ Elevated — monitor closely"
                              : "✗ Critical — inspect motor",
                        ok: metrics.peakMotorTemp < 65,
                        warn:
                          metrics.peakMotorTemp >= 65 &&
                          metrics.peakMotorTemp < 75,
                        icon: <LocalShippingIcon sx={{ fontSize: "1.4rem" }} />,
                      },
                      {
                        label: "Peak Controller Temp",
                        value: `${metrics.peakCtrlTemp}°C`,
                        sub:
                          metrics.peakCtrlTemp < 65
                            ? "✓ Within safe limits"
                            : metrics.peakCtrlTemp < 75
                              ? "⚠ Elevated — check airflow"
                              : "✗ Critical — inspect controller",
                        ok: metrics.peakCtrlTemp < 65,
                        warn:
                          metrics.peakCtrlTemp >= 65 &&
                          metrics.peakCtrlTemp < 75,
                        icon: (
                          <BrightnessAutoIcon sx={{ fontSize: "1.4rem" }} />
                        ),
                      },
                      {
                        label: "Peak MOSFET Temp",
                        value: `${metrics.peakMosTemp}°C`,
                        sub:
                          metrics.peakMosTemp < 60
                            ? "✓ Normal operating range"
                            : metrics.peakMosTemp < 70
                              ? "⚠ Slightly elevated"
                              : "✗ High — check power stage",
                        ok: metrics.peakMosTemp < 60,
                        warn:
                          metrics.peakMosTemp >= 60 && metrics.peakMosTemp < 70,
                        icon: <EvStationIcon sx={{ fontSize: "1.4rem" }} />,
                      },
                      {
                        label: "Thermal Health",
                        value: (() => {
                          const max = Math.max(
                            metrics.peakMotorTemp,
                            metrics.peakCtrlTemp,
                            metrics.peakMosTemp,
                          );
                          if (max < 55) return "Excellent";
                          if (max < 65) return "Good";
                          if (max < 75) return "Warning";
                          return "Critical";
                        })(),
                        sub: (() => {
                          const max = Math.max(
                            metrics.peakMotorTemp,
                            metrics.peakCtrlTemp,
                            metrics.peakMosTemp,
                          );
                          if (max < 55)
                            return "All systems operating optimally";
                          if (max < 65)
                            return "Marginal headroom — watch trends";
                          if (max < 75) return "Thermal stress detected";
                          return "Immediate inspection required";
                        })(),
                        ok:
                          Math.max(
                            metrics.peakMotorTemp,
                            metrics.peakCtrlTemp,
                            metrics.peakMosTemp,
                          ) < 65,
                        warn: (() => {
                          const m = Math.max(
                            metrics.peakMotorTemp,
                            metrics.peakCtrlTemp,
                            metrics.peakMosTemp,
                          );
                          return m >= 65 && m < 75;
                        })(),
                        icon: <StarIcon sx={{ fontSize: "1.4rem" }} />,
                      },
                    ].map((kpi, i) => {
                      const accentColor = kpi.ok
                        ? "#2ECC71"
                        : kpi.warn
                          ? "#E67E22"
                          : "#E74C3C";
                      return (
                        <Grid item xs={6} sm={3} key={i}>
                          <Box sx={{ ...cardSx, p: 2 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Box sx={{ color: accentColor, display: "flex" }}>
                                {kpi.icon}
                              </Box>
                              <Typography
                                variant="caption"
                                color={fg}
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.72rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                {kpi.label}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 800,
                                color: tx,
                                lineHeight: 1.1,
                                mb: 0.3,
                              }}
                            >
                              {kpi.value}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: accentColor,
                                fontSize: "0.68rem",
                                lineHeight: 1.3,
                              }}
                            >
                              {kpi.sub}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}

                    {/* ── VEHICLE HEALTH BANNER ──────────────────────────────────────── */}
                    <Box sx={{ ...cardSx, p: "0.9rem 1.4rem", mb: 3 }}>
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        gap={2}
                      >
                        {/* Grade Badge */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          pr={2}
                          sx={{
                            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          }}
                        >
                          <StarIcon
                            sx={{
                              color:
                                gradeColorMap[metrics.grade.grade] || p[500],
                              fontSize: "2rem",
                            }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color={fg}
                              sx={{ fontSize: "0.68rem", letterSpacing: 1 }}
                            >
                              OVERALL GRADE
                            </Typography>
                            <Box display="flex" alignItems="baseline" gap={0.8}>
                              <Typography
                                sx={{
                                  fontSize: "2.2rem",
                                  fontWeight: 900,
                                  color: gradeColorMap[metrics.grade.grade],
                                  lineHeight: 1,
                                }}
                              >
                                {metrics.grade.grade}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={fg}
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {metrics.grade.score} / 100
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Stats Strip */}
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          flex={1}
                          gap={0}
                          alignItems="center"
                        >
                          {[
                            {
                              label: "Top Speed",
                              value: `${metrics.topSpeed} km/h`,
                              icon: <SpeedIcon sx={{ fontSize: "1.1rem" }} />,
                              ok: metrics.topSpeed <= 35,
                              tip:
                                metrics.topSpeed > 35
                                  ? "Exceeds recommended limit"
                                  : "Within safe range",
                            },
                            {
                              label: "Avg Speed",
                              value: `${metrics.avgSpeed} km/h`,
                              icon: <SpeedIcon sx={{ fontSize: "1.1rem" }} />,
                              ok: true,
                              tip: "Average driving speed",
                            },
                            {
                              label: "Drive Sessions",
                              value: metrics.totalDriveSessions,
                              icon: (
                                <ElectricRickshawIcon
                                  sx={{ fontSize: "1.1rem" }}
                                />
                              ),
                              ok: true,
                              tip: "Total drive sessions in range",
                            },
                            {
                              label: "Charge Sessions",
                              value: metrics.totalChargeSessions,
                              icon: (
                                <EvStationIcon sx={{ fontSize: "1.1rem" }} />
                              ),
                              ok: true,
                              tip: "Total charging sessions in range",
                            },
                            {
                              label: "Active Faults",
                              value: metrics.totalFaultCount,
                              icon: (
                                <WarningAmberIcon sx={{ fontSize: "1.1rem" }} />
                              ),
                              ok: metrics.totalFaultCount === 0,
                              tip:
                                metrics.totalFaultCount === 0
                                  ? "No faults detected"
                                  : "Faults require attention",
                            },
                            {
                              label: "Avg Efficiency",
                              value: `${metrics.avgWhKm} Wh/km`,
                              icon: (
                                <EnergySavingsLeaf
                                  sx={{ fontSize: "1.1rem" }}
                                />
                              ),
                              ok: parseFloat(metrics.avgWhKm) < 90,
                              tip:
                                parseFloat(metrics.avgWhKm) < 90
                                  ? "Efficient operation"
                                  : "Above optimal range",
                            },
                            {
                              label: "Total Energy",
                              value: `${metrics.totalKwh} kWh`,
                              icon: (
                                <BrightnessAutoIcon
                                  sx={{ fontSize: "1.1rem" }}
                                />
                              ),
                              ok: true,
                              tip: "Total energy consumed in period",
                            },
                            {
                              label: "Battery Cycles",
                              value: metrics.totalCycles,
                              icon: <SwapCalls sx={{ fontSize: "1.1rem" }} />,
                              ok: true,
                              tip: "Cycle count progression",
                            },
                          ].map((item, i) => (
                            <Tooltip key={i} title={item.tip} arrow>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                px={1.8}
                                py={0.6}
                                sx={{
                                  borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                                  cursor: "default",
                                  "&:hover": {
                                    bgcolor: isDark
                                      ? "rgba(255,255,255,0.04)"
                                      : "rgba(0,0,0,0.03)",
                                    borderRadius: 1,
                                  },
                                  transition: "background 0.2s",
                                }}
                              >
                                <Box
                                  sx={{
                                    color: item.ok ? "#2ECC71" : "#E74C3C",
                                    display: "flex",
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color={fg}
                                    sx={{
                                      fontSize: "0.63rem",
                                      letterSpacing: 0.5,
                                      display: "block",
                                    }}
                                  >
                                    {item.label.toUpperCase()}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.88rem",
                                      color: item.ok ? tx : "#E74C3C",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {item.value}
                                  </Typography>
                                </Box>
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* ── Row 1: Temp Trends Line + Bar (annotated) ───────────── */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="Temperature Trends"
                          sub="Motor · Controller · MOSFET peak over time"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="line"
                          height={300}
                          series={[
                            {
                              name: "Motor Temp Max",
                              data: metrics.mtrMaxSeries,
                            },
                            {
                              name: "Controller Temp Max",
                              data: metrics.ctrlMaxSeries,
                            },
                            {
                              name: "MOSFET Temp Max",
                              data: metrics.mosMaxSeries,
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "line" },
                            colors: [p[1100], p[1200], p[1500]],
                            stroke: { width: [3, 3, 2], curve: "smooth" },
                            xaxis: xCat(metrics.dates),
                            yaxis: { ...yAx("Temperature (°C)"), max: 90 },
                            annotations: {
                              yaxis: [
                                {
                                  y: 75,
                                  borderColor: "#E74C3C",
                                  strokeDashArray: 4,
                                  label: {
                                    text: "Critical (75°C)",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                                {
                                  y: 65,
                                  borderColor: "#E67E22",
                                  strokeDashArray: 3,
                                  label: {
                                    text: "Warning (65°C)",
                                    style: {
                                      color: "#fff",
                                      background: "#E67E22",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                              ],
                            },
                            dataLabels: { enabled: false },
                            legend: { labels: { colors: fg } },
                            markers: { size: 3 },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                              y: { formatter: (v) => `${v}°C` },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="Motor & Controller Temperature"
                          sub="Daily avg vs MOSFET peak — grouped bar"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={300}
                          series={[
                            {
                              name: "Avg Controller °C",
                              data: metrics.ctrlAvgSeries,
                            },
                            {
                              name: "Avg Motor °C",
                              data: metrics.mtrAvgSeries,
                            },
                            {
                              name: "MOSFET Max °C",
                              data: metrics.mosMaxSeries,
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1300], p[1400], p[1500]],
                            plotOptions: {
                              bar: { borderRadius: 4, columnWidth: "55%" },
                            },
                            xaxis: xCat(metrics.dates),
                            yaxis: { ...yAx("Temperature (°C)"), max: 90 },
                            annotations: {
                              yaxis: [
                                {
                                  y: 65,
                                  borderColor: "#E67E22",
                                  strokeDashArray: 3,
                                  label: {
                                    text: "Warning (65°C)",
                                    style: {
                                      color: "#fff",
                                      background: "#E67E22",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                              ],
                            },
                            dataLabels: { enabled: false },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                              y: { formatter: (v) => `${v}°C` },
                            },
                            legend: { position: "top", labels: { colors: fg } },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* ── Row 2: SoC Band Temperature Correlation ──────────────── */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="SoC vs Motor Temperature"
                          sub="Avg motor temp at each battery charge band"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={260}
                          series={[
                            {
                              name: "Avg Motor Temp (°C)",
                              data: metrics.socMtr,
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1400]],
                            plotOptions: {
                              bar: { borderRadius: 4, columnWidth: "65%" },
                            },
                            xaxis: xSoc,
                            yaxis: { ...yAx("Temperature (°C)"), max: 80 },
                            annotations: {
                              yaxis: [
                                {
                                  y: 65,
                                  borderColor: "#E74C3C",
                                  strokeDashArray: 4,
                                  label: {
                                    text: "Warning",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                              ],
                            },
                            dataLabels: {
                              enabled: true,
                              formatter: (v) => (v > 0 ? `${v}°C` : ""),
                              style: {
                                fontSize: "9px",
                                colors: [isDark ? "#fff" : "#333"],
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: { formatter: (v) => `${v}°C` },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="SoC vs Controller Temperature"
                          sub="Avg controller temp at each battery charge band"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={260}
                          series={[
                            {
                              name: "Avg Controller Temp (°C)",
                              data: metrics.socCtrl,
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1300]],
                            plotOptions: {
                              bar: { borderRadius: 4, columnWidth: "65%" },
                            },
                            xaxis: xSoc,
                            yaxis: { ...yAx("Temperature (°C)"), max: 80 },
                            annotations: {
                              yaxis: [
                                {
                                  y: 65,
                                  borderColor: "#E74C3C",
                                  strokeDashArray: 4,
                                  label: {
                                    text: "Warning",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                              ],
                            },
                            dataLabels: {
                              enabled: true,
                              formatter: (v) => (v > 0 ? `${v}°C` : ""),
                              style: {
                                fontSize: "9px",
                                colors: [isDark ? "#fff" : "#333"],
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: { formatter: (v) => `${v}°C` },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* ── Row 3: Thermal Diagnostic Insight Panel ──────────────── */}
                    <Grid item xs={12}>
                      <Box sx={{ ...cardSx, p: 2 }}>
                        <SectionHeader
                          title="Thermal Diagnostic Summary"
                          sub="Rule-based assessment of drive thermal health"
                          tx={tx}
                        />
                        <Box
                          mt={1.5}
                          display="flex"
                          flexDirection="column"
                          gap={1}
                        >
                          {[
                            {
                              label: "Motor Thermal Headroom",
                              val: `${metrics.peakMotorTemp}°C peak · ${75 - metrics.peakMotorTemp}°C headroom to critical`,
                              status:
                                metrics.peakMotorTemp < 65
                                  ? "good"
                                  : metrics.peakMotorTemp < 75
                                    ? "warn"
                                    : "bad",
                              detail:
                                metrics.peakMotorTemp < 65
                                  ? "Motor temperatures are within the safe operating envelope throughout the selected period."
                                  : metrics.peakMotorTemp < 75
                                    ? "Motor occasionally runs warm — verify load profiles and ensure cooling fins are unobstructed."
                                    : "Motor has exceeded critical threshold. Reduce sustained high-speed runs and inspect thermal compound.",
                            },
                            {
                              label: "Controller Thermal Headroom",
                              val: `${metrics.peakCtrlTemp}°C peak · ${75 - metrics.peakCtrlTemp}°C headroom to critical`,
                              status:
                                metrics.peakCtrlTemp < 65
                                  ? "good"
                                  : metrics.peakCtrlTemp < 75
                                    ? "warn"
                                    : "bad",
                              detail:
                                metrics.peakCtrlTemp < 65
                                  ? "Controller remains cool — regenerative braking and current draw are well balanced."
                                  : metrics.peakCtrlTemp < 75
                                    ? "Controller temperature is elevated. Check ambient temperature and current draw patterns."
                                    : "Controller is overheating. Review drive cycle for high-current bursts and inspect heatsink.",
                            },
                            {
                              label: "MOSFET Thermal Status",
                              val: `${metrics.peakMosTemp}°C peak`,
                              status:
                                metrics.peakMosTemp < 60
                                  ? "good"
                                  : metrics.peakMosTemp < 70
                                    ? "warn"
                                    : "bad",
                              detail:
                                metrics.peakMosTemp < 60
                                  ? "Power stage transistors operating well within limits — no derating risk detected."
                                  : metrics.peakMosTemp < 70
                                    ? "MOSFET running warmer than ideal. Check for loose connections or high switching frequency loads."
                                    : "MOSFET thermal derating may be active — power output may be limited automatically.",
                            },
                            {
                              label: "SoC-Temperature Coupling",
                              val: "Low SoC bands tend to run hotter",
                              status:
                                Math.max(...metrics.socMtr.slice(0, 3)) >
                                Math.max(...metrics.socMtr.slice(7))
                                  ? "warn"
                                  : "good",
                              detail:
                                "High current demand at low SoC levels can cause elevated motor and controller temperatures. Avoid deep discharge under heavy load.",
                            },
                          ].map((item, i) => {
                            const dot =
                              item.status === "good"
                                ? "#2ECC71"
                                : item.status === "warn"
                                  ? "#E67E22"
                                  : "#E74C3C";
                            return (
                              <Box
                                key={i}
                                display="flex"
                                alignItems="flex-start"
                                gap={1.5}
                                p={1.2}
                                borderRadius={1.5}
                                bgcolor={
                                  isDark
                                    ? "rgba(0,0,0,0.15)"
                                    : "rgba(0,0,0,0.03)"
                                }
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: dot,
                                    mt: 0.7,
                                    flexShrink: 0,
                                  }}
                                />
                                <Box flex={1}>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    gap={0.5}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 700,
                                        color: tx,
                                        fontSize: "0.78rem",
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: dot,
                                        fontWeight: 700,
                                        fontSize: "0.73rem",
                                      }}
                                    >
                                      {item.val}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: fg,
                                      fontSize: "0.71rem",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {item.detail}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* ── TAB 2: DAILY PERFORMANCE ──────────────────────────── */}
            <TabPanel value={activeTab} index={1}>
              <Box p={2}>
                <Grid container spacing={2}>
                  {/* ── Row 1: Daily Performance + Energy Consumption ───── */}
                  <Grid item xs={12} md={8}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Daily Performance"
                        sub="Distance · Average Speed · Wh/km"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={320}
                        series={[
                          { name: "Daily Trip (km)", data: metrics.distSeries },
                          { name: "Wh/km", data: metrics.whPerKmSeries },
                          {
                            name: "Avg Speed (km/h)",
                            data: metrics.spdAvgSeries,
                          },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1100], p[1200], p[1500]],
                          plotOptions: {
                            bar: { borderRadius: 3, columnWidth: "65%" },
                          },
                          xaxis: xCat(metrics.dates),
                          yaxis: yAx("Value (km, km/h, Wh)"),
                          dataLabels: { enabled: false },
                          legend: { labels: { colors: fg } },
                          tooltip: {
                            ...baseTooltip,
                            shared: true,
                            intersect: false,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Energy Consumption"
                        sub="Daily kWh consumed"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={320}
                        series={[
                          { name: "kWh Consumed", data: metrics.kwhSeries },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1700]],
                          plotOptions: {
                            bar: { borderRadius: 3, columnWidth: "50%" },
                          },
                          xaxis: xCat(metrics.dates),
                          yaxis: yAx("kWh"),
                          dataLabels: { enabled: true },
                          tooltip: {
                            ...baseTooltip,
                            shared: true,
                            intersect: false,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* ── Row 2: Grading Summary + Mode Distribution ───────── */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ ...cardSx, p: "1rem" }}>
                      <SectionHeader
                        title="Grading Summary"
                        sub="Comprehensive overview of daily performance metrics"
                        tx={tx}
                      />
                      <Box
                        sx={{
                          mt: 1,
                          height: 285,
                          overflowY: "auto",
                          overflowX: "auto",
                          borderRadius: 2,
                          bgcolor: isDark
                            ? "rgba(0,0,0,0.15)"
                            : "rgba(0,0,0,0.03)",
                        }}
                      >
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              {[
                                "Date",
                                "Grade",
                                "Percentage",
                                "Performance Insight",
                              ].map((h) => (
                                <TableCell
                                  key={h}
                                  sx={{
                                    bgcolor: isDark ? p[130] : "#fff",
                                    color: fg,
                                    fontWeight: 500,
                                    fontSize: "1rem",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {h}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {metrics.dates
                              .map((date, idx) => {
                                const score = metrics.gradePctSeries[idx];
                                const grade = ["F", "D", "C", "B", "B+", "A"][
                                  Math.round(metrics.gradeNumericSeries[idx])
                                ];
                                const insight =
                                  grade === "A"
                                    ? "Exceptional Efficiency & Vehicle Safety"
                                    : grade === "B+"
                                      ? "Strong performance, very good efficiency"
                                      : grade === "B"
                                        ? "Good operation, minor current overheads"
                                        : grade === "C"
                                          ? "Average; check idling / speed / Drive mode"
                                          : grade === "D"
                                            ? "Sub-optimal; high energy consumption"
                                            : "Critical Faults Detected";
                                return { date, grade, score, insight };
                              })
                              .reverse()
                              .map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell
                                    sx={{
                                      color: fg,
                                      fontSize: "0.9rem",
                                      whiteSpace: "nowrap",
                                      fontWeight: 300,
                                    }}
                                  >
                                    {row.date}
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{
                                        fontSize: "1.1rem",
                                        fontWeight: 700,
                                        color: gradeColorMap[row.grade],
                                      }}
                                    >
                                      {row.grade}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: fg,
                                      fontSize: "0.9rem",
                                      fontWeight: 300,
                                    }}
                                  >
                                    {row.score}%
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      color: row.grade === "A" ? "#2ECC71" : fg,
                                      fontSize: "0.9rem",
                                      whiteSpace: "nowrap",
                                      fontWeight: 300,
                                    }}
                                  >
                                    {row.insight}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ ...cardSx, p: "1rem" }}>
                      <SectionHeader
                        title="Daily Mode Distribution"
                        sub="Drive Mode usage (100% Stacked)"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={280}
                        series={metrics.modeStackData}
                        options={{
                          chart: {
                            ...base,
                            type: "bar",
                            stacked: true,
                            stackType: "100%",
                          },
                          colors: [p[1300], p[1200], p[1400], p[1100]],
                          xaxis: xCat(metrics.dates),
                          yaxis: yAx("Percentage (%)"),
                          plotOptions: { bar: { columnWidth: "60%" } },
                          legend: { position: "top", labels: { colors: fg } },
                          tooltip: {
                            ...baseTooltip,
                            shared: true,
                            intersect: false,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* ── Row 3: Speed Profile + SoC vs Avg Speed ──────────── */}
                  <Grid item xs={12} md={7}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Speed Profile"
                        sub="Max vs Average daily speed with optimal threshold"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="line"
                        height={280}
                        series={[
                          {
                            name: "Max Speed (km/h)",
                            data: metrics.spdMaxSeries,
                          },
                          {
                            name: "Avg Speed (km/h)",
                            data: metrics.spdAvgSeries,
                          },
                        ]}
                        options={{
                          chart: { ...base, type: "line" },
                          colors: [p[1100], p[500]],
                          stroke: {
                            width: [3, 2],
                            curve: "smooth",
                            dashArray: [0, 5],
                          },
                          xaxis: xCat(metrics.dates),
                          yaxis: yAx("Speed (km/h)"),
                          markers: { size: 4 },
                          legend: { position: "top", labels: { colors: fg } },
                          annotations: {
                            yaxis: [
                              {
                                y: 35,
                                borderColor: "#E67E22",
                                strokeDashArray: 3,
                                label: {
                                  text: "Optimal ceiling (35 km/h)",
                                  style: {
                                    color: "#fff",
                                    background: "#E67E22",
                                    fontSize: "10px",
                                  },
                                },
                              },
                            ],
                          },
                          tooltip: {
                            ...baseTooltip,
                            shared: true,
                            intersect: false,
                            y: { formatter: (v) => `${v} km/h` },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Avg Speed at SoC Bands"
                        sub="How driving speed varies with battery level"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={280}
                        series={[
                          { name: "Avg Speed (km/h)", data: metrics.socSpd },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1200]],
                          plotOptions: {
                            bar: { borderRadius: 4, columnWidth: "65%" },
                          },
                          xaxis: xSoc,
                          yaxis: yAx("Speed (km/h)"),
                          dataLabels: {
                            enabled: true,
                            formatter: (v) => (v > 0 ? `${v}` : ""),
                            style: {
                              fontSize: "9px",
                              colors: [isDark ? "#fff" : "#333"],
                            },
                          },
                          tooltip: {
                            ...baseTooltip,
                            y: { formatter: (v) => `${v} km/h` },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* ── Row 4: SoC Band — Current & Trip ─────────────────── */}
                  <Grid item xs={12} md={6}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Avg Current at SoC Bands"
                        sub="Drive current draw across battery charge levels"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={260}
                        series={[
                          { name: "Avg Current (A)", data: metrics.socA },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1500]],
                          plotOptions: {
                            bar: { borderRadius: 4, columnWidth: "65%" },
                          },
                          xaxis: xSoc,
                          yaxis: yAx("Current (A)"),
                          dataLabels: { enabled: false },
                          tooltip: {
                            ...baseTooltip,
                            y: { formatter: (v) => `${v} A` },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Trip Distance at SoC Bands"
                        sub="Cumulative km covered at each charge band"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={260}
                        series={[
                          { name: "Distance (km)", data: metrics.socTrip },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1700]],
                          plotOptions: {
                            bar: { borderRadius: 4, columnWidth: "65%" },
                          },
                          xaxis: xSoc,
                          yaxis: yAx("Distance (km)"),
                          dataLabels: { enabled: false },
                          tooltip: {
                            ...baseTooltip,
                            y: { formatter: (v) => `${v} km` },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* ── Row 5: Mode Donut + Gear Donut ───────────────────── */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ ...cardSx, p: "0.5rem" }}>
                      <SectionHeader
                        title="Drive Mode Distribution"
                        sub="Aggregated mode usage — all sessions in period"
                        tx={tx}
                      />
                      {metrics.modePies.series.length > 0 ? (
                        <ReactApexChart
                          type="donut"
                          height={280}
                          series={metrics.modePies.series}
                          options={{
                            chart: { ...base, type: "donut" },
                            labels: metrics.modePies.labels,
                            colors: [p[1300], p[1200], p[1400], p[1100]],
                            legend: {
                              position: "right",
                              labels: { colors: fg },
                            },
                            plotOptions: {
                              pie: {
                                donut: {
                                  size: "65%",
                                  labels: {
                                    show: true,
                                    total: {
                                      show: true,
                                      label: "Total Mins",
                                      color: fg,
                                      fontSize: "11px",
                                      formatter: (w) =>
                                        w.globals.seriesTotals.reduce(
                                          (a, b) => a + b,
                                          0,
                                        ) + " min",
                                    },
                                  },
                                },
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: { formatter: (v) => `${v} min` },
                            },
                            dataLabels: { style: { fontSize: "11px" } },
                          }}
                        />
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height={280}
                        >
                          <Typography color={fg} variant="caption">
                            No mode data available
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ ...cardSx, p: "0.5rem" }}>
                      <SectionHeader
                        title="Gear Distribution"
                        sub="Aggregated gear usage across all drive sessions"
                        tx={tx}
                      />
                      {metrics.gearPies.series.some((v) => v > 0) ? (
                        <ReactApexChart
                          type="donut"
                          height={280}
                          series={metrics.gearPies.series}
                          options={{
                            chart: { ...base, type: "donut" },
                            labels: metrics.gearPies.labels,
                            colors: [p[500], p[1100]],
                            legend: {
                              position: "right",
                              labels: { colors: fg },
                            },
                            plotOptions: {
                              pie: {
                                donut: {
                                  size: "65%",
                                  labels: {
                                    show: true,
                                    total: {
                                      show: true,
                                      label: "Total Mins",
                                      color: fg,
                                      fontSize: "11px",
                                      formatter: (w) =>
                                        w.globals.seriesTotals.reduce(
                                          (a, b) => a + b,
                                          0,
                                        ) + " min",
                                    },
                                  },
                                },
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: { formatter: (v) => `${v} min` },
                            },
                          }}
                        />
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height={280}
                        >
                          <Typography color={fg} variant="caption">
                            No gear data available for this period
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* ── Row 6: Gear Stack Over Time ───────────────────────── */}
                  {metrics.gearStackData.some((s) =>
                    s.data.some((v) => v > 0),
                  ) && (
                    <Grid item xs={12}>
                      <Box sx={[cardSx, { p: "0.5rem" }]}>
                        <SectionHeader
                          title="Daily Gear Usage Pattern"
                          sub="Gear 1 vs Gear 2 — 100% stacked distribution over time"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={220}
                          series={metrics.gearStackData}
                          options={{
                            chart: {
                              ...base,
                              type: "bar",
                              stacked: true,
                              stackType: "100%",
                            },
                            colors: [p[500], p[1100]],
                            xaxis: xCat(metrics.dates),
                            yaxis: yAx("Percentage (%)"),
                            plotOptions: { bar: { columnWidth: "60%" } },
                            legend: { position: "top", labels: { colors: fg } },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  {/* ── Row 7: Performance Grade Trend ───────────────────── */}
                  <Grid item xs={12}>
                    <Box sx={[cardSx, { p: "0.5rem" }]}>
                      <SectionHeader
                        title="Performance Grade Trend"
                        sub="Daily score (0–100) over the selected period"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="area"
                        height={220}
                        series={[
                          { name: "Score", data: metrics.gradePctSeries },
                        ]}
                        options={{
                          chart: { ...base, type: "area" },
                          colors: [p[500]],
                          stroke: { width: 3, curve: "smooth" },
                          fill: {
                            type: "gradient",
                            gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
                          },
                          xaxis: xCat(metrics.dates),
                          yaxis: { ...yAx("Score (0–100)"), min: 0, max: 100 },
                          markers: {
                            size: 6,
                            colors: metrics.gradeColorSeries,
                            strokeColors: metrics.gradeColorSeries,
                            strokeWidth: 2,
                          },
                          annotations: {
                            yaxis: [
                              {
                                y: 80,
                                borderColor: "#2ECC71",
                                strokeDashArray: 3,
                                label: {
                                  text: "Grade B+ threshold",
                                  style: {
                                    color: "#fff",
                                    background: "#2ECC71",
                                    fontSize: "10px",
                                  },
                                },
                              },
                              {
                                y: 60,
                                borderColor: "#E67E22",
                                strokeDashArray: 3,
                                label: {
                                  text: "Grade C threshold",
                                  style: {
                                    color: "#fff",
                                    background: "#E67E22",
                                    fontSize: "10px",
                                  },
                                },
                              },
                            ],
                          },
                          tooltip: {
                            ...baseTooltip,
                            y: {
                              formatter: (v) => {
                                const g =
                                  v >= 90
                                    ? "A"
                                    : v >= 80
                                      ? "B+"
                                      : v >= 70
                                        ? "B"
                                        : v >= 60
                                          ? "C"
                                          : v >= 1
                                            ? "D"
                                            : "F";
                                return `${v} pts — Grade ${g}`;
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* ── TAB 3: CHARGING ───────────────────────────────────── */}
            <TabPanel value={activeTab} index={2}>
              <Box p={2}>
                {!metrics ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                  >
                    <Typography color={fg}>
                      Please click "Compute" to view Charging analytics.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {/* ── ROW 0: 5 CHARGING KPI MINI-CARDS ─────────────────────────── */}
                    {[
                      {
                        label: "Energy Charged",
                        value: `${metrics.totalChargeKwh} kWh`,
                        sub: `${metrics.totalChargeSessions} charging sessions`,
                        icon: <EvStationIcon sx={{ fontSize: "1.5rem" }} />,
                        accent: p[500],
                      },
                      {
                        label: "Avg Session Duration",
                        value: `${metrics.avgChargeDuration} min`,
                        sub: `≈ ${(metrics.avgChargeDuration / 60).toFixed(1)} hours per session`,
                        icon: <SpeedIcon sx={{ fontSize: "1.5rem" }} />,
                        accent: p[1100],
                      },
                      {
                        label: "Avg C-Rate",
                        value:
                          metrics.avgCRate > 0
                            ? `C/${Math.round(1 / metrics.avgCRate)}`
                            : "—",
                        sub:
                          metrics.avgCRate > 0
                            ? `${(metrics.avgCRate * 100).toFixed(2)}% capacity / hr`
                            : "No data",
                        icon: (
                          <BrightnessAutoIcon sx={{ fontSize: "1.5rem" }} />
                        ),
                        accent: p[1200],
                      },
                      {
                        label: "Avg Cell Imbalance",
                        value: `${metrics.avgCellDeltaMv} mV`,
                        sub:
                          metrics.avgCellDeltaMv < 30
                            ? "✓ Excellent balance"
                            : metrics.avgCellDeltaMv < 60
                              ? "⚠ Moderate — watch trend"
                              : "✗ High — needs attention",
                        icon: <WarningAmberIcon sx={{ fontSize: "1.5rem" }} />,
                        accent:
                          metrics.avgCellDeltaMv < 30
                            ? "#2ECC71"
                            : metrics.avgCellDeltaMv < 60
                              ? "#E67E22"
                              : "#E74C3C",
                      },
                      {
                        label: "BMS Alerts",
                        value: metrics.totalChargeFaults,
                        sub:
                          metrics.totalChargeFaults === 0
                            ? "No faults detected"
                            : "Review Session Table",
                        icon: <WarningAmberIcon sx={{ fontSize: "1.5rem" }} />,
                        accent:
                          metrics.totalChargeFaults === 0
                            ? "#2ECC71"
                            : "#E74C3C",
                      },
                    ].map((kpi, i) => (
                      <Grid item xs={6} sm={4} md={2.4} key={i}>
                        <Box sx={{ ...cardSx, p: 2 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                          >
                            <Box sx={{ color: kpi.accent, display: "flex" }}>
                              {kpi.icon}
                            </Box>
                            <Typography
                              variant="caption"
                              color={fg}
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                lineHeight: 1.2,
                              }}
                            >
                              {kpi.label}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 800,
                              color: tx,
                              lineHeight: 1.1,
                              mb: 0.3,
                            }}
                          >
                            {kpi.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: kpi.accent, fontSize: "0.68rem" }}
                          >
                            {kpi.sub}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}

                    {/* ── ROW 1: HEALTH GAUGE + DIAGNOSTIC INSIGHT ROWS ────────────── */}
                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          ...cardSx,
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="overline"
                          color={fg}
                          sx={{ mb: 0.5, fontSize: "0.7rem", letterSpacing: 1 }}
                        >
                          Charging Health Score
                        </Typography>
                        <ReactApexChart
                          type="radialBar"
                          height={210}
                          series={[metrics.chargingHealthScore]}
                          options={{
                            chart: { ...base, type: "radialBar" },
                            plotOptions: {
                              radialBar: {
                                startAngle: -135,
                                endAngle: 135,
                                hollow: {
                                  size: "52%",
                                  background: "transparent",
                                },
                                track: {
                                  background: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.08)",
                                  strokeWidth: "100%",
                                },
                                dataLabels: {
                                  name: {
                                    show: true,
                                    color: fg,
                                    fontSize: "11px",
                                    offsetY: -8,
                                  },
                                  value: {
                                    show: true,
                                    fontSize: "30px",
                                    fontWeight: 800,
                                    offsetY: 6,
                                    color:
                                      metrics.chargingHealthScore >= 80
                                        ? "#2ECC71"
                                        : metrics.chargingHealthScore >= 60
                                          ? "#E67E22"
                                          : "#E74C3C",
                                    formatter: (v) => `${v}`,
                                  },
                                },
                              },
                            },
                            fill: {
                              type: "gradient",
                              gradient: {
                                shade: "dark",
                                type: "horizontal",
                                gradientToColors: [
                                  metrics.chargingHealthScore >= 80
                                    ? "#2ECC71"
                                    : metrics.chargingHealthScore >= 60
                                      ? "#F1C40F"
                                      : "#E74C3C",
                                ],
                                stops: [0, 100],
                              },
                            },
                            colors: [
                              metrics.chargingHealthScore >= 80
                                ? "#27AE60"
                                : metrics.chargingHealthScore >= 60
                                  ? "#E67E22"
                                  : "#C0392B",
                            ],
                            labels: ["Health"],
                            stroke: { lineCap: "round" },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color={fg}
                          sx={{
                            textAlign: "center",
                            fontSize: "0.7rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {metrics.chargingHealthScore >= 80
                            ? "Battery charging is in excellent condition"
                            : metrics.chargingHealthScore >= 60
                              ? "Monitor cell balance & thermals closely"
                              : "Attention required — inspect BMS faults"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <Box sx={{ ...cardSx, p: 2, height: "100%" }}>
                        <SectionHeader
                          title="Charging Performance Diagnostic"
                          sub="Heuristic-based real-time session analysis"
                          tx={tx}
                        />
                        <Box
                          mt={1.5}
                          display="flex"
                          flexDirection="column"
                          gap={1}
                        >
                          {[
                            {
                              label: "Cell Voltage Balance",
                              value: `${metrics.avgCellDeltaMv} mV avg spread`,
                              status:
                                metrics.avgCellDeltaMv < 30
                                  ? "good"
                                  : metrics.avgCellDeltaMv < 60
                                    ? "warn"
                                    : "bad",
                              detail:
                                metrics.avgCellDeltaMv < 30
                                  ? "Cells are well-balanced — BMS balancing circuits operating effectively"
                                  : metrics.avgCellDeltaMv < 60
                                    ? "Moderate imbalance — consider a full balancing charge cycle"
                                    : "High cell spread detected — BMS may be struggling to balance under load",
                            },
                            {
                              label: "Thermal Management",
                              value: `${metrics.maxChargeTemp}°C peak observed`,
                              status:
                                metrics.maxChargeTemp < 45
                                  ? "good"
                                  : metrics.maxChargeTemp < 55
                                    ? "warn"
                                    : "bad",
                              detail:
                                metrics.maxChargeTemp < 45
                                  ? "Thermals are well within safe limits across all charging sessions"
                                  : metrics.maxChargeTemp < 55
                                    ? "Slightly elevated — ensure adequate ventilation around battery pack"
                                    : "Thermal stress detected — inspect cooling system before next session",
                            },
                            {
                              label: "Charging Rate (C-Rate)",
                              value:
                                metrics.avgCRate > 0
                                  ? `C/${Math.round(1 / metrics.avgCRate)} average (slow charge)`
                                  : "Insufficient data",
                              status: "good",
                              detail:
                                "Low C-rate charging extends cycle life — optimal for long-term battery health and longevity",
                            },
                            {
                              label: "BMS Fault Status",
                              value:
                                metrics.totalChargeFaults === 0
                                  ? "All clear — no interruptions"
                                  : `${metrics.totalChargeFaults} alert(s) logged across sessions`,
                              status:
                                metrics.totalChargeFaults === 0
                                  ? "good"
                                  : "bad",
                              detail:
                                metrics.totalChargeFaults === 0
                                  ? "All charging sessions completed successfully without BMS protection triggers"
                                  : "BMS alerts were logged — review the Session Table tab for fault codes per session",
                            },
                            {
                              label: "Energy Throughput",
                              value: `${metrics.totalChargeKwh} kWh charged total`,
                              status: "good",
                              detail: `Across ${metrics.totalChargeSessions} charge session(s), averaging ${metrics.totalChargeSessions > 0 ? (metrics.totalChargeKwh / metrics.totalChargeSessions).toFixed(2) : 0} kWh per session`,
                            },
                          ].map((item, i) => {
                            const statusColor =
                              item.status === "good"
                                ? "#2ECC71"
                                : item.status === "warn"
                                  ? "#E67E22"
                                  : "#E74C3C";
                            return (
                              <Box
                                key={i}
                                display="flex"
                                alignItems="flex-start"
                                gap={1.5}
                                p={1.2}
                                borderRadius={1.5}
                                bgcolor={
                                  isDark
                                    ? "rgba(0,0,0,0.15)"
                                    : "rgba(0,0,0,0.03)"
                                }
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: statusColor,
                                    mt: 0.7,
                                    flexShrink: 0,
                                  }}
                                />
                                <Box flex={1}>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    gap={0.5}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 700,
                                        color: tx,
                                        fontSize: "0.78rem",
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: statusColor,
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {item.value}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: fg,
                                      fontSize: "0.71rem",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {item.detail}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Grid>

                    {/* ── ROW 2: SoC LIFECYCLE + C-RATE ANALYSIS ───────────────────── */}
                    <Grid item xs={12} md={6}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="SoC Lifecycle"
                          sub="Charging window per session — Start → End State of Charge"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="rangeBar"
                          height={280}
                          series={[
                            {
                              name: "SoC Range (%)",
                              data: metrics?.chargeSocRangeSeries || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "rangeBar" },
                            plotOptions: {
                              bar: {
                                horizontal: false,
                                columnWidth: "45%",
                                borderRadius: 4,
                              },
                            },
                            colors: [p[500]],
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: {
                              min: 0,
                              max: 100,
                              title: { text: "SoC %", style: { color: fg } },
                              labels: {
                                style: { colors: fg },
                                formatter: (v) => `${v}%`,
                              },
                            },
                            annotations: {
                              yaxis: [
                                {
                                  y: 20,
                                  borderColor: "#E74C3C",
                                  label: {
                                    text: "Low SoC threshold",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                                {
                                  y: 80,
                                  borderColor: "#27AE60",
                                  label: {
                                    text: "Optimal ceiling",
                                    style: {
                                      color: "#fff",
                                      background: "#27AE60",
                                      fontSize: "10px",
                                    },
                                  },
                                },
                              ],
                            },
                            tooltip: {
                              ...baseTooltip,
                              custom: ({ dataPointIndex }) => {
                                const d =
                                  metrics?.chargeSocRangeSeries?.[
                                    dataPointIndex
                                  ];
                                const gained =
                                  (d?.y?.[1] ?? 0) - (d?.y?.[0] ?? 0);
                                return `<div style="padding:10px;background:#1e293b;color:#fff;border-radius:6px;font-size:12px;line-height:1.8">
                      <strong>${d?.x || ""}</strong><br/>
                      Start SOC: <strong>${d?.y?.[0] ?? 0}%</strong><br/>
                      End SOC: <strong>${d?.y?.[1] ?? 0}%</strong><br/>
                      Gained: <strong style="color:#2ECC71">+${gained}%</strong>
                    </div>`;
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="C-Rate Analysis"
                          sub="Charging speed as a fraction of battery capacity per hour"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={280}
                          series={[
                            {
                              name: "C-Rate (%/hr)",
                              data:
                                metrics?.cRateSeries?.map(
                                  (v) => +(v * 100).toFixed(3),
                                ) || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1200]],
                            plotOptions: {
                              bar: { borderRadius: 4, columnWidth: "50%" },
                            },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: {
                              title: {
                                text: "C-Rate (%/hr)",
                                style: { color: fg },
                              },
                              labels: {
                                style: { colors: fg },
                                formatter: (v) => `${v.toFixed(2)}%`,
                              },
                            },
                            dataLabels: {
                              enabled: true,
                              formatter: (v) =>
                                v > 0 ? `C/${Math.round(100 / v)}` : "—",
                              style: {
                                fontSize: "11px",
                                fontWeight: 700,
                                colors: [isDark ? "#fff" : "#222"],
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: {
                                formatter: (v) =>
                                  v > 0
                                    ? `${v.toFixed(3)}%/hr  ·  C/${Math.round(100 / v)} charge rate`
                                    : "No data",
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* ── ROW 3: CELL VOLTAGE HEALTH + PACK VOLTAGE PROFILE ────────── */}
                    <Grid item xs={12} md={6}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Cell Voltage Health"
                          sub="High / Low cell spread and daily imbalance in mV"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={280}
                          series={[
                            {
                              name: "High Cell (V)",
                              data: metrics?.cellMaxSeries || [],
                            },
                            {
                              name: "Low Cell (V)",
                              data: metrics?.cellMinSeries || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1100], p[1500]],
                            plotOptions: {
                              bar: {
                                borderRadius: 3,
                                columnWidth: "55%",
                                grouped: true,
                              },
                            },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: {
                              title: {
                                text: "Cell Voltage (V)",
                                style: { color: fg },
                              },
                              labels: {
                                style: { colors: fg },
                                formatter: (v) => `${v.toFixed(3)}V`,
                              },
                              min: 3.0,
                              max: 3.7,
                            },
                            dataLabels: { enabled: false },
                            legend: { position: "top", labels: { colors: fg } },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                              custom: ({ dataPointIndex, w }) => {
                                const hi =
                                  metrics?.cellMaxSeries?.[dataPointIndex] ?? 0;
                                const lo =
                                  metrics?.cellMinSeries?.[dataPointIndex] ?? 0;
                                const delta = +((hi - lo) * 1000).toFixed(1);
                                const status =
                                  delta < 30
                                    ? "✓ Balanced"
                                    : delta < 60
                                      ? "⚠ Moderate"
                                      : "✗ High";
                                return `<div style="padding:10px;background:#1e293b;color:#fff;border-radius:6px;font-size:12px;line-height:1.8">
                      <strong>${metrics?.dates?.[dataPointIndex] || ""}</strong><br/>
                      High Cell: <strong>${hi.toFixed(3)} V</strong><br/>
                      Low Cell: <strong>${lo.toFixed(3)} V</strong><br/>
                      Spread: <strong style="color:${delta < 30 ? "#2ECC71" : delta < 60 ? "#E67E22" : "#E74C3C"}">${delta} mV — ${status}</strong>
                    </div>`;
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Pack Voltage Profile"
                          sub="Initial vs Final pack voltage — tracks charge recovery & depth"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="line"
                          height={280}
                          series={[
                            {
                              name: "Init Voltage (V)",
                              data: metrics?.packInitVSeries || [],
                            },
                            {
                              name: "Final Voltage (V)",
                              data: metrics?.packFinalVSeries || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "line" },
                            colors: [p[1300], p[500]],
                            stroke: {
                              width: [2, 3],
                              curve: "smooth",
                              dashArray: [6, 0],
                            },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: {
                              title: {
                                text: "Pack Voltage (V)",
                                style: { color: fg },
                              },
                              labels: {
                                style: { colors: fg },
                                formatter: (v) => `${v ? v.toFixed(1) : ""}V`,
                              },
                            },
                            markers: { size: 5 },
                            legend: { position: "top", labels: { colors: fg } },
                            annotations: {
                              yaxis: [
                                {
                                  y: 76.8,
                                  borderColor: "#E74C3C",
                                  borderWidth: 1.5,
                                  strokeDashArray: 4,
                                  label: {
                                    text: "Min Safe Voltage",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                      padding: {
                                        left: 6,
                                        right: 6,
                                        top: 2,
                                        bottom: 2,
                                      },
                                    },
                                  },
                                },
                              ],
                            },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                              y: {
                                formatter: (v) =>
                                  v != null ? `${v.toFixed(2)} V` : "N/A",
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* ── ROW 4: DURATION TIMELINE (enhanced labels) ───────────────── */}
                    <Grid item xs={12}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Session Duration Timeline"
                          sub="Total time spent charging per day — auto-scaled"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={240}
                          series={[
                            {
                              name: "Duration (mins)",
                              data: metrics?.chargeDurationSeries || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            plotOptions: {
                              bar: {
                                horizontal: true,
                                borderRadius: 3,
                                barHeight: "60%",
                              },
                            },
                            colors: [p[1300]],
                            xaxis: {
                              ...xCat(metrics?.dates || []),
                              title: { text: "Minutes", style: { color: fg } },
                            },
                            yaxis: {
                              labels: { show: true, style: { colors: fg } },
                            },
                            dataLabels: {
                              enabled: true,
                              formatter: (v) => {
                                const h = Math.floor(v / 60);
                                const m = Math.round(v % 60);
                                return h > 0 ? `${h}h ${m}m` : `${m}m`;
                              },
                              style: {
                                colors: ["#fff"],
                                fontSize: "10px",
                                fontWeight: 600,
                              },
                            },
                            tooltip: {
                              ...baseTooltip,
                              y: {
                                formatter: (v) => {
                                  const h = Math.floor(v / 60);
                                  const m = Math.round(v % 60);
                                  return h > 0
                                    ? `${h} hrs ${m} mins`
                                    : `${v} mins`;
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* ── ROW 5: THERMAL PROFILE (fixed + threshold annotation) ─────── */}
                    <Grid item xs={12}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Thermal Profile During Charging"
                          sub="MOSFET + T1 · T2 · T3 · T4 battery temperature sensors"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="line"
                          height={320}
                          series={[
                            {
                              name: "MOS Temperature",
                              data: metrics?.chargeMosSeries || [],
                            },
                            {
                              name: "T1 (Battery)",
                              data: metrics?.t1Series || [],
                            },
                            {
                              name: "T2 (Battery)",
                              data: metrics?.t2Series || [],
                            },
                            {
                              name: "T3 (Battery)",
                              data: metrics?.t3Series || [],
                            },
                            {
                              name: "T4 (Battery)",
                              data: metrics?.t4Series || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "line" },
                            colors: [p[500], p[1200], p[1500], p[1700], p[400]],
                            stroke: { width: [3, 2, 2, 2, 2], curve: "smooth" },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: {
                              ...yAx("Temperature (°C)"),
                              max: 80,
                              labels: {
                                style: { colors: fg },
                                formatter: (v) => `${v}°C`,
                              },
                            },
                            markers: { size: 4 },
                            legend: { position: "top", labels: { colors: fg } },
                            annotations: {
                              yaxis: [
                                {
                                  y: 60,
                                  borderColor: "#E74C3C",
                                  borderWidth: 1.5,
                                  strokeDashArray: 4,
                                  label: {
                                    text: "Warning Threshold (60°C)",
                                    style: {
                                      color: "#fff",
                                      background: "#E74C3C",
                                      fontSize: "10px",
                                      padding: {
                                        left: 6,
                                        right: 6,
                                        top: 2,
                                        bottom: 2,
                                      },
                                    },
                                  },
                                },
                                {
                                  y: 45,
                                  borderColor: "#E67E22",
                                  borderWidth: 1,
                                  strokeDashArray: 3,
                                  label: {
                                    text: "Caution (45°C)",
                                    style: {
                                      color: "#fff",
                                      background: "#E67E22",
                                      fontSize: "10px",
                                      padding: {
                                        left: 4,
                                        right: 4,
                                        top: 2,
                                        bottom: 2,
                                      },
                                    },
                                  },
                                },
                              ],
                            },
                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                              y: { formatter: (v) => `${v}°C` },
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* ── TAB 4: SESSION TABLE ───────────────────────────── */}
            <TabPanel value={activeTab} index={3}>
              <Box p={2}>
                {/* ── Summary Stats Bar ──────────────────────────────────── */}
                <Grid container spacing={2} mb={2}>
                  {[
                    {
                      label: "Driving Days",
                      value: metrics.tableRows.length,
                      alert: false,
                    },
                    {
                      label: "Total Sessions",
                      value: metrics.totalDriveSessions,
                      alert: false,
                    },
                    {
                      label: "Charge Sessions",
                      value: metrics.totalChargeSessions,
                      alert: false,
                    },
                    {
                      label: "Total Distance",
                      value: `${metrics.tDist.toFixed(1)} km`,
                      alert: false,
                    },
                    {
                      label: "Active Faults",
                      value: metrics.totalFaultCount,
                      alert: metrics.totalFaultCount > 0,
                    },
                    {
                      label: "Best Day Grade",
                      value: (() => {
                        for (const g of ["A", "B+", "B", "C", "D", "F"]) {
                          if (metrics.tableRows.some((r) => r.grade === g))
                            return g;
                        }
                        return "—";
                      })(),
                      alert: false,
                      colored: true,
                    },
                  ].map((stat, i) => (
                    <Grid item xs={6} sm={4} md={2} key={i}>
                      <Box sx={{ ...cardSx, p: 1.8, textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            lineHeight: 1,
                            mb: 0.4,
                            color: stat.alert
                              ? "#E74C3C"
                              : stat.colored
                                ? gradeColorMap[stat.value] || tx
                                : tx,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={fg}
                          sx={{ fontSize: "0.68rem", letterSpacing: 0.5 }}
                        >
                          {stat.label.toUpperCase()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* ── Main Sortable Table ─────────────────────────────────── */}
                <Box sx={{ ...cardSx, p: 0, overflow: "hidden", mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p="0.5rem"
                    borderBottom={`0.5px solid ${isDark ? p[140] : p[400]}`}
                  >
                    <SectionHeader
                      title="Session Data Table"
                      sub={
                        sortedRows.length +
                        " records · click row to expand drive sessions"
                      }
                      tx={tx}
                    />
                    <Tooltip title="Export table as CSV">
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        variant="outlined"
                        onClick={() => exportCSV(sortedRows)}
                        sx={{
                          textTransform: "none",
                          borderColor: p[400],
                          color: tx,
                          fontSize: 12,
                        }}
                      >
                        Export CSV
                      </Button>
                    </Tooltip>
                  </Box>

                  <TableContainer sx={{ maxHeight: 420 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          {[
                            { id: "date", label: "Date" },
                            { id: "driveSessions", label: "Drive Sessions" },
                            { id: "totalDistance", label: "Distance (km)" },
                            { id: "duration", label: "Duration" },
                            { id: "cycles", label: "Battery Cycles" },
                            { id: "grade", label: "Grade" },
                            { id: "batteryFault", label: "Battery Fault" },
                            {
                              id: "controllerFault",
                              label: "Controller Fault",
                            },
                          ].map((col) => (
                            <TableCell
                              key={col.id}
                              sx={{
                                fontWeight: 400,
                                fontSize: 17,
                                bgcolor: cardBg,
                                color: tx,
                              }}
                            >
                              <TableSortLabel
                                active={tableSort.col === col.id}
                                direction={
                                  tableSort.col === col.id
                                    ? tableSort.dir
                                    : "asc"
                                }
                                onClick={() => toggleSort(col.id)}
                                sx={{
                                  color: `${tx} !important`,
                                  "& .MuiTableSortLabel-icon": {
                                    color: `${fg} !important`,
                                  },
                                }}
                              >
                                {col.label}
                              </TableSortLabel>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedRows.map((row, i) => (
                          <React.Fragment key={i}>
                            <TableRow
                              hover
                              onClick={() =>
                                setExpandedRow(expandedRow === i ? null : i)
                              }
                              sx={{
                                cursor: "pointer",
                                borderLeft: `3px solid ${gradeColorMap[row.grade] || "transparent"}`,
                                "&:hover": {
                                  bgcolor: isDark
                                    ? "rgba(255,255,255,0.03)"
                                    : "rgba(0,0,0,0.02)",
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontSize: 15,
                                  fontWeight: 300,
                                  padding: "15px",
                                }}
                              >
                                {row.date}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.driveSessions}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.totalDistance}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.duration}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.cycles}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: gradeColorMap[row.grade],
                                }}
                              >
                                {row.grade}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.batteryFault === "None" ? (
                                  <Chip
                                    label="None"
                                    size="small"
                                    color="success"
                                    sx={{
                                      fontSize: 10,
                                      height: 18,
                                      fontWeight: 300,
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    label={row.batteryFault}
                                    size="small"
                                    color="error"
                                    sx={{
                                      fontSize: 10,
                                      height: 18,
                                      fontWeight: 300,
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                {row.controllerFault === "None" ? (
                                  <Chip
                                    label="None"
                                    size="small"
                                    color="success"
                                    sx={{
                                      fontSize: 10,
                                      height: 18,
                                      fontWeight: 300,
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    label={row.controllerFault}
                                    size="small"
                                    color="warning"
                                    sx={{
                                      fontSize: 10,
                                      height: 18,
                                      fontWeight: 300,
                                    }}
                                  />
                                )}
                              </TableCell>
                            </TableRow>

                            {/* Expanded Row */}
                            {expandedRow === i && (
                              <TableRow>
                                <TableCell colSpan={8} sx={{ p: 0 }}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      bgcolor: isDark
                                        ? "rgba(0,0,0,0.1)"
                                        : "rgba(0,0,0,0.02)",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      mb={1}
                                      color={p[500]}
                                    >
                                      Drive Sessions Detail
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Session Time",
                                            "Grade",
                                            "Trip",
                                            "Faults / Insights",
                                          ].map((h) => (
                                            <TableCell
                                              key={h}
                                              sx={{
                                                color: fg,
                                                fontWeight: 500,
                                              }}
                                            >
                                              {h}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {row.sessions?.map((s) => (
                                          <TableRow key={s.id}>
                                            <TableCell
                                              sx={{
                                                fontSize: 13,
                                                color: fg,
                                                fontWeight: 300,
                                              }}
                                            >
                                              {row.date} [{s.start} – {s.end}] (
                                              {s.duration} mins)
                                            </TableCell>
                                            <TableCell>
                                              <Typography
                                                sx={{
                                                  fontSize: 13,
                                                  fontWeight: 700,
                                                  color: gradeColorMap[s.grade],
                                                }}
                                              >
                                                {s.grade}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: 13,
                                                color: fg,
                                                fontWeight: 300,
                                              }}
                                            >
                                              {s.dist} km · {s.kwh} kWh
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: 12,
                                                fontWeight: 300,
                                                color:
                                                  s.grade === "F" ||
                                                  s.faults?.length > 0
                                                    ? "error.main"
                                                    : fg,
                                              }}
                                            >
                                              {s.faults?.length > 0
                                                ? `Faults: ${s.faults.join(", ")}`
                                                : s.grade === "F"
                                                  ? "Performance Critically Low"
                                                  : "No Faults Detected"}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* ── Fault Analytics ────────────────────────────────────── */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ ...cardSx, p: "0.5rem" }}>
                      <SectionHeader
                        title="Fault Timeline"
                        sub="Battery & controller fault events logged per day"
                        tx={tx}
                      />
                      <ReactApexChart
                        type="bar"
                        height={220}
                        series={[
                          {
                            name: "Fault Count",
                            data: metrics.tableRows.map(
                              (r) =>
                                (r.faults || []).filter(
                                  (f) =>
                                    f && f !== "None" && f !== "" && f !== "0",
                                ).length,
                            ),
                          },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [
                            metrics.totalFaultCount === 0
                              ? "#2ECC71"
                              : "#E74C3C",
                          ],
                          plotOptions: {
                            bar: { borderRadius: 4, columnWidth: "50%" },
                          },
                          xaxis: xCat(metrics.tableRows.map((r) => r.date)),
                          yaxis: { ...yAx("Fault Count"), tickAmount: 3 },
                          dataLabels: {
                            enabled: true,
                            formatter: (v) => (v > 0 ? v : ""),
                            style: { fontSize: "11px", colors: ["#fff"] },
                          },
                          tooltip: {
                            ...baseTooltip,
                            y: { formatter: (v) => `${v} fault(s)` },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        ...cardSx,
                        p: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="overline"
                        color={fg}
                        sx={{ fontSize: "0.68rem", letterSpacing: 1 }}
                      >
                        Session Quality Breakdown
                      </Typography>
                      <Box
                        mt={1.5}
                        display="flex"
                        flexDirection="column"
                        gap={1}
                      >
                        {["A", "B+", "B", "C", "D", "F"].map((g) => {
                          const count = metrics.tableRows.filter(
                            (r) => r.grade === g,
                          ).length;
                          const pct =
                            metrics.tableRows.length > 0
                              ? Math.round(
                                  (count / metrics.tableRows.length) * 100,
                                )
                              : 0;
                          return (
                            <Box
                              key={g}
                              display="flex"
                              alignItems="center"
                              gap={1.5}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.9rem",
                                  color: gradeColorMap[g],
                                  width: 28,
                                }}
                              >
                                {g}
                              </Typography>
                              <Box
                                flex={1}
                                bgcolor={
                                  isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(0,0,0,0.08)"
                                }
                                borderRadius={1}
                                overflow="hidden"
                                height={10}
                              >
                                <Box
                                  sx={{
                                    width: `${pct}%`,
                                    height: "100%",
                                    bgcolor: gradeColorMap[g],
                                    borderRadius: 1,
                                    transition: "width 0.6s ease",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                color={fg}
                                sx={{
                                  fontSize: "0.72rem",
                                  width: 36,
                                  textAlign: "right",
                                }}
                              >
                                {count}d · {pct}%
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomDateAnalytics;
