import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Chart from "react-apexcharts";

const PerformanceCard = ({ speed = 0, rpm = 0, odo = 0, trip = 0, range = 0 }) => {
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
  const speedMax = 50;
  const speedPct = Math.max(0, Math.min(100, (Number(speed) / speedMax) * 100));
  

  const speedOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: {
          size: "55%",
        },
        track: {
          background: [colors.palette[900]],
          strokeWidth: "100%",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    fill: {
      colors: [colors.palette[500]],
    },
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box position="relative" width={300} height={180}>
          <Chart options={speedOptions} series={[speedPct]} type="radialBar" height={220} />
          <Box position="absolute" left={0} right={0} bottom="20%" textAlign="center">
            <Box
              sx={{
                fontSize: "2.8rem",
                fontWeight: 700,
                lineHeight: 1,
                color: colors.palette[100],
              }}
            >
              {speed}
            </Box>
            <Box fontSize="0.7rem" color={colors.palette[150]}>
          kmph
        </Box>
          </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1} mt="0.9rem">
        <Box
          padding="0.6rem 0.8rem"
          borderRadius="0.75rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            RPM
          </Box>
          <Box fontSize="1.6rem" fontWeight={700} color={colors.palette[100]}>
            {rpm}
          </Box>
        </Box>
        <Box
          padding="0.6rem 0.8rem"
          borderRadius="0.75rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            RANGE
          </Box>
          <Box fontSize="1.6rem" fontWeight={700} color={colors.palette[100]}>
            {range} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>km</span>
          </Box>
        </Box>
        <Box
          padding="0.6rem 0.8rem"
          borderRadius="0.75rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            TRIP
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {(trip).toFixed(1)} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>km</span>
          </Box>
        </Box>
        <Box
          padding="0.6rem 0.8rem"
          borderRadius="0.75rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            ODO
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {odo} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>km</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceCard;
