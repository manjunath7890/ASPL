import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useTheme,
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { keyframes } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StraightenIcon from "@mui/icons-material/Straighten";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HeightIcon from "@mui/icons-material/Height";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import ScaleIcon from "@mui/icons-material/Scale";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SpeedIcon from "@mui/icons-material/Speed";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import RouteIcon from "@mui/icons-material/Route";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import MemoryIcon from "@mui/icons-material/Memory";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import WarningIcon from "@mui/icons-material/Warning";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from "@mui/icons-material/Security";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import { tokens } from "../../theme";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LITE_MODELS = [
  {
    id: "container",
    name: "LITE - Container",
    image: "/assets/lite-blue-container.jpg",
  },
  {
    id: "low-body",
    name: "LITE - Low Body",
    image: "/assets/lite-white-lowdeck.png",
  },
  {
    id: "flat-bed",
    name: "LITE - Flat Bed",
    image: "/assets/lite-cream-flatbed.png",
  },
];

const DEEP_SPECS = [
  {
    category: "Dimensions",
    icon: StraightenIcon,
    items: [
      { label: "Overall Length", value: "2800 mm", icon: StraightenIcon },
      { label: "Overall Width", value: "1350 mm", icon: SwapHorizIcon },
      { label: "Overall Height", value: "1600 mm", icon: HeightIcon },
      { label: "Wheelbase", value: "1900 mm", icon: SettingsEthernetIcon },
    ],
  },
  {
    category: "Weights",
    icon: ScaleIcon,
    items: [
      { label: "Gross Vehicle Weight (GVW)", value: "950 kg", icon: LocalShippingIcon },
      { label: "Payload Capacity", value: "500 kg", icon: BusinessCenterIcon },
      { label: "Kerb Weight", value: "450 kg", icon: ScaleIcon },
    ],
  },
  {
    category: "Performance",
    icon: SpeedIcon,
    items: [
      { label: "Top Speed", value: "45 km/h", icon: SpeedIcon },
      { label: "Certified Range", value: "120 km", icon: RouteIcon },
      { label: "Gradeability", value: "15%", icon: TrendingUpIcon },
      { label: "Ground Clearance", value: "180 mm", icon: VerticalAlignBottomIcon },
      { label: "Peak Torque", value: "30 Nm", icon: RotateRightIcon },
    ],
  },
  {
    category: "Powertrain & Driving",
    icon: ElectricBoltIcon,
    items: [
      { label: "Motor Type", value: "PMSM", icon: MemoryIcon },
      { label: "Battery Technology", value: "LiFePO4", icon: BatteryStdIcon },
      { label: "Battery Capacity", value: "5.5 kWh", icon: BatteryChargingFullIcon },
      { label: "Drive Modes", value: "Eco, Drive, Reverse", icon: AltRouteIcon },
      { label: "Smart AutoMode", value: "Auto-switches Eco/Drive based on driving style", icon: AutoAwesomeIcon },
      { label: "Transmission", value: "Manual Gear Shifting (1st & 2nd)", icon: AccountTreeIcon },
    ],
  },
  {
    category: "Chassis & Features",
    icon: MemoryIcon,
    items: [
      { label: "Tyre Size", value: "8 Inches", icon: DonutLargeIcon },
      { label: "Brakes", value: "Hydraulic Dual-Circuit Brakes", icon: WarningIcon },
      { label: "Instrument Cluster", value: '7" Smart Digital Display', icon: DashboardIcon },
      { label: "Security", value: "Keyless Entry & Start", icon: SecurityIcon },
      { label: "Telematics", value: "Built-in LTE GPS Tracking", icon: GpsFixedIcon },
    ],
  },
  {
    category: "Body Variants",
    icon: LocalShippingIcon,
    items: [
      { label: "Available Types", value: "Container, Low Body, Flat Bed", icon: CategoryIcon },
    ],
  },
];

const LiteDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const shell = useMemo(() => {
    const page = isDark ? "#050807" : "#e9eceb";
    const bandEven = isDark ? "#141a18" : "#ffffff";
    const bandOdd = isDark ? "#0a0f0d" : "#d9e5dd";
    const panelElevated = isDark ? "#161d1a" : "#f2f8f4";
    const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(10,12,11,0.10)";
    const muted = isDark ? "rgba(255,255,255,0.72)" : "#3d4a45";
    return { page, bandEven, bandOdd, panelElevated, border, muted };
  }, [isDark]);

  const activeModel = LITE_MODELS.find((m) => m.id === id) || LITE_MODELS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 10,
        bgcolor: shell.page,
        position: "relative",
        overflowX: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: isDark
            ? `radial-gradient(ellipse 80% 55% at 85% 5%, rgba(0,212,155,0.18) 0%, transparent 55%),
               radial-gradient(ellipse 70% 60% at 10% 40%, rgba(46,105,88,0.18) 0%, transparent 60%)`
            : `radial-gradient(ellipse 80% 55% at 85% 5%, rgba(0,212,155,0.14) 0%, transparent 55%),
               radial-gradient(ellipse 70% 60% at 10% 40%, rgba(46,105,88,0.12) 0%, transparent 60%)`,
        },
      }}
    >
      <Box
        sx={{
          pt: { xs: 10, md: 14 },
          pb: 6,
          px: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/lite-info")}
            sx={{
              mb: 4,
              color: isDark ? "rgba(255,255,255,0.9)" : "#0a0c0b",
              border: `1px solid ${shell.border}`,
              borderRadius: 999,
              px: 2,
              py: 1,
              backdropFilter: "blur(10px)",
              bgcolor: isDark ? "rgba(16,21,19,0.55)" : "rgba(255,255,255,0.7)",
              "&:hover": {
                borderColor: colors.palette[500],
                bgcolor: isDark ? "rgba(16,21,19,0.72)" : "rgba(255,255,255,0.92)",
              },
            }}
          >
            Back to LITE Overview
          </Button>

          <Grid container spacing={6} alignItems="center">
            {/* ── Left: Title block ── */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                opacity: 0,
                animation: `${fadeInLeft} 0.8s ease-out forwards`,
                animationDelay: "0.2s",
              }}
            >
              <Typography
                sx={{
                  color: colors.palette[500],
                  fontSize: 14,
                  letterSpacing: 3,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Technical Specifications
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                {activeModel.name}
              </Typography>
              <Typography
                sx={{
                  color: colors.palette[150],
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Review the technical depth of the LITE model, designed to
                deliver peak efficiency in day-to-day operations.
              </Typography>
            </Grid>

            {/* ── Right: Image card with 3D shadow ── */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                opacity: 0,
                animation: `${fadeInRight} 0.8s ease-out forwards`,
                animationDelay: "0.4s",
              }}
            >
              <Box
                sx={{
                  bgcolor: isDark ? "rgba(16,21,19,0.6)" : "rgba(255,255,255,0.78)",
                  borderRadius: 4,
                  p: 4,
                  border: `1px solid ${shell.border}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: isDark ? "0 18px 60px rgba(0,0,0,0.35)" : "0 14px 40px rgba(10,20,18,0.10)",
                  backdropFilter: "blur(14px)",
                  transform: "perspective(1000px) rotateY(-2deg) rotateX(1.5deg)",
                  transition: "transform 0.45s ease, box-shadow 0.45s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                    borderColor: colors.palette[500],
                    boxShadow: isDark ? "0 22px 70px rgba(0,0,0,0.45)" : "0 18px 55px rgba(10,20,18,0.14)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={activeModel.image}
                  alt={activeModel.name}
                  sx={{ width: "100%", maxHeight: "420px", objectFit: "contain" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Spec cards ── */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          {DEEP_SPECS.map((section, index) => {
            const Icon = section.icon;
            return (
              <Grid
                item
                xs={12}
                md={6}
                key={section.category}
                sx={{
                  opacity: 0,
                  animation: `${fadeInUp} 0.6s ease-out forwards`,
                  animationDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                <Box
                  sx={{
                    bgcolor: shell.panelElevated,
                    p: 4,
                    borderRadius: 4,
                    border: `1px solid ${shell.border}`,
                    height: "100%",
                    backdropFilter: "blur(12px)",
                    transform: "translateY(0px)",
                    /* layered shadow: sharp near + diffuse mid + large ambient + inset highlight */
                    boxShadow: isDark
                      ? `
                          0 1px 2px  rgba(0,0,0,0.35),
                          0 4px 8px  rgba(0,0,0,0.30),
                          0 12px 24px rgba(0,0,0,0.25),
                          0 24px 48px rgba(0,0,0,0.20),
                          0 1px 0   rgba(255,255,255,0.04) inset
                        `
                      : `
                          0 1px 2px  rgba(0,0,0,0.07),
                          0 4px 8px  rgba(0,0,0,0.07),
                          0 12px 24px rgba(0,0,0,0.06),
                          0 24px 48px rgba(0,0,0,0.04),
                          0 1px 0   rgba(255,255,255,0.90) inset
                        `,
                    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: colors.palette[500],
                      boxShadow: isDark
                        ? `
                            0 6px 12px  rgba(0,0,0,0.40),
                            0 20px 40px rgba(0,0,0,0.35),
                            0 40px 80px rgba(0,0,0,0.25)
                          `
                        : `
                            0 6px 12px  rgba(0,0,0,0.10),
                            0 20px 40px rgba(0,0,0,0.09),
                            0 40px 80px rgba(0,0,0,0.06)
                          `,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Icon sx={{ fontSize: 32, color: colors.palette[500] }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                      }}
                    >
                      {section.category}
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      mb: 3,
                      borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,11,0.10)",
                      borderBottom: `1px solid ${shell.border}`,
                    }}
                  />

                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <TableRow
                              key={item.label}
                              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  color: isDark ? "rgba(255,255,255,0.72)" : "#3d4a45",
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  borderBottom: `1px solid ${shell.border}`,
                                  p: 1.5,
                                  pl: 0,
                                  width: "50%",
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <ItemIcon sx={{ color: colors.palette[500], fontSize: "1.2rem" }} />
                                  {item.label}
                                </Box>
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: isDark ? "#ffffff" : "#0a0c0b",
                                  fontWeight: 500,
                                  fontSize: "1rem",
                                  borderBottom: `1px solid ${shell.border}`,
                                  p: 1.5,
                                  pr: 0,
                                }}
                              >
                                {item.value}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default LiteDetails;