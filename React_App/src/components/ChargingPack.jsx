import React from "react";
import { Box, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../theme";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

/* ─── SOC progress bar ─── */
const SocBar = ({ from, to, accentColor }) => {
  const fill = Math.max(0, Math.min(100, to - from));
  return (
    <Box sx={{
      position: "relative", height: "3px", borderRadius: "2px",
      background: "rgba(128,128,128,0.15)", overflow: "hidden", mt: "6px",
    }}>
      <Box sx={{
        position: "absolute",
        left: `${from}%`,
        width: `${fill}%`,
        height: "100%",
        background: accentColor,
        borderRadius: "2px",
        transition: "width 0.4s ease",
      }} />
    </Box>
  );
};

/* ─── Temperature chip — color coded by heat ─── */
const TempChip = ({ label, value, colors }) => {
  const accent =
    value >= 50 ? colors.palette[1400]   // red
      : value >= 40 ? colors.palette[1300] // amber
        : colors.palette[500];               // teal (normal)

  return (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center",
      background: colors.palette[300],
      border: `1px solid ${colors.palette[400]}`,
      borderRadius: "8px", py: "8px", px: "4px",
      transition: "border-color .2s",
      "&:hover": { borderColor: accent },
    }}>
      <Typography sx={{
        fontSize: "1.2rem", fontWeight: 700,
        color: accent, lineHeight: 1,
      }}>
        {value}°C
      </Typography>
      <Typography sx={{
        fontSize: "0.8rem",
        color: colors.palette[150],
        mt: "4px",
      }}>
        {label}
      </Typography>
    </Box>
  );
};

/* ─── Energy metric card ─── */
const EnergyCard = ({ label, value, unit, accentHex, textSoft }) => (
  <Box sx={{
    borderRadius: "10px", p: "12px",
    // background: `${accentHex}10`,
    // border: `1px solid ${accentHex}88`,
    boxShadow: `0px 5px 14px 3px ${textSoft}22`
  }}>
    <Typography sx={{
      fontSize: "0.8rem", color: textSoft,
      textTransform: "uppercase", mb: "4px",
    }}>
      {label}
    </Typography>
    <Typography sx={{
      fontSize: "1.5rem", fontWeight: 700,
      color: accentHex, lineHeight: 1,
    }}>
      {value}
      <span style={{ fontSize: "1rem", fontWeight: 400, color: accentHex, marginLeft: "4px" }}>{unit}</span>
    </Typography>
  </Box>
);

/* ─── Thin section divider ─── */
const Divider = ({ borderColor }) => (
  <Box sx={{ height: "1px", background: borderColor, opacity: 0.4 }} />
);

/* ═══════════════════════════════════════════ */

const SohCard = ({ sohData = null, loadingSoh = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const surface = colors.palette[300];
  const bgBase = colors.palette[130];
  const border = colors.palette[900];
  const shadow = colors.palette[200];
  const muted = colors.palette[700];
  const accent = colors.palette[500];

  const hasData = sohData && !sohData.error && sohData.currentSOH !== undefined;
  const errorMsg = sohData?.error || "Data unavailable";

  return (
    <Box sx={{
      width: "100%", height: "100%", minHeight: "24.3rem",
      background: isDark
        ? `linear-gradient(155deg, ${bgBase} 0%, ${surface} 100%)`
        : colors.palette[110],
      border: `1px solid ${border}`,
      borderRadius: "16px",
      p: "16px",
      display: "flex", flexDirection: "column",
      boxShadow: shadow,
      fontFamily: "'Kanit', sans-serif",
    }}>
      {/* ── HEADER ── */}
      <Box sx={{
        px: "4px", py: "10px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${border}`, mb: "24px"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <EnergySavingsLeafIcon sx={{ color: accent }} />
          <Typography sx={{
            fontSize: "0.85rem", color: colors.palette[100],
            letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700,
          }}>
            State of Health (SOH)
          </Typography>
        </Box>
      </Box>

      {/* ── BODY ── */}
      <Box display="flex" flexDirection="column" gap={3} flex={1}>
        <Box sx={{ flex: 1 }} />
        <Box sx={{
          borderRadius: "12px", p: "16px",
          background: `${accent}0A`,
          border: `1px solid ${accent}28`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "150px"
        }}>
          <Typography sx={{
            fontSize: "0.65rem", color: muted,
            textTransform: "uppercase", letterSpacing: "0.1em", mb: "8px", fontWeight: 600
          }}>
            Evaluated SOH
          </Typography>
          {loadingSoh ? (
             <Typography sx={{ color: muted, mt: "10px", fontWeight: 500 }}>Fetching Data...</Typography>
          ) : hasData ? (
            <Typography sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "3.5rem", fontWeight: 800,
              color: accent, lineHeight: 1,
              letterSpacing: "-0.03em"
            }}>
              {sohData.currentSOH}<span style={{ fontSize: "1.5rem", fontWeight: 600 }}>%</span>
            </Typography>
          ) : (
             <Typography sx={{ color: colors.palette[1400] || "red", mt: "10px", fontSize: "0.8rem", textAlign: "center", fontStyle: "italic", lineHeight: 1.3 }}>
               {errorMsg}
             </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1 }} />
      </Box>
    </Box>
  );
};


const CellPackMetrics = ({
  initSoc, finalSoc, fault, mosTemp, ahConsumed,
  temp1, temp2, temp3, temp4,
  timeMax, timeMin, timeMinutes, avgCurrent,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const safe = (v) => (v === null || v === undefined || isNaN(v) ? 0 : v);

  const _initSoc = safe(initSoc);
  const _finalSoc = safe(finalSoc);
  const _avgCurrent = safe(avgCurrent);
  const _ahConsumed = safe(ahConsumed);
  const _mosTemp = safe(mosTemp);
  const _temp1 = safe(temp1);
  const _temp2 = safe(temp2);
  const _temp3 = safe(temp3);
  const _temp4 = safe(temp4);

  const socDelta = _finalSoc - _initSoc;
  let hasFault = false;
  hasFault = fault && fault !== "0";

  // ── Semantic aliases from theme tokens ──
  const accent = colors.palette[500];
  const accentSoft = colors.palette[510];
  const blue = colors.palette[1100];
  const red = colors.palette[1400];
  const faultBg = colors.palette[1450];
  const muted = colors.palette[150];
  const textSoft = colors.palette[700];
  const border = colors.palette[900];
  const surface = colors.palette[300];
  const bgBase = colors.palette[130];
  const shadow = colors.palette[200];
  const shadowSm = colors.palette[210];
  const badgeBg = colors.palette[1150];

  return (
    <Box sx={{
      width: "100%",
      // height: "24.3rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: surface,
      borderRadius: "16px",
      overflow: "hidden",
      fontFamily: "'Kanit', sans-serif",
      boxShadow: shadow,
    }}>
      {/* ── HEADER ── */}
      <Box sx={{
        px: "16px", py: "10px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${border}`,
        // background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box sx={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 7px ${accent}`,
          }} />
          <Typography sx={{
            fontSize: "1.2rem", color: muted, fontWeight: 600,
          }}>
            Cell Pack
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Box sx={{
            border: `1px solid ${border}`,
            borderRadius: "5px", px: "8px", py: "3px",
          }}>
            <Typography sx={{
              fontSize: "0.9rem", color: muted, fontWeight: 400, textTransform: "uppercase",
            }}>
              {timeMin || "00:00"} – {timeMax || "00:00"}
            </Typography>
          </Box>
          <Box sx={{
            background: badgeBg,
            border: `1px solid ${accent}40`,
            borderRadius: "5px", px: "8px", py: "2px",
          }}>
            <Typography sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.95rem", color: accent, fontWeight: 700,
            }}>
              {safe(timeMinutes)} min
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── BODY ── */}
      <Box sx={{ p: "16px", display: "flex", flexDirection: "column", gap: "13px" }}>

        {/* ── SOC HERO ── */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{
              fontSize: "3.5rem", fontWeight: 800, lineHeight: 1,
              color: accent, letterSpacing: "0.02em",
            }}>
              +{socDelta}
              <span style={{ fontSize: "1.6rem", color: accentSoft }}>%</span>
            </Typography>
            <Typography sx={{
              fontSize: "0.8rem", color: muted, mt: "4px",
            }}>
              SOC Gained
            </Typography>
            <SocBar from={_initSoc} to={_finalSoc} accentColor={accent} />
            <Typography sx={{
              fontSize: "0.9rem", color: muted, mt: "5px",
            }}>
              {_initSoc}% → {_finalSoc}%
            </Typography>
          </Box>
        </Box>

        <Divider borderColor={border} />

        {/* ── ENERGY CARDS ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <EnergyCard
            label="Total AH"
            value={_ahConsumed.toFixed(2)}
            unit="AH"
            accentHex={blue}
            textSoft={muted}
          />
          <EnergyCard
            label="Average Current"
            value={_avgCurrent.toFixed(2)}
            unit="A"
            accentHex={accent}
            textSoft={muted}
          />
          <EnergyCard
            label="Energy Used"
            value={((_ahConsumed * 73.6) / 700).toFixed(2)}
            unit="kWh"
            accentHex={blue}
            textSoft={muted}
          />
        </Box>

        <Divider borderColor={border} />

        {/* ── TEMPERATURES ── */}
        <Box>
          <Typography sx={{
            fontSize: "1rem", color: muted,
            mb: "10px", fontWeight: 500,
          }}>
            Temperatures
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "7px" }}>
            <TempChip label="MOSFET" value={_mosTemp} colors={colors} />
            <TempChip label="Charger" value={_temp1} colors={colors} />
            <TempChip label="Temp 1" value={_temp1} colors={colors} />
            <TempChip label="Temp 2" value={_temp2} colors={colors} />
            <TempChip label="Temp 3" value={_temp3} colors={colors} />
            <TempChip label="Temp 4" value={_temp4} colors={colors} />
          </Box>
        </Box>

        {/* ── BMS FAULT ── */}
        <Box sx={{
          borderRadius: "10px", p: "11px 12px",
          display: "flex", alignItems: "flex-start", gap: "10px",
          background: surface,
          border: `1px solid ${border}`,
          boxShadow: shadowSm,
        }}>
          <Box>
            <Typography sx={{
              fontSize: "0.9rem",
              color: muted, mb: "3px",
            }}>
              BMS Fault code
            </Typography>
            <Typography sx={{
              fontSize: "1.1rem",
              color: hasFault ? red : muted,
              wordBreak: "break-word",
              opacity: hasFault ? 1 : 0.65,
            }}>
              {fault || "No active faults"}
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

const CellPack = (props) => {
  const showSoh = props.role !== "customer";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={showSoh ? 8 : 12}>
        <CellPackMetrics {...props} />
      </Grid>
      {showSoh && (
        <Grid item xs={12} md={4}>
          <SohCard sohData={props.sohData} loadingSoh={props.loadingSoh} />
        </Grid>
      )}
    </Grid>
  );
};

export default CellPack;
