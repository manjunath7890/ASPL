import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CellVoltagesCard = ({ cells = [] }) => {
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

  const normalized = Array.from({ length: 24 }, (_, index) => {
    const value = cells[index];
    return value === undefined || value === null || value === "" ? "--" : value;
  });

  const numericValues = cells
    .map((value) => (value === undefined || value === null || value === "" ? NaN : Number(value)))
    .filter((value) => Number.isFinite(value));

  const minValue = numericValues.length ? Math.min(...numericValues) : null;
  const maxValue = numericValues.length ? Math.max(...numericValues) : null;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }}
      gap={1}
      marginTop={"1rem"}
    >
      {normalized.map((value, index) => {
        const numericValue = Number(value);
        const isNumeric = Number.isFinite(numericValue);
        const isLow = isNumeric && minValue !== null && numericValue === minValue;
        const isHigh = isNumeric && maxValue !== null && numericValue === maxValue;

        const backgroundColor = isLow
          ? colors.palette[1450]
          : isHigh
            ? colors.palette[1150]
            : colors.palette[300];
        const valueColor = isLow
          ? colors.palette[1400]
          : isHigh
            ? colors.palette[510]
            : colors.palette[100];
         const fontWeight = isLow
          ? 600
          : isHigh
            ? 700
            : 400;


        return (
        <Box
          key={`cell-${index + 1}`}
          padding="0.5rem 0.6rem"
          borderRadius="0.7rem"
          border={surfaceBorder}
          boxShadow={surfaceShadow}
          sx={{ background: backgroundColor }}
        >
          <Box fontSize="0.55rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={500}>
            CELL {index + 1}
          </Box>
          <Box fontSize="0.95rem" fontWeight={fontWeight} color={valueColor}>
            {value} V
          </Box>
        </Box>
        );
      })}
    </Box>
  );
};

export default CellVoltagesCard;
