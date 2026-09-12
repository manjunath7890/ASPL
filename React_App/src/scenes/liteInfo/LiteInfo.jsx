import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTheme,
  Box,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { keyframes } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SpeedIcon from "@mui/icons-material/Speed";
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
    imageAlt: "Lite electric 3 wheeler cargo vehicle - Container",
    desc: "Fully enclosed cargo box for secure, weather-proof transportation.",
  },
  {
    id: "low-body",
    name: "LITE - Low Body",
    image: "/assets/lite-white-lowdeck.png",
    imageAlt: "Lite electric 3 wheeler cargo vehicle - Low Body",
    desc: "Open cargo area with low side panels, ideal for easy loading and unloading.",
  },
  {
    id: "flat-bed",
    name: "LITE - Flat Bed",
    image: "/assets/lite-cream-flatbed.png",
    imageAlt: "Lite electric 3 wheeler cargo vehicle - Flat Bed",
    desc: "Maximum flexibility with an open flat bed for oversized cargo.",
  },
];

const SPECS = [
  { label: "Range", value: "120 km", icon: ElectricBoltIcon },
  { label: "Payload Capacity", value: "500 kg", icon: LocalShippingIcon },
  { label: "Charging Time", value: "4-5 Hrs", icon: BatteryChargingFullIcon },
  { label: "Top Speed", value: "45 km/h", icon: SpeedIcon },
];

const LiteInfo = () => {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shell = useMemo(() => {
    const page = isDark ? "#050807" : "#e9eceb";
    const bandEven = isDark ? "#141a18" : "#ffffff";
    const bandOdd = isDark ? "#0a0f0d" : "#d9e5dd";
    const panel = isDark ? "#101513" : "#ffffff";
    const panelElevated = isDark ? "#161d1a" : "#f2f8f4";
    const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(10,12,11,0.10)";
    const muted = isDark ? "rgba(255,255,255,0.72)" : "#3d4a45";
    return { page, bandEven, bandOdd, panel, panelElevated, border, muted };
  }, [isDark]);

  return (
    <Box
      sx={{
        bgcolor: shell.page,
        minHeight: "100vh",
        pb: { xs: 10, md: 12 },
        position: "relative",
        overflowX: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: isDark
            ? `radial-gradient(ellipse 80% 55% at 85% 5%, rgba(0,212,155,0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 10% 40%, rgba(46,105,88,0.18) 0%, transparent 60%)`
            : `radial-gradient(ellipse 80% 55% at 85% 5%, rgba(0,212,155,0.14) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 10% 40%, rgba(46,105,88,0.12) 0%, transparent 60%)`,
        },
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 10, md: 12 },
          position: "relative",
          zIndex: 1,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              mb: 4,
              color: isDark ? "rgba(255,255,255,0.85)" : "#0a0c0b",
              border: `1px solid ${shell.border}`,
              borderRadius: 999,
              px: 2,
              py: 1,
              backdropFilter: "blur(10px)",
              background: isDark ? "rgba(16,21,19,0.55)" : "rgba(255,255,255,0.7)",
              "&:hover": {
                borderColor: colors.palette[500],
                background: isDark ? "rgba(16,21,19,0.72)" : "rgba(255,255,255,0.9)",
              },
            }}
          >
            Back to Home
          </Button>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ opacity: 0, animation: `${fadeInLeft} 0.8s ease-out forwards`, animationDelay: "0.2s" }}>
              <Typography sx={{ color: colors.palette[500], fontSize: 14, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", mb: 1 }}>
                Efficiency Series
              </Typography>
              <Typography variant="h1" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: { xs: "2.5rem", md: "4rem" }, lineHeight: 1.1, mb: 3 }}>
                AltEner <br/>
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(105deg, ${colors.palette[510]} 0%, ${colors.palette[500]} 45%, #8fffe0 95%)`,
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  LITE
                </Box>
              </Typography>
              <Typography sx={{ color: shell.muted, fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: 1.6, mb: 4, maxWidth: 520 }}>
                Efficient. Practical. Built for Everyday Business. The LITE is the perfect balance between daily cargo capabilities and urban agility.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ opacity: 0, animation: `${fadeInRight} 0.8s ease-out forwards`, animationDelay: "0.4s" }}>
              <Box
                sx={{
                  bgcolor: isDark ? "rgba(16,21,19,0.6)" : "rgba(255,255,255,0.78)",
                  px: 0,
                  borderRadius: 4,
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
                    boxShadow: isDark ? "0 22px 70px rgba(0,0,0,0.45)" : "0 18px 55px rgba(10,20,18,0.16)",
                  },
                }}
              >
                <Box
                  component="img"
                  src="/assets/lite-3-bg.jpg"
                  alt="AltEner Lite"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    maxHeight: { xs: 320, md: 420 },
                    objectFit: "contain",
                    // padding: { xs: 2, md: 3 },
                    borderRadius: "0.5rem"
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Specs */}
      <Box sx={{ bgcolor: shell.bandEven, borderTop: `1px solid ${shell.border}`, position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 } }}>
          <Grid container spacing={3}>
          {SPECS.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <Grid item xs={6} md={3} key={spec.label} sx={{ opacity: 0, animation: `${fadeInUp} 0.6s ease-out forwards`, animationDelay: `${0.2 + index * 0.1}s` }}>
                <Box
                  sx={{
                    bgcolor: shell.panelElevated,
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${shell.border}`,
                    textAlign: "center",
                    boxShadow: isDark ? "0 18px 60px rgba(0,0,0,0.25)" : "0 12px 35px rgba(10,20,18,0.08)",
                    transition: "transform 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: colors.palette[500],
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 40, color: colors.palette[500], mb: 1 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "1.65rem", color: isDark ? "#ffffff" : "#0a0c0b" }}>{spec.value}</Typography>
                  <Typography sx={{ color: isDark ? "rgba(255,255,255,0.65)" : "#5a6662", fontSize: "0.875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1, mt: 0.5 }}>{spec.label}</Typography>
                </Box>
              </Grid>
            );
          })}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      {/* <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}>
            Built for the City
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <Grid item xs={12} md={4} key={feat.title} sx={{ opacity: 0, animation: `${fadeInUp} 0.6s ease-out forwards`, animationDelay: `${0.3 + index * 0.1}s` }}>
                <Box sx={{ p: 4, border: `1px solid ${colors.palette[400]}`, borderRadius: 4, height: "100%", bgcolor: colors.palette[300] }}>
                  <Icon sx={{ fontSize: 32, color: colors.palette[500], mb: 2 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "1.25rem", mb: 1 }}>{feat.title}</Typography>
                  <Typography sx={{ color: colors.palette[150], fontSize: "1rem", lineHeight: 1.6 }}>{feat.desc}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container> */}

      {/* Variants */}
      <Box sx={{ bgcolor: shell.bandOdd, borderTop: `1px solid ${shell.border}`, position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", py: { xs: 7, md: 9 } }}>
          <Typography variant="h2" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}>
            Choose Your Style
          </Typography>
          <Typography
            sx={{
              color: isDark ? "rgba(255,255,255,0.68)" : "#3d4a45",
              mt: 1.5,
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "1.05rem",
            }}
          >
            Pick the build that matches your route profile and operating needs.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {LITE_MODELS.map((model, index) => (
            <Grid item xs={12} md={4} key={model.name} sx={{ opacity: 0, animation: `${fadeInUp} 0.6s ease-out forwards`, animationDelay: `${0.4 + index * 0.1}s` }}>
              <Box
                onClick={() => navigate(`/lite-info/${model.id}`)}
                sx={{
                  border: `1px solid ${shell.border}`,
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: shell.panelElevated,
                  cursor: "pointer",
                  boxShadow: isDark ? "0 14px 45px rgba(0,0,0,0.28)" : "0 12px 35px rgba(10,20,18,0.08)",
                  transition: "transform 0.35s ease, border-color 0.25s ease, box-shadow 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: colors.palette[500],
                    boxShadow: isDark ? "0 22px 70px rgba(0,0,0,0.42)" : "0 18px 55px rgba(10,20,18,0.14)",
                  },
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "16/11",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    bgcolor: isDark ? "#0c1210" : "#ffffff",
                    borderBottom: `1px solid ${shell.border}`,
                  }}
                >
                  <Box component="img" src={model.image} alt={model.imageAlt} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.25rem", mb: 0.75, color: isDark ? "#ffffff" : "#0a0c0b" }}>
                    {model.name}
                  </Typography>
                  <Typography sx={{ color: isDark ? "rgba(255,255,255,0.68)" : "#5a6662", fontSize: "0.98rem", lineHeight: 1.65, fontWeight: 400 }}>
                    {model.desc}
                  </Typography>
                  <Typography sx={{ color: colors.palette[510], fontSize: "0.86rem", fontWeight: 600, mt: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Click for more details →
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LiteInfo;
