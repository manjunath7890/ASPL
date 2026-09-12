import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Tooltip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import SectionHeader from "../components/SectionHeader";
import { gradeColorMap } from "../utils/constants";
import { exportCSV } from "../utils/helpers";

export default function SessionTableTab({ metrics, themeOptions, isDark }) {
  const { fg, tx, p, cardSx, cardBg } = themeOptions;

  const [tableSort, setTableSort] = useState({ col: "date", dir: "desc" });
  const [expandedRow, setExpandedRow] = useState(null);

  const sortedRows = useMemo(() => {
    if (!metrics?.tableRows) return [];
    return [...metrics.tableRows].sort((a, b) => {
      let va = a[tableSort.col];
      let vb = b[tableSort.col];
      if (va == null) va = "";
      if (vb == null) vb = "";

      if (typeof va === "number" && typeof vb === "number") {
        return tableSort.dir === "asc" ? va - vb : vb - va;
      }
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

  return (
    <Box p={2}>
      {/* ── Summary Stats Bar ──────────────────────────────────── */}
      <Grid container spacing={2} mb={2}>
        {[
          {
            label: "Total Days",
            value: metrics.tableRows.length,
            alert: false,
          },
          {
            label: "Total Sessions",
            value: metrics.totalDriveSessions + metrics.totalChargeSessions,
            alert: false,
          },
          {
            label: "Charge Sessions",
            value: metrics.totalChargeSessions,
            alert: false,
          },
          {
            label: "Drive Sessions",
            value: metrics.totalDriveSessions,
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
                if (metrics.tableRows.some((r) => r.grade === g)) return g;
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
                  fontWeight: 600,
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

        <TableContainer
          sx={{
            maxHeight: 420,
            border: "none",
            boxShadow: "none",
            background: "transparent",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  { id: "date", label: "Date" },
                  { id: "driveSessions", label: "Drive Sessions" },
                  { id: "chargeSessions", label: "Charge Sessions" },
                  { id: "duration", label: "Drive Duration" },
                  { id: "chargeDuration", label: "Charge Duration" },
                  { id: "totalDistance", label: "Distance (km)" },
                  { id: "cycles", label: "Battery Cycles" },
                  { id: "grade", label: "Grade" },
                  { id: "batteryFault", label: "Battery Fault" },
                  { id: "controllerFault", label: "Controller Fault" },
                ].map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      fontWeight: 500,
                      fontSize: 13,
                      bgcolor: cardBg,
                      color: tx,
                      py: 1.5,
                      letterSpacing: "0.05em",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <TableSortLabel
                      active={tableSort.col === col.id}
                      direction={
                        tableSort.col === col.id ? tableSort.dir : "asc"
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
                      setExpandedRow(expandedRow === row.date ? null : row.date)
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
                        fontSize: 14,
                        fontWeight: 500,
                        padding: "12px 15px",
                      }}
                    >
                      {row.date}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.driveSessions}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.chargeSessions}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.duration}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.chargeDuration}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.totalDistance}
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
                          sx={{ fontSize: 10, height: 18, fontWeight: 300 }}
                        />
                      ) : (
                        <Chip
                          label={row.batteryFault}
                          size="small"
                          color="error"
                          sx={{ fontSize: 10, height: 18, fontWeight: 300 }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 300 }}>
                      {row.controllerFault === "None" ? (
                        <Chip
                          label="None"
                          size="small"
                          color="success"
                          sx={{ fontSize: 10, height: 18, fontWeight: 300 }}
                        />
                      ) : (
                        <Chip
                          label={row.controllerFault}
                          size="small"
                          color="warning"
                          sx={{ fontSize: 10, height: 18, fontWeight: 300 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedRow === row.date && row.sessions?.length > 0 && (
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
                            fontSize={16}
                          >
                            Drive Sessions Detail
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                {[
                                  "Type",
                                  "Session Time",
                                  "Actual Duration",
                                  "Grade",
                                  "Trip",
                                  "Energy",
                                  "Faults / Insights",
                                ].map((h) => (
                                  <TableCell
                                    key={h}
                                    sx={{
                                      color: fg,
                                      fontWeight: 400,
                                      fontSize: 14,
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
                                      fontWeight: 400,
                                      color: s.type === "Charge" ? p[1100] : fg, // assuming p[300] is a suitable color, otherwise just fg or primary
                                    }}
                                  >
                                    {s.type}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: 13,
                                      color: fg,
                                      fontWeight: 400,
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    {s.start} – {s.end}
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, fontWeight: 300 }}
                                    >
                                      {s.duration} mins
                                    </Typography>
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
                                    {s.dist} km
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: 13,
                                      color: fg,
                                      fontWeight: 300,
                                    }}
                                  >
                                    {s.kwh} kWh
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: 12,
                                      fontWeight: 300,
                                      color:
                                        s.grade === "F" || s.faults?.length > 0
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
    </Box>
  );
}
