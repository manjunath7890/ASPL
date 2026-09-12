import React from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ReactApexChart from "react-apexcharts";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import SectionHeader from "../components/SectionHeader";
import { getBaseChartOptions, xCat, yAx } from "../utils/constants";
import { gradeColorMap } from "../utils/helpers"; // Fallback to tx if undefined

export default function HealthTab({ sohData, themeOptions, isDark }) {
  const { fg, tx, p, cardSx, base, baseTooltip } = themeOptions;

  if (!sohData || sohData.error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <Typography color={fg}>Nothing to show for now.</Typography>
      </Box>
    );
  }

  const { summary, history, skippedSessions } = sohData;

  // Derive top KPIs
  const currentSOH =
    sohData.currentSOH !== undefined ? `${sohData.currentSOH}%` : "—";
  const ratedAh = sohData.ratedCapacityAh
    ? `${sohData.ratedCapacityAh} Ah`
    : "—";
  const lossAh =
    summary?.practicalAhRange?.lossAh !== undefined
      ? `${summary.practicalAhRange.lossAh} Ah`
      : "—";

  // Clean degradation text (could be "Insufficient cycle data")
  const degPerCycle = summary?.degradationPerCycle || "—";
  const validRatio = `${summary?.validSessions ?? 0} valid / ${summary?.skippedSessions ?? 0} skip`;

  // Chart Series extraction
  const dates = (history || []).map((h) => h.date);
  const sohSeries = (history || []).map((h) => h.soh);
  const cycleSeries = (history || []).map((h) => h.cycleCount);

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* ── ROW 0: KPI MINI-CARDS ─────────────────────────── */}
        {[
          {
            label: "Current SOH",
            value: currentSOH,
            sub: `Grade: ${sohData.currentGrade || "—"}`,
            icon: <BatteryChargingFullIcon sx={{ fontSize: "1.5rem" }} />,
            accent:
              sohData.currentSOH >= 90
                ? "#2ECC71"
                : sohData.currentSOH >= 80
                  ? "#F1C40F"
                  : "#E74C3C",
          },
          {
            label: "Rated Capacity",
            value: ratedAh,
            sub: `Original factory spec`,
            icon: <SettingsBackupRestoreIcon sx={{ fontSize: "1.5rem" }} />,
            accent: p[500],
          },
          {
            label: "Evaluated Sessions",
            value: summary?.validSessions || 0,
            sub: validRatio,
            icon: <FactCheckIcon sx={{ fontSize: "1.5rem" }} />,
            accent: summary?.skippedSessions > 5 ? "#E67E22" : "#2ECC71",
          },
          {
            label: "Degradation Rate",
            value:
              typeof degPerCycle === "number"
                ? `${degPerCycle.toFixed(4)} Ah/cycle`
                : "—",
            sub:
              typeof degPerCycle === "string"
                ? degPerCycle
                : "Ah lost per cycle",
            icon: <BatteryAlertIcon sx={{ fontSize: "1.5rem" }} />,
            accent: p[1500],
          },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
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

        {/* ── ROW 1: SOH TREND CHART ─────────────────────────── */}
        <Grid item xs={12} md={7}>
          <Box sx={{ ...cardSx, p: "0.5rem" }}>
            <SectionHeader
              title="State of Health (SOH) Trend"
              sub="Battery SOH % evaluated over valid historical cycles"
              tx={tx}
            />
            {history && history.length > 0 ? (
              <ReactApexChart
                type="line"
                height={320}
                series={[
                  { name: "SOH (%)", type: "line", data: sohSeries },
                  { name: "Cycles", type: "line", data: cycleSeries },
                ]}
                options={{
                  chart: { ...base, type: "line" },
                  colors: [p[500], p[1400]],
                  dataLabels: { enabled: true },
                  stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 6] },
                  xaxis: xCat(dates, fg),
                  yaxis: [
                    {
                      min: 50,
                      max: 100,
                      title: {
                        text: "State of Health (%)",
                        style: { color: fg, fontWeight: 400 },
                      },
                      labels: {
                        style: { colors: fg },
                        formatter: (v) => `${v}`,
                      },
                    },
                    {
                      opposite: true,
                      title: {
                        text: "Cycle Count",
                        style: { color: fg, fontWeight: 400 },
                      },
                      labels: {
                        style: { colors: fg },
                        formatter: (v) => `${v}`,
                      },
                    },
                  ],
                  tooltip: {
                    ...baseTooltip,
                    shared: true,
                    intersect: false,
                  },
                }}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={320}
              >
                <Typography color={fg}>
                  Not enough historical valid data to plot SOH.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── ROW 1: SKIPPED SESSIONS SUMMARY ─────────────────────────── */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              ...cardSx,
              p: "0.5rem",
              height: "100%",
              maxHeight: "400px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SectionHeader
              title="Skipped Charge Sessions"
              sub="Sessions excluded from SOH calculation due to data integrity limits"
              tx={tx}
            />
            <Box sx={{ overflowY: "auto", flex: 1, pr: 1, mt: 1 }}>
              {skippedSessions && skippedSessions.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: tx,
                          fontWeight: 600,
                          fontSize: 12,
                          borderBottom: `1px solid rgba(255,255,255,0.05)`,
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          color: tx,
                          fontWeight: 600,
                          fontSize: 12,
                          borderBottom: `1px solid rgba(255,255,255,0.05)`,
                        }}
                      >
                        Reason for Exclusion
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skippedSessions.map((skip, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ color: fg, fontSize: 12, py: 1.5 }}>
                          {skip.date}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: fg,
                            fontSize: 12,
                            py: 1.5,
                            opacity: 0.85,
                          }}
                        >
                          {skip.reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Typography color={fg} fontSize={13}>
                    No sessions were skipped.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
