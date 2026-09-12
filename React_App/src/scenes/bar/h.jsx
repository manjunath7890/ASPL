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

            {/* ── TAB 1: TEMPERATURE TRENDS ─────────────────────────── */}
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
                    <Grid item xs={12} md={6} lg={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="Temperature Trends"
                          sub="Motor · Controller · MOSFET over time"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="line"
                          height={320}
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
                            stroke: {
                              width: [3, 3, 3],
                              curve: "smooth",
                            },
                            fill: {
                              type: ["solid", "solid", "solid"],
                            },
                            xaxis: xCat(metrics.dates),
                            yaxis: yAx("Temperature (°C)"),
                            dataLabels: { enabled: true },
                            legend: { labels: { colors: fg } },
                            markers: { size: 0 },
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

                    <Grid item xs={12} md={6} lg={6}>
                      <Box sx={{ ...cardSx, p: "0.5rem" }}>
                        <SectionHeader
                          title="Motor & Controller Temperature"
                          sub="Motor & Controller Temperature"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={320}
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
                              bar: {
                                borderRadius: 4,
                                columnWidth: "50%", // controls spacing
                              },
                            },

                            xaxis: xCat(metrics.dates),
                            yaxis: yAx("Temperature (°C)"),

                            dataLabels: { enabled: false },

                            tooltip: {
                              ...baseTooltip,
                              shared: true,
                              intersect: false,
                            },

                            legend: {
                              position: "top",
                              labels: { colors: fg },
                            },
                          }}
                        />
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
                  {/* Row 1: Daily Performance (8) & Energy Consumption (4) */}
                  <Grid item xs={12} md={8} lg={8}>
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
                          {
                            name: "Daily Trip (km)",
                            data: metrics.distSeries,
                          },
                          {
                            name: "Wh/km",
                            data: metrics.whPerKmSeries,
                          },
                          {
                            name: "Average Speed (km/h)",
                            data: metrics.spdAvgSeries,
                          },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1100], p[1200], p[1500]],
                          plotOptions: {
                            bar: {
                              borderRadius: 3,
                              columnWidth: "65%",
                            },
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

                  <Grid item xs={12} md={4} lg={4}>
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
                          {
                            name: "kWh Consumed",
                            data: metrics.kwhSeries,
                          },
                        ]}
                        options={{
                          chart: { ...base, type: "bar" },
                          colors: [p[1700]],
                          plotOptions: {
                            bar: {
                              borderRadius: 3,
                              columnWidth: "50%",
                            },
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

                  {/* Row 2: Grading Summary Table (Left) & Mode Distribution (Right) */}
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
                          height: 285, // Match chart height
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
                              <TableCell
                                sx={{
                                  bgcolor: isDark ? p[130] : "#fff",
                                  color: fg,
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Date
                              </TableCell>
                              <TableCell
                                sx={{
                                  bgcolor: isDark ? p[130] : "#fff",
                                  color: fg,
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Grade
                              </TableCell>
                              <TableCell
                                sx={{
                                  bgcolor: isDark ? p[130] : "#fff",
                                  color: fg,
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Percentage
                              </TableCell>
                              <TableCell
                                sx={{
                                  bgcolor: isDark ? p[130] : "#fff",
                                  color: fg,
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Performance Insight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {metrics.dates
                              .map((date, idx) => {
                                const score = metrics.gradePctSeries[idx];
                                const grade = ["F", "D", "C", "B", "B+", "A"][
                                  Math.round(metrics.gradeNumericSeries[idx])
                                ];

                                let insight = "";
                                if (grade === "A")
                                  insight =
                                    "Exceptional Efficiency & Vehicle Safety";
                                else if (grade === "B+")
                                  insight =
                                    "Strong performance, very good efficiency";
                                else if (grade === "B")
                                  insight =
                                    "Good operation, minor current overheads";
                                else if (grade === "C")
                                  insight =
                                    "Average; check for excessive idling/ speed/ Drive mode usage";
                                else if (grade === "D")
                                  insight =
                                    "Sub-optimal; high energy consumption";
                                else insight = "Critical Faults Detected";

                                return { date, grade, score, insight };
                              })
                              .reverse() // Newest first
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
                                    <span
                                      // className={`badge ${
                                      //   row.grade === "A" || row.grade === "B+"
                                      //     ? "b-ok"
                                      //     : row.grade === "B" ||
                                      //         row.grade === "C"
                                      //       ? "b-d"
                                      //       : row.grade === "D"
                                      //         ? "b-c"
                                      //         : "b-a"
                                      // }`}
                                      style={{
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {row.grade}
                                    </span>
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
                                      color:
                                        row.grade === "A" ? p[500] : "inherit",
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
                          colors: [p[1300], p[1200], p[1400], p[1100]], // Updated colors per user request
                          xaxis: xCat(metrics.dates),
                          yaxis: yAx("Percentage (%)"),
                          plotOptions: {
                            bar: {
                              columnWidth: "60%",
                            },
                          },
                          legend: {
                            position: "top",
                            labels: { colors: fg },
                          },
                          tooltip: {
                            ...baseTooltip,
                            shared: true,
                            intersect: false,
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
                    {/* Charging KPIs & Diagnostic Summary */}
                    <Grid item xs={12} md={3}>
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
                        <Typography variant="overline" color={fg}>
                          BMS Health
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, color: p[500] }}
                        >
                          {metrics?.bmsFaultSeries?.reduce(
                            (a, b) => a + b,
                            0,
                          ) || 0}
                        </Typography>
                        <Typography variant="caption" color={fg}>
                          Total Charging Faults Detected
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <Box sx={{ ...cardSx, p: 2 }}>
                        <SectionHeader
                          title="Charging Performance Diagnostic"
                          sub="Heuristic-based session analysis"
                          tx={tx}
                        />
                        <Box
                          mt={1}
                          p={1.5}
                          bgcolor={
                            isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)"
                          }
                          borderRadius={2}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: tx, lineHeight: 1.6 }}
                          >
                            {(() => {
                              const avgDelta =
                                (metrics?.chargeSocSeries || []).reduce(
                                  (a, b) => a + b,
                                  0,
                                ) / (metrics?.chargeSocSeries?.length || 1);
                              const avgDur =
                                (metrics?.chargeDurationSeries || []).reduce(
                                  (a, b) => a + b,
                                  0,
                                ) /
                                (metrics?.chargeDurationSeries?.length || 1);
                              const maxT = Math.max(
                                0,
                                ...(metrics?.t1Series || []),
                                ...(metrics?.t2Series || []),
                                ...(metrics?.chargeMosSeries || []),
                              );
                              const faultCount = (
                                metrics?.bmsFaultSeries || []
                              ).reduce((a, b) => a + b, 0);

                              let summary = "Charging sessions were generally ";
                              if (avgDelta / (avgDur || 1) > 1.2)
                                summary += "high-speed and efficient. ";
                              else summary += "standard-rate. ";

                              if (maxT > 55)
                                summary +=
                                  "Caution: High thermal spikes observed during peaks. ";
                              else
                                summary +=
                                  "Thermal management remained stable. ";

                              if (faultCount > 0)
                                summary += `${faultCount} BMS alerts were intercepted; review the Session Table for details. `;
                              else
                                summary += "No BMS critical faults detected. ";

                              return summary;
                            })()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Row 1: SoC Range (Range Column) & Avg Current (Column) */}
                    <Grid item xs={12} md={6}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="SoC Lifecycle"
                          sub="Floating Range Chart (Start → End SOC)"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="rangeBar"
                          height={320}
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
                              labels: { style: { colors: fg } },
                            },
                            tooltip: {
                              ...baseTooltip,
                              custom: ({ dataPointIndex }) => {
                                const d =
                                  metrics?.chargeSocRangeSeries?.[
                                    dataPointIndex
                                  ];
                                const init = d?.y?.[0] ?? 0;
                                const final = d?.y?.[1] ?? 0;
                                return `<div style="padding:10px;background:#1e293b;color:#fff;border-radius:4px;">
                                  <strong>Date:</strong> ${d?.x || ""}<br/>
                                  <strong>Start SOC:</strong> ${init}%<br/>
                                  <strong>End SOC:</strong> ${final}%
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
                          title="Charging Intensity"
                          sub="Average Current (Amps)"
                          tx={tx}
                        />
                        <ReactApexChart
                          type="bar"
                          height={320}
                          series={[
                            {
                              name: "Charge Current",
                              data: metrics?.chargeCurrentSeries || [],
                            },
                          ]}
                          options={{
                            chart: { ...base, type: "bar" },
                            colors: [p[1100]],
                            plotOptions: {
                              bar: { borderRadius: 4, columnWidth: "50%" },
                            },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: yAx("Amps"),
                            tooltip: baseTooltip,
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Row 2: Duration Row Chart (Horizontal) */}
                    <Grid item xs={12}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Time Analysis (Row Chart)"
                          sub="Auto-scaled duration timeline"
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
                              formatter: (v) => `${v}m`,
                              style: { colors: ["#fff"], fontSize: "10px" },
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Row 3: Thermal Profile (Line Chart for MOS+T1-T4) */}
                    <Grid item xs={12}>
                      <Box sx={cardSx}>
                        <SectionHeader
                          title="Thermal Profile"
                          sub="MOS + T1, T2, T3, T4 Temperatures"
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
                            stroke: { width: 3, curve: "smooth" },
                            xaxis: xCat(metrics?.dates || []),
                            yaxis: yAx("Temperature (°C)"),
                            markers: { size: 4 },
                            legend: { position: "top", labels: { colors: fg } },
                            tooltip: { ...baseTooltip, shared: true },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* ── TAB 5: RAW DATA TABLE ────────────────────────────── */}
            <TabPanel value={activeTab} index={3}>
              <Box p={2}>
                <Box sx={{ ...cardSx, p: 0, overflow: "hidden" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p="0.5rem"
                    borderBottom={`0.5px solid ${isDark ? p[140] : p[400]}`}
                  >
                    <SectionHeader
                      title="Session Data Table"
                      sub={sortedRows.length + " records · sortable by column"}
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

                  <TableContainer sx={{ maxHeight: 400 }}>
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
                              <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                                <span
                                  className={`badge ${
                                    row.grade === "A" || row.grade === "B+"
                                      ? "b-ok"
                                      : row.grade === "B" || row.grade === "C"
                                        ? "b-d"
                                        : row.grade === "D"
                                          ? "b-c"
                                          : "b-a"
                                  }`}
                                >
                                  {row.grade}
                                </span>
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

                            {/* EXPANED VIEW */}
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
                                          <TableCell
                                            sx={{ color: fg, fontWeight: 500 }}
                                          >
                                            Session Time
                                          </TableCell>
                                          <TableCell
                                            sx={{ color: fg, fontWeight: 500 }}
                                          >
                                            Grade
                                          </TableCell>
                                          <TableCell
                                            sx={{ color: fg, fontWeight: 500 }}
                                          >
                                            Trip
                                          </TableCell>
                                          <TableCell
                                            sx={{ color: fg, fontWeight: 500 }}
                                          >
                                            Faults/Insights
                                          </TableCell>
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
                                              {row.date} [{s.start} - {s.end}] (
                                              {s.duration} mins)
                                            </TableCell>
                                            <TableCell>
                                              <span
                                                className={`badge ${s.grade === "A" || s.grade === "B+" ? "b-ok" : s.grade === "F" ? "b-a" : "b-d"}`}
                                              >
                                                {s.grade}
                                              </span>
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: 13,
                                                color: fg,
                                                fontWeight: 300,
                                              }}
                                            >
                                              {s.dist} km | {s.kwh} kWh
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: 12,
                                                color:
                                                  s.grade === "F" ||
                                                  s.faults?.length > 0
                                                    ? "error.main"
                                                    : fg,
                                                fontWeight: 300,
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
              </Box>
            </TabPanel>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomDateAnalytics;
