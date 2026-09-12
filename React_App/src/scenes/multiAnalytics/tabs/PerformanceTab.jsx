import React from "react";
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";

import SectionHeader from "../components/SectionHeader";
import { xCat, yAx, gradeColorMap } from "../utils/constants";

export default function PerformanceTab({ metrics, themeOptions, isDark }) {
  const { fg, tx, p, cardSx, base, baseTooltip } = themeOptions;

  return (
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
                { name: "Avg Speed (km/h)", data: metrics.spdAvgSeries },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                colors: [p[1100], p[1200], p[1300]],
                plotOptions: { bar: { borderRadius: 3, columnWidth: "65%" } },
                xaxis: xCat(metrics.dates, fg),
                yaxis: yAx("Value (km, km/h, Wh)", fg),
                dataLabels: { enabled: false },
                legend: { labels: { colors: fg } },
                tooltip: { ...baseTooltip, shared: true, intersect: false },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={[cardSx, { p: "0.5rem" }]}>
            <SectionHeader
              title="Energy Consumption"
              sub="Daily kWh & SOC consumed"
              tx={tx}
            />
            <ReactApexChart
              type="bar"
              height={320}
              series={[
                { name: "SOC Consumed", data: metrics.soc },
                { name: "kWh Consumed", data: metrics.kwhSeries },
              ]}
              options={{
                chart: { ...base, type: "bar" },
                colors: [p[1500], p[1700]],
                plotOptions: { bar: { borderRadius: 3, columnWidth: "50%" } },
                xaxis: xCat(metrics.dates, fg),
                yaxis: [
                  {
                    title: { text: "SOC (%)", style: { fontWeight: "500", color: fg } },
                    labels: { style: { colors: fg } },
                    min: 0,
                    max: 100,
                  },
                  {
                    opposite: true,
                    title: { text: "kWh", style: { fontWeight: "500", color: fg } },
                    labels: { style: { colors: fg } },
                    min: 0,
                    max: 13,
                  },
                ],
                dataLabels: { enabled: false },
                tooltip: { ...baseTooltip, shared: true, intersect: false },
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
                bgcolor: isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.03)",
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Date", "Grade", "Percentage", "Performance Insight"].map((h) => (
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
                          ? "Excellent efficiency; optimal thermals & SOC"
                          : grade === "B+"
                            ? "Strong performance; slight efficiency/heat overhead"
                            : grade === "B"
                              ? "Good operation; moderate SOC or thermal peaks"
                              : grade === "C"
                                ? "Average; check Heat / Eco Mode / SOC levels"
                                : grade === "D"
                                  ? "Sub-optimal; high Wh/km or low battery levels"
                                  : "Critical Faults or severe Battery/Thermal issues";
                      return { date, grade, score, insight };
                    })
                    .reverse()
                    .map((row, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ color: fg, fontSize: "0.9rem", whiteSpace: "nowrap", fontWeight: 300 }}>
                          {row.date}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: gradeColorMap[row.grade] }}>
                            {row.grade}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: fg, fontSize: "0.9rem", fontWeight: 300 }}>
                          {row.score}%
                        </TableCell>
                        <TableCell sx={{ color: row.grade === "A" ? "#2ECC71" : fg, fontSize: "0.9rem", whiteSpace: "nowrap", fontWeight: 300 }}>
                          {row.insight}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Grid>

        {/* ── Row 7: Performance Grade Trend ───────────────────── */}
        <Grid item xs={12} md={6}>
          <Box sx={[cardSx, { p: "0.5rem" }]}>
            <SectionHeader
              title="Performance Grade Trend"
              sub="Daily score (0–100) over the selected period"
              tx={tx}
            />
            <ReactApexChart
              type="area"
              height={295}
              series={[{ name: "Score", data: metrics.gradePctSeries }]}
              options={{
                chart: { ...base, type: "area" },
                colors: [p[500]],
                stroke: { width: 3, curve: "smooth" },
                fill: {
                  type: "gradient",
                  gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
                },
                xaxis: xCat(metrics.dates, fg),
                yaxis: { ...yAx("Score (0–100)", fg), min: 0, max: 100 },
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
                      label: { text: "Grade B+ threshold", style: { color: "#fff", background: "#2ECC71", fontSize: "10px" } },
                    },
                    {
                      y: 60,
                      borderColor: "#E67E22",
                      strokeDashArray: 3,
                      label: { text: "Grade C threshold", style: { color: "#fff", background: "#E67E22", fontSize: "10px" } },
                    },
                  ],
                },
                tooltip: {
                  ...baseTooltip,
                  y: {
                    formatter: (v) => {
                      const g =
                        v >= 90 ? "A" : v >= 80 ? "B+" : v >= 70 ? "B" : v >= 60 ? "C" : v >= 40 ? "D" : "F";
                      return `${v} pts — Grade ${g}`;
                    },
                  },
                },
              }}
            />
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
              height={235}
              series={metrics.modeStackData}
              options={{
                chart: { ...base, type: "bar", stacked: true, stackType: "100%" },
                colors: [p[1300], p[1200], p[1400], p[1100]],
                xaxis: xCat(metrics.dates, fg),
                yaxis: yAx("Percentage (%)", fg),
                plotOptions: { bar: { columnWidth: "60%" } },
                dataLabels: {
                  enabled: false,
                  style: { colors: ["#000"], fontWeight: "500", fontSize: "0.8rem" },
                  formatter: (val, opts) => {
                    const mins = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
                    return mins > 0 ? mins + " m" : "";
                  },
                },
                legend: { position: "top", labels: { colors: fg } },
                tooltip: {
                  ...baseTooltip,
                  shared: true,
                  intersect: false,
                  y: { formatter: (v) => (v > 0 ? v + " mins" : "0 mins") },
                },
              }}
            />
          </Box>
        </Grid>

        {/* ── Row 6: Gear Stack Over Time ───────────────────────── */}
        {metrics.gearStackData.some((s) => s.data.some((v) => v > 0)) && (
          <Grid item xs={12} md={6}>
            <Box sx={[cardSx, { p: "0.5rem" }]}>
              <SectionHeader
                title="Daily Gear Usage Pattern"
                sub="Gear 1 vs Gear 2 — 100% stacked distribution over time"
                tx={tx}
              />
              <ReactApexChart
                type="bar"
                height={250}
                series={metrics.gearStackData}
                options={{
                  chart: { ...base, type: "bar", stacked: true, stackType: "100%" },
                  colors: [p[500], p[1100]],
                  xaxis: xCat(metrics.dates, fg),
                  yaxis: yAx("Percentage (%)", fg),
                  plotOptions: { bar: { columnWidth: "60%" } },
                  dataLabels: {
                    enabled: false,
                    style: { colors: ["#000"], fontWeight: "700", fontSize: "0.75rem" },
                    formatter: (val, opts) => {
                      const mins = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
                      return mins > 0 ? mins + " m" : "";
                    },
                  },
                  legend: { position: "top", labels: { colors: fg } },
                  tooltip: {
                    ...baseTooltip,
                    shared: true,
                    intersect: false,
                    y: { formatter: (v) => (v > 0 ? v + " mins" : "0 mins") },
                  },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
