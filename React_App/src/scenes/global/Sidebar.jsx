import * as React from "react";
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FeedIcon from "@mui/icons-material/Feed";
import TableRowsIcon from "@mui/icons-material/TableRows";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ViewListIcon from "@mui/icons-material/ViewList";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext, tokens } from "../../theme";

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 2px)`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SidebarItem = ({
  open,
  active,
  icon,
  label,
  to,
  onClick,
  colors,
  isDark,
}) => (
  <Tooltip title={label} placement="right" arrow disableHoverListener={open}>
    <ListItem disablePadding sx={{ px: 1, py: 0.28 }}>
      <ListItemButton
        component={to ? Link : "button"}
        to={to}
        onClick={onClick}
        sx={{
          minHeight: 46,
          borderRadius: "0.8rem",
          justifyContent: open ? "initial" : "center",
          background: active
            ? `linear-gradient(90deg, ${colors.palette[500]}2a 0%, ${colors.palette[550]}22 100%)`
            : "transparent",
          border: active
            ? `1px solid ${colors.palette[500]}66`
            : `1px solid transparent`,
          "&:hover": {
            background: active
              ? `linear-gradient(90deg, ${colors.palette[500]}36 0%, ${colors.palette[550]}2a 100%)`
              : isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(15,23,42,0.05)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.35 : 0,
            justifyContent: "center",
            color: active
              ? colors.palette[100]
              : isDark
                ? "rgb(235, 242, 250)"
                : "rgb(133, 133, 133)",
            fontSize: "1.3rem",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={{ opacity: open ? 1 : 0 }}
          primaryTypographyProps={{
            fontFamily: "Kanit, sans-serif",
            fontWeight: active ? 500 : 400,
            fontSize: "0.95rem",
            color: active
              ? colors.palette[100]
              : isDark
                ? "rgba(235, 242, 250, 0.78)"
                : "rgba(50, 67, 84, 0.78)",
          }}
        />
      </ListItemButton>
    </ListItem>
  </Tooltip>
);

export default function SideBar({ role, isOpen }) {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";
  const [open, setOpen] = React.useState(Boolean(isOpen));

  useEffect(() => {
    if (typeof isOpen === "boolean") setOpen(isOpen);
  }, [isOpen]);

  const dividerSx = {
    my: 0.8,
    mx: 1.1,
    borderColor: isDark ? "rgb(207, 207, 207)" : "rgb(102, 102, 102)",
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            border: "none",
            background: isDark
              ? "linear-gradient(180deg, rgba(66, 69, 71, 0.94) 0%, rgba(46, 50, 54, 0.98) 100%)"
              : "linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(237, 244, 247, 0.98) 100%)",
            backdropFilter: "blur(10px)",
            boxShadow: isDark
              ? "0 14px 30px rgba(0,0,0,0.28)"
              : "0 10px 26px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            px: open ? 1.2 : 0.7,
            py: 1,
            minHeight: "60px",
          }}
        >
          {open ? (
            <Typography
              sx={{
                fontFamily: "Kanit, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: colors.palette[150],
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginLeft: "0.5rem",
              }}
            >
              Menu
            </Typography>
          ) : (
            <Box />
          )}
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              color: colors.palette[100],
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
              borderRadius: "0.7rem",
              width: "2rem",
              height: "2rem",
            }}
          >
            {open ? (
              theme.direction === "rtl" ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Divider sx={dividerSx} />

        <List sx={{ px: 0.2 }}>
          <SidebarItem
            open={open}
            active={isActivePath("/dashboard")}
            icon={<DashboardIcon fontSize="inherit" />}
            label="Dashboard"
            to="/dashboard"
            colors={colors}
            isDark={isDark}
          />
          <SidebarItem
            open={open}
            active={isActivePath("/vehicles-list")}
            icon={<DirectionsBusIcon fontSize="inherit" />}
            label="Vehicles List"
            to="/vehicles-list"
            colors={colors}
            isDark={isDark}
          />
        </List>

        <Divider sx={dividerSx} />

        <List sx={{ px: 0.2 }}>
          {role !== "customer" && (
            <SidebarItem
              open={open}
              active={isActivePath("/user-table")}
              icon={<AccountBoxIcon fontSize="inherit" />}
              label="Users List Table"
              to="/user-table"
              colors={colors}
              isDark={isDark}
            />
          )}
          <SidebarItem
            open={open}
            active={isActivePath("/vehicle-table")}
            icon={<ViewListIcon fontSize="inherit" />}
            label="Vehicles List Table"
            to="/vehicle-table"
            colors={colors}
            isDark={isDark}
          />
        </List>

        <Divider sx={dividerSx} />

        <List sx={{ px: 0.2 }}>
          <SidebarItem
            open={open}
            active={isActivePath("/analytics/summary")}
            icon={<TableRowsIcon fontSize="inherit" />}
            label="Multi-Day Analytics"
            to="/analytics/summary"
            colors={colors}
            isDark={isDark}
          />
          <SidebarItem
            open={open}
            active={isActivePath("/analytics/dashboard")}
            icon={<FeedIcon fontSize="inherit" />}
            label="Day-wise Analytics"
            to="/analytics/dashboard"
            colors={colors}
            isDark={isDark}
          />
          <SidebarItem
            open={open}
            active={isActivePath("/analytics/graph")}
            icon={<AssessmentIcon fontSize="inherit" />}
            label="Graph Analytics"
            to="/analytics/graph"
            colors={colors}
            isDark={isDark}
          />
        </List>

        <Box sx={{ mt: "auto" }}>
          <Divider sx={dividerSx} />
          <List sx={{ px: 0.2 }}>
            <SidebarItem
              open={open}
              active={false}
              icon={<Brightness7Icon fontSize="inherit" />}
              label="Color Mode"
              onClick={colorMode.toggleColorMode}
              colors={colors}
              isDark={isDark}
            />
            <SidebarItem
              open={open}
              active={false}
              icon={<ExitToAppIcon fontSize="inherit" />}
              label="Logout"
              onClick={() => {
                localStorage.setItem("loggedOut", true);
                localStorage.removeItem("email");
                localStorage.removeItem("password");
                window.location.href = "/";
              }}
              colors={colors}
              isDark={isDark}
            />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
