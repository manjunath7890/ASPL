import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PersonIcon from "@mui/icons-material/Person";
import { tokens } from "../../theme";

const Topbar = ({ role }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const roleKey = String(role || "").toLowerCase();
  const roleMeta =
    roleKey === "admin"
      ? { label: "Admin", icon: <AdminPanelSettingsIcon sx={{ fontSize: "1rem" }} /> }
      : roleKey === "service" || roleKey === "dealer"
        ? { label: "Dealer", icon: <EngineeringIcon sx={{ fontSize: "1rem" }} /> }
        : roleKey === "customer"
          ? { label: "Customer", icon: <PersonIcon sx={{ fontSize: "1rem" }} /> }
          : { label: role || "User", icon: <PersonIcon sx={{ fontSize: "1rem" }} /> };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        background: isDark
          ? "linear-gradient(90deg, rgba(66, 69, 71, 0.95) 0%, rgba(46, 50, 54, 0.95) 100%)"
          : "linear-gradient(90deg, rgba(248, 250, 252, 0.98) 0%, rgba(237, 244, 247, 0.98) 100%)",
        boxShadow: isDark
          ? "0 8px 20px rgba(0,0,0,0.2)"
          : "0 8px 18px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box display="flex" alignItems="center" gap={1.1} ml={5}>
        <Typography
          sx={{
            fontFamily: "Kanit, sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
            letterSpacing: "0.08em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <Box component="span" sx={{ color: colors.palette[500] }}>
            Alt
          </Box>
          <Box component="span" sx={{ color: colors.palette[100] }}>
            Ener
          </Box>
        </Typography>

        <Typography
          component="div"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.55,
            px: 1,
            py: 0.38,
            borderRadius: "999px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}`,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.72)",
            fontFamily: "Kanit, sans-serif",
            fontWeight: 600,
            fontSize: "0.74rem",
            color: colors.palette[100],
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", color: colors.palette[500] }}>
            {roleMeta.icon}
          </Box>
          <Box component="span" pr={0.3}>
            {roleMeta.label}
          </Box>
        </Typography>
      </Box>

      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{
          textTransform: "none",
          fontFamily: "Kanit, sans-serif",
          fontWeight: 700,
          borderRadius: "0.72rem",
          minWidth: "4.7rem",
          height: "2.1rem",
          color: colors.palette[100],
          borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.16)",
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
          "&:hover": {
            borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
          },
        }}
      >
        Home
      </Button>
    </Box>
  );
};

export default Topbar;
