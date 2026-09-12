import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import EvStationIcon from "@mui/icons-material/EvStation";
import StarIcon from "@mui/icons-material/Star";

import SectionHeader from "../components/SectionHeader";
import { xCat, yAx } from "../utils/constants";

export default function TemperatureTab({ metrics, themeOptions }) {
  const { fg, tx, p, cardSx, base, baseTooltip } = themeOptions;

  if (!metrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Typography color={fg}>Please click "Compute" to view Temperature analytics.</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
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
            warn: metrics.peakMotorTemp >= 65 && metrics.peakMotorTemp < 75,
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
            warn: metrics.peakCtrlTemp >= 65 && metrics.peakCtrlTemp < 75,
            icon: <BrightnessAutoIcon sx={{ fontSize: "1.4rem" }} />,
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
            warn: metrics.peakMosTemp >= 60 && metrics.peakMosTemp < 70,
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
              if (max < 55) return "All systems operating optimally";
              if (max < 65) return "Marginal headroom — watch trends";
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
              return m >= 55 && m < 75;
            })(),
            icon: <StarIcon sx={{ fontSize: "1.4rem" }} />,
          },
        ].map((kpi, i) => {
          const accentColor = kpi.ok
            ? "#11b856ff"
            : kpi.warn
              ? "#E67E22"
              : "#E74C3C";
          return (
            <Grid item xs={6} sm={3} key={i}>
              <Box sx={{ ...cardSx, p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography
                    variant="caption"
                    color={fg}
                    sx={{
                      fontWeight: 400,
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {kpi.label}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, color: tx, lineHeight: 1.1, mb: 0.3 }}
                >
                  {kpi.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: accentColor,
                    fontSize: "0.68rem",
                    lineHeight: 1.3,
                    fontWeight: 400,
                  }}
                >
                  {kpi.sub}
                </Typography>
              </Box>
            </Grid>
          );
        })}

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
                { name: "Motor Temp Max", data: metrics.mtrMaxSeries },
                { name: "Controller Temp Max", data: metrics.ctrlMaxSeries },
                { name: "MOSFET Temp Max", data: metrics.mosMaxSeries },
              ]}
              options={{
                chart: { ...base, type: "line" },
                colors: [p[1100], p[1200], p[1500]],
                stroke: { width: [3, 3, 2], curve: "smooth" },
                xaxis: xCat(metrics.dates, fg),
                yaxis: { ...yAx("Temperature (°C)", fg), max: 150 },
                annotations: {
                  yaxis: [
                    {
                      y: 120,
                      borderColor: "#E74C3C",
                      strokeDashArray: 4,
                      label: {
                        text: "Critical (120°C)",
                        style: { color: "#fff", background: "#E74C3C", fontSize: "10px" },
                      },
                    },
                    {
                      y: 50,
                      borderColor: "#E67E22",
                      strokeDashArray: 3,
                      label: {
                        text: "Warning (50°C)",
                        style: { color: "#fff", background: "#E67E22", fontSize: "10px" },
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
              title="Average Temperature"
              sub="Daily average temperature of motor, battery and controller"
              tx={tx}
            />
            <ReactApexChart
              type="bar"
              height={300}
              series={[
                { name: "Avg Controller °C", data: metrics.ctrlAvgSeries },
                { name: "Avg Motor °C", data: metrics.mtrAvgSeries },
                { name: "MOSFET Max °C", data: metrics.mosMaxSeries },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                colors: [p[1300], p[1400], p[1500]],
                plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
                xaxis: xCat(metrics.dates, fg),
                yaxis: { ...yAx("Temperature (°C)", fg), max: 90 },
                annotations: {
                  yaxis: [
                    {
                      y: 55,
                      borderColor: "#E67E22",
                      strokeDashArray: 3,
                      label: {
                        text: "Warning (55°C)",
                        style: { color: "#fff", background: "#E67E22", fontSize: "10px" },
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
      </Grid>
    </Box>
  );
}
