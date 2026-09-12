import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Squircle } from "@squircle-js/react";

const FaultBox_2 = ({
  title,
  count,
  icon,
  bgColor,
  textColor = "white",
  squircleBg = "#ffffff33", // transparent white
  squircleBorder = "#ffffff44",
  squircleBorderWidth = 1.5,
  fontSize = "2.2rem",
  hFont = "0.95rem",
  height = "6.8rem",
  width = "100%",
  fontWeight = 500,
  onClick,
  dividerColor,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      onClick={onClick}
      width={width}
      borderRadius={"1rem"}
      display="flex"
      alignItems="center"
      gap={1}
      p={"0.8rem 0.9rem"}
      color={textColor}
      height={height}
      border={(isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)")}
      boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
      bgcolor={bgColor || (isDark ? "rgba(15, 21, 28, 0.88)" : "rgba(255,255,255,0.92)")}
      overflow="hidden"
      cursor={onClick ? "pointer" : "default"}
      sx={{
        position: "relative",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        "&::before": {
          content: "\"\"",
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          boxShadow: isDark
            ? "inset 0 0 0 1px rgba(255,255,255,0.03)"
            : "inset 0 0 0 1px rgba(255,255,255,0.55)",
        },
        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: isDark
                ? "0 14px 30px rgba(0,0,0,0.34)"
                : "0 14px 30px rgba(15, 23, 42, 0.18)",
            }
          : {},
      }}
    >
      {icon && (
        <Squircle
          cornerRadius={11.5}
          cornerSmoothing={1}
          style={{
            color: isDark ? colors.palette[110] : "#ffffff",
            background: squircleBg || colors.palette[500],
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.45rem",
            border: `${squircleBorderWidth}px solid ${squircleBorder}`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Squircle>
      )}

      <Box
        sx={{
          width: "1px",
          alignSelf: "stretch",
          background: dividerColor || (isDark ? "rgba(255,255,255,0.12)" : "rgba(17,24,39,0.12)"),
          mx: 0.35,
        }}
      />

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minWidth={0}
        sx={{ lineHeight: 1.2 }}
      >
        <Box
          fontSize={hFont}
          color={colors.palette[150]}
          fontWeight={600}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Box>
        <Box
          style={{
            fontSize: fontSize,
            fontWeight: fontWeight + 100,
          }}
        >
          {count}
        </Box>
      </Box>
    </Box>
  );
};

export default FaultBox_2;
