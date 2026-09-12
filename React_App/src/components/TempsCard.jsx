import { Box, LinearProgress, useTheme } from "@mui/material";
import { tokens } from "../theme";

const TempsCard = ({ motor = 0, controller = 0, mos = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const surfaceBorder =
    theme.palette.mode === "dark"
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)";
  const surfaceShadow =
    theme.palette.mode === "dark"
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)";

  const tempBar = (value, max) =>
    Math.max(0, Math.min(100, (Number(value) / max) * 100));

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box
        padding="0.7rem 0.9rem"
        borderRadius="0.8rem"
        border={surfaceBorder}
        boxShadow={surfaceShadow}
        background={colors.palette[1150]}
      >
        <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
          MOTOR TEMPERATURE
        </Box>
        <Box fontSize="1.5rem" fontWeight={700} color={colors.palette[100]}>
          {motor} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>°C</span>
        </Box>
        <LinearProgress
          variant="determinate"
          value={tempBar(motor, 140)}
          sx={{
            height: "0.35rem",
            borderRadius: "999px",
            backgroundColor: colors.palette[900],
            mt: "0.4rem",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              backgroundColor: Number(motor) >= 120 ? colors.palette[1400] : colors.palette[500],
            },
          }}
        />
      </Box>

      <Box
        padding="0.7rem 0.9rem"
        borderRadius="0.8rem"
        border={surfaceBorder}
        boxShadow={surfaceShadow}
        background={colors.palette[1150]}
      >
        <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
          CONTROLLER TEMPERATURE
        </Box>
        <Box fontSize="1.5rem" fontWeight={700} color={colors.palette[100]}>
          {controller} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>°C</span>
        </Box>
        <LinearProgress
          variant="determinate"
          value={tempBar(controller, 65)}
          sx={{
            height: "0.35rem",
            borderRadius: "999px",
            backgroundColor: colors.palette[900],
            mt: "0.4rem",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              backgroundColor: Number(controller) >= 50 ? colors.palette[1400] : colors.palette[500],
            },
          }}
        />
      </Box>

      <Box
        padding="0.7rem 0.9rem"
        borderRadius="0.8rem"
        border={surfaceBorder}
        boxShadow={surfaceShadow}
      >
        <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
          BATTERY MOSFET TEMPERATURE
        </Box>
        <Box fontSize="1.5rem" fontWeight={800} color={colors.palette[100]}>
          {mos} <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.palette[150] }}>°C</span>
        </Box>
        <LinearProgress
          variant="determinate"
          value={tempBar(mos, 55)}
          sx={{
            height: "0.4rem",
            borderRadius: "999px",
            backgroundColor: colors.palette[900],
            mt: "0.4rem",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              backgroundColor: Number(mos) >= 45 ? colors.palette[1400] : colors.palette[500],
            },
          }}
        />
      </Box>

      <Box
        padding="0.6rem 0.7rem"
        borderRadius="0.8rem"
        border={surfaceBorder}
        boxShadow={surfaceShadow}
      >
        <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700} mb="0.4rem">
          BATTERY CELL TEMPERATURES
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          {[t1, t2, t3, t4].map((val, idx) => (
            <Box
              key={`t-${idx}`}
              height="2.8rem"
              borderRadius="5rem"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="0.9rem"
              paddingInline="1rem"
              fontWeight={800}
              color={colors.palette[100]}
              border={surfaceBorder}
            >
              {val} °C
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TempsCard;
