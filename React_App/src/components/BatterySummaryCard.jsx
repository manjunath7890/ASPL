import { Box, CircularProgress, LinearProgress, useTheme } from "@mui/material";
import { tokens } from "../theme";

const BatterySummaryCard = ({
  soc = 0,
  current = 0,
  voltage = 0,
  power = 0,
  low = 0,
  high = 0,
  cycles = 0,
  totalCapacity = 0,
  capacity = 0,
}) => {
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
  const socPct = Math.max(0, Math.min(100, Number(soc)));

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} m={"1.65rem 0"}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={100}
              size={140}
              thickness={5}
              sx={{
                color: colors.palette[900],
                "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
              }}
            />
            <CircularProgress
              variant="determinate"
              value={socPct}
              size={140}
              thickness={5}
              sx={{
                color: socPct > 20 ? colors.palette[500] : socPct > 10 ? colors.palette[1300] : colors.palette[1400],
                position: "absolute",
                left: 0,
                "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
              }}
            />
            <Box
              position="absolute"
              top="12%"
              left="12%"
              right="12%"
              bottom="12%"
              borderRadius="50%"
              bgcolor= {colors.palette[300]}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box fontSize="1.8rem" fontWeight={800} color={colors.palette[100]}>
                {socPct.toFixed(0)}%
              </Box>
            </Box>
          </Box>
          {/* <Box>
            <Box fontSize="0.65rem" letterSpacing="0.1em" fontWeight={700} color={colors.palette[150]}>
              BATTERY SOC
            </Box>
          </Box> */}
        </Box>

        <Box textAlign="right">
          <Box fontSize="0.65rem" letterSpacing="0.1em" fontWeight={700} color={colors.palette[150]}>
            CURRENT
          </Box>
          <Box
            fontSize="1.6rem"
            fontWeight={800}
            color={colors.palette[500]}
          >
            {current} A
          </Box>
          <Box fontSize="0.6rem" letterSpacing="0.1em" fontWeight={700} color={colors.palette[150]} mt="1.5rem">
            VOLTAGE
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {voltage} V
          </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1}>
        <Box
          padding="0.6rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            CYCLES
          </Box>
          <Box fontSize="1.3rem" fontWeight={700} color={colors.palette[100]}>
            {cycles}
          </Box>
        </Box>
        <Box
          padding="0.6rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            POWER
          </Box>
          <Box fontSize="1.3rem" fontWeight={700} color={colors.palette[100]}>
            {power} W
          </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1}>
        <Box
          padding="0.6rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            TOTAL CAPACITY
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {totalCapacity} AH
          </Box>
          {/* <Box fontSize="0.7rem" color={colors.palette[150]} mt="0.2rem">
            {low} - {high} V
          </Box> */}
        </Box>
        <Box
          padding="0.6rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={600}>
            BALANCE CAPACITY
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {capacity} AH
          </Box>
          {/* <Box fontSize="0.75rem" color={colors.palette[150]}>
            {totalCapacity} AH
          </Box> */}
        </Box>
      </Box>

      
    </Box>
  );
};

export default BatterySummaryCard;
