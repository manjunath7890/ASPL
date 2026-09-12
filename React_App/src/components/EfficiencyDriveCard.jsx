import { Box, LinearProgress, useTheme } from "@mui/material";
import { tokens } from "../theme";

const EfficiencyDriveCard = ({
  whpkm = 0,
  whr = 0,
  gradient = 0,
  driveMode = 0,
  gear = 0,
  controllerCurrent = 0,
  AH = 0,
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
  const whrMax = AH * 72 / 1000;
  const whrPct = Math.max(0, Math.min(100, (Number(whr) / whrMax) * 100));

  const circle = (label, active) => (
    <Box
      key={label}
      width="100%"
      px="0.9rem"
      py="0.35rem"
      borderRadius="999px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="0.85rem"
      fontWeight={800}
      color={active ? colors.palette[110] : colors.palette[150]}
      border={`1px solid ${active ? colors.palette[500] : colors.palette[600]}`}
      sx={{ background: `${active ? colors.palette[500] : colors.palette[300]}` }}
    >
      {label}
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1}>
        <Box
          padding="0.7rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
            WATT-HR / KM
          </Box>
          <Box fontSize="2.1rem" fontWeight={700} color={colors.palette[100]} pb={"-0.2rem"}>
            {whpkm}
          </Box>
        </Box>
        <Box
          padding="0.7rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
            GEAR
          </Box>
          <Box fontSize="2.2rem" fontWeight={800} color={colors.palette[100]} pb={"-0.2rem"}>
            {gear || "—"}
          </Box>
        </Box>
      </Box>

    <Box
      padding="0.7rem 0.9rem"
      borderRadius="0.8rem"
      border={surfaceBorder}
      boxShadow={surfaceShadow}
    >
      <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
        DRIVE MODE
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        gap={1}
        mt="0.45rem"
        width="100%"
      >
        {circle("P", driveMode === 1)}
        {circle("E", driveMode === 2)}
        {circle("D", driveMode === 3)}
        {circle("R", driveMode === 4)}
      </Box>
    </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={1}>
        <Box
          padding="0.7rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
            CONTROLLER CURRENT
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {controllerCurrent} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>A</span>
          </Box>
        </Box>
        <Box
          padding="0.7rem 0.9rem"
          borderRadius="0.8rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
        >
          <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
            GRADIENT
          </Box>
          <Box fontSize="1.2rem" fontWeight={700} color={colors.palette[100]}>
            {gradient} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.palette[150] }}>°</span>
          </Box>
        </Box>
      </Box>



      <Box
        padding="0.7rem 0.9rem"
        borderRadius="0.8rem"
        border={surfaceBorder}
        boxShadow={surfaceShadow}
      >
        <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
          REMAINING WATT-HR
        </Box>
        <Box fontSize="1.2rem" fontWeight={800} color={colors.palette[100]}>
          {whr} kWHr
        </Box>
        <LinearProgress
          variant="determinate"
          value={whrPct}
          sx={{
            height: "0.45rem",
            borderRadius: "999px",
            backgroundColor: colors.palette[900],
            mt: "0.4rem",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              backgroundColor: colors.palette[500],
            },
          }}
        />
      </Box>


    </Box>
  );
};

export default EfficiencyDriveCard;
