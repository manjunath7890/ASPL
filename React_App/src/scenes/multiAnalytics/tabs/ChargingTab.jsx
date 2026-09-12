import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import EvStationIcon from "@mui/icons-material/EvStation";
import SpeedIcon from "@mui/icons-material/Speed";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import SectionHeader from "../components/SectionHeader";
import { xCat, yAx } from "../utils/constants";

export default function ChargingTab({ metrics, themeOptions, isDark }) {
  const { fg, tx, p, cardSx, base, baseTooltip } = themeOptions;

  if (!metrics) {
    return (
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
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* ── ROW 0: 5 CHARGING KPI MINI-CARDS ─────────────────────────── */}
        {[
          {
            label: "Energy Charged",
            value: `${metrics.totalChargeKwh} kWh`,
            sub: `${metrics.totalChargeSessions} charging sessions`,
            icon: <EvStationIcon sx={{ fontSize: "1.5rem" }} />,
            accent: p[100],
          },
          {
            label: "Avg Session Duration",
            value: `${metrics.avgChargeDuration} min`,
            sub: `≈ ${(metrics.avgChargeDuration / 60).toFixed(1)} hours per session`,
            icon: <SpeedIcon sx={{ fontSize: "1.5rem" }} />,
            accent: p[1100],
          },
          {
            label: "Avg Capacity-Rate",
            sub:
              metrics.avgCRate > 0
                ? `Capacity/${Math.round(1 / metrics.avgCRate)}`
                : "—",
            value:
              metrics.avgCRate > 0
                ? `${(metrics.avgCRate * 100).toFixed(2)}% / hr`
                : "No data",
            icon: <BrightnessAutoIcon sx={{ fontSize: "1.5rem" }} />,
            accent: p[1500],
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
            accent: metrics.totalChargeFaults === 0 ? "#2ECC71" : "#E74C3C",
          },
        ].map((kpi, i) => (
          <Grid item xs={6} sm={4} md={2.4} key={i}>
            <Box sx={{ ...cardSx, p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography
                  variant="caption"
                  color={fg}
                  sx={{ fontWeight: 400, fontSize: "0.75rem", lineHeight: 1.2 }}
                >
                  {kpi.label}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: tx, lineHeight: 1.2, mb: 0.3 }}
              >
                {kpi.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: kpi.accent, fontSize: "0.78rem", fontWeight: 400 }}
              >
                {kpi.sub}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* ── ROW 1: AVG CHARGING CURRENT ────────────── */}
        <Grid item xs={12} md={4}>
          <Box sx={{ ...cardSx, p: "0.5rem", height: "100%" }}>
            <SectionHeader
              title="Avg Charging Current"
              sub="Average current drawn per session"
              tx={tx}
            />
            <ReactApexChart
              type="bar"
              height={280}
              series={[
                {
                  name: "Current (A)",
                  data: metrics?.chargeCurrentSeries || [],
                },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                plotOptions: {
                  bar: { borderRadius: 3, columnWidth: "55%" },
                },
                colors: [p[1100]],
                xaxis: xCat(metrics?.dates || [], fg),
                yaxis: {
                  title: {
                    text: "Avg Current (A)",
                    style: { color: fg, fontWeight: 400 },
                  },
                  labels: { style: { colors: fg }, formatter: (v) => `${v}A` },
                },
                dataLabels: { enabled: false },
                tooltip: {
                  ...baseTooltip,
                  y: { formatter: (v) => `${v} A` },
                },
              }}
            />
          </Box>
        </Grid>

        {/* ── ROW 2: SoC LIFECYCLE ───────────────────── */}
        <Grid item xs={12} md={4}>
          <Box sx={{ ...cardSx, p: "0.5rem" }}>
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
                xaxis: xCat(metrics?.dates || [], fg),
                yaxis: {
                  min: 0,
                  max: 100,
                  title: {
                    text: "SoC %",
                    style: { color: fg, fontWeight: 400 },
                  },
                  labels: { style: { colors: fg }, formatter: (v) => `${v}%` },
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
                    const d = metrics?.chargeSocRangeSeries?.[dataPointIndex];
                    const gained = (d?.y?.[1] ?? 0) - (d?.y?.[0] ?? 0);
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

        {/* ── ROW 3: BATTERY CYCLES ────────── */}
        <Grid item xs={12} md={4}>
          <Box sx={{ ...cardSx, p: "0.5rem" }}>
            <SectionHeader
              title="Battery Cycles"
              sub="Cycle count progression recorded over time"
              tx={tx}
            />
            <ReactApexChart
              type="bar"
              height={280}
              series={[
                {
                  name: "Cycles",
                  data: metrics?.cyclesSeries || [],
                },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                plotOptions: {
                  bar: { borderRadius: 3, columnWidth: "55%" },
                },
                colors: [p[1700]],
                xaxis: xCat(metrics?.dates || [], fg),
                yaxis: {
                  title: {
                    text: "Cycle Count",
                    style: { color: fg, fontWeight: 400 },
                  },
                  labels: {
                    style: { colors: fg },
                  },
                },
                dataLabels: { enabled: false },
                tooltip: {
                  ...baseTooltip,
                },
              }}
            />
          </Box>
        </Grid>

        {/* ── ROW 4: DURATION TIMELINE ───────────────── */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...cardSx, p: "0.5rem" }}>
            <SectionHeader
              title="Session Duration Timeline"
              sub="Total time spent charging per day — auto-scaled"
              tx={tx}
            />
            <ReactApexChart
              type="bar"
              height={320}
              series={[
                {
                  name: "Duration (mins)",
                  data: metrics?.chargeDurationSeries || [],
                },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                plotOptions: {
                  bar: { horizontal: true, borderRadius: 3, barHeight: "60%" },
                },
                colors: [p[1300]],
                xaxis: {
                  ...xCat(metrics?.dates || [], fg),
                  title: {
                    text: "Minutes",
                    style: { color: fg, fontWeight: 400 },
                  },
                },
                yaxis: { labels: { show: true, style: { colors: fg } } },
                dataLabels: {
                  enabled: false,
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
                      return h > 0 ? `${h} hrs ${m} mins` : `${v} mins`;
                    },
                  },
                },
              }}
            />
          </Box>
        </Grid>

        {/* ── ROW 5: THERMAL PROFILE ─────── */}
        <Grid item xs={12} md={6}>
          <Box sx={{ ...cardSx, p: "0.5rem" }}>
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
                { name: "T1 (Battery)", data: metrics?.t1Series || [] },
                { name: "T2 (Battery)", data: metrics?.t2Series || [] },
                { name: "T3 (Battery)", data: metrics?.t3Series || [] },
                { name: "T4 (Battery)", data: metrics?.t4Series || [] },
              ]}
              options={{
                chart: { ...base, type: "line" },
                colors: [p[1100], p[1200], p[1300], p[1700], p[1500]],
                stroke: { width: [3, 2, 2, 2, 2], curve: "smooth" },
                xaxis: xCat(metrics?.dates || [], fg),
                yaxis: {
                  ...yAx("Temperature (°C)", fg),
                  max: 60,
                  labels: { style: { colors: fg }, formatter: (v) => `${v}°C` },
                },
                markers: { size: 4 },
                legend: { position: "top", labels: { colors: fg } },
                annotations: {
                  yaxis: [
                    {
                      y: 55,
                      borderColor: "#E74C3C",
                      borderWidth: 1.5,
                      strokeDashArray: 4,
                      label: {
                        text: "Warning Threshold (60°C)",
                        style: {
                          color: "#fff",
                          background: "#E74C3C",
                          fontSize: "10px",
                          padding: { left: 6, right: 6, top: 2, bottom: 2 },
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
                          padding: { left: 4, right: 4, top: 2, bottom: 2 },
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
    </Box>
  );
}
