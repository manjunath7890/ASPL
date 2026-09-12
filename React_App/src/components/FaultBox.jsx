import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const FaultBox = ({
  title,
  count,
  bgColor,
  textColor = "white",
  icon = null,
  iconColor = "white",
  iconBg = "rgba(255, 255, 255, 0.2)",
  onClick,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      onClick={onClick}
      sx={{
        color: textColor,
        borderRadius: "0.95rem",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
        boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
        background: isDark ? "rgba(15, 21, 28, 0.88)" : "#ffffff",
        transition: "box-shadow 160ms ease",
        "&:hover": onClick
          ? {
              boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
            }
          : {},
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          borderTopRightRadius: "0.95rem",
          borderTopLeftRadius: "0.95rem",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(190, 206, 197, 0.75)"}`,
          backgroundColor: bgColor,
        }}
        p="0.65rem 0.95rem"
      >
        {icon && (
          <Box
            sx={{
              backgroundColor: iconBg,
              borderRadius: "0.5rem",
              padding: "0.2rem 0.4rem",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>{icon}</span>
          </Box>
        )}
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.palette[110] }}>
          {title}
        </Typography>
      </Box>
      <Box p="0.95rem 1rem 1.05rem 1rem">
        <Typography sx={{ fontSize: { xs: "2rem", sm: "2.25rem" }, fontWeight: 700, lineHeight: 1.1 }}>
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export default FaultBox;
