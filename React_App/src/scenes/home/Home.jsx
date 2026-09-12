import { useState, useEffect, useRef, useMemo, memo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { tokens, ColorModeContext } from "../../theme";

/** Local files in public/assets (Unsplash — see IMAGE_SOURCES.txt). */
const PAGE_BG = {
  hero: "/assets/lite-3-bg.jpg",
  mesh: "/assets/bg-mesh-gradient.jpg",
  logistics: "/assets/bg-logistics.jpg",
};

const LAUNCH_DATE = new Date("2025-06-01T00:00:00");
/** Counter animation targets (keys match statValues state). */
const STAT_TARGETS = [0, 60, 2];
const MODELS = [
  {
    name: "BUZZ",
    series: "PERFORMANCE SERIES",
    image: "/assets/buzz-3-bg.jpg",
    imageAlt: "Buzz electric 3 wheeler cargo vehicle",
    specs: [
      { value: "140 km", label: "Range" },
      { value: "600 kg", label: "Payload" },
      { value: "3-4 Hrs", label: "Charge" },
    ],
    desc: "Built for Higher Performance & Maximum Load Efficiency.",
  },
  {
    name: "LITE",
    series: "EFFICIENCY SERIES",
    image: "/assets/lite-3-bg.jpg",
    imageAlt: "Lite electric 3 wheeler cargo vehicle",
    specs: [
      { value: "120 km", label: "Range" },
      { value: "500 kg", label: "Payload" },
      { value: "4-5 Hrs", label: "Charge" },
    ],
    desc: "Efficient. Practical. Built for Everyday Business.",
  },
];

const HERO_HIGHLIGHTS = [
  { icon: LocalShippingIcon, title: "Payload", value: "Up to 600 kg" },
  { icon: ElectricBoltIcon, title: "Range", value: "120-140 km/charge" },
  { icon: BatteryChargingFullIcon, title: "Charging", value: "3-4 hours" },
];

const ModelsSection = memo(function ModelsSection({ shellBg, cardBg, wellBg } = {}) {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const studio = isDark
    ? {
      section: shellBg ?? "#0e100f",
      card: cardBg ?? "#141816",
      imageWell: wellBg ?? "#0a0c0b",
      rail: colors.palette[500],
    }
    : {
      section: shellBg ?? "#f0f2f1",
      card: cardBg ?? "#ffffff",
      imageWell: wellBg ?? "#e8eae8",
      rail: colors.palette[500],
    };

  return (
    <Box
      id="models"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: studio.section,
        py: { xs: 10, md: 14 },
        px: 3,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: { xs: 0, lg: "5px" },
          bgcolor: studio.rail,
          zIndex: 2,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: isDark ? 0.2 : 0.28,
          backgroundImage: `linear-gradient(115deg, ${studio.section} 0%, rgba(2,179,132,0.06) 40%, transparent 70%), url(${PAGE_BG.logistics})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: { xs: 6, md: 9 } }}>
          <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
            Our Models
          </Typography>
          <Typography
            data-reveal
            className="reveal-delay-1"
            variant="h2"
            sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem" },
              letterSpacing: "-0.03em",
              color: colors.palette[100],
            }}
          >
            Built for Business
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {MODELS.map((model) => (
            <Grid item xs={12} md={6} key={model.name} onClick={() => navigate(model.name === 'BUZZ' ? '/buzz-info' : '/lite-info')} style={{ cursor: 'pointer' }}>
              <Box
                data-reveal
                className="reveal-scale"
                sx={{
                  overflow: "hidden",
                  bgcolor: studio.card,
                  borderRadius: 0,
                  boxShadow: isDark
                    ? "0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)"
                    : "0 20px 50px rgba(15,20,18,0.08), 0 0 0 1px rgba(15,20,18,0.06)",
                  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    boxShadow: isDark
                      ? `0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px ${colors.palette[500]}55`
                      : `0 28px 56px rgba(15,20,18,0.12), 0 0 0 1px ${colors.palette[500]}44`,
                    transform: "translateY(-8px)",
                    "& .model-image": { transform: "scale(1.05)" },
                  },
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "16/10",
                    bgcolor: studio.imageWell,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    px: 2,
                  }}
                >
                  <Box
                    component="img"
                    className="model-image"
                    src={model.image}
                    alt={model.imageAlt}
                    loading="lazy"
                    sx={{
                      // width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.45s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      // background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                </Box>
                <Box sx={{ p: { xs: 2.5, md: 3.5 }, pt: 3 }}>
                  <Box sx={{ width: 48, height: 3, bgcolor: colors.palette[500], mb: 2 }} />
                  <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.5rem", mb: 0.5, letterSpacing: "-0.02em", color: colors.palette[100] }}>
                    {model.name}
                  </Typography>
                  <Typography sx={{ color: colors.palette[500], fontSize: 11, letterSpacing: "0.2em", fontWeight: 700, mb: 2.5, textTransform: "uppercase" }}>
                    {model.series}
                  </Typography>
                  <Grid container spacing={1.25} sx={{ mb: 2 }}>
                    {model.specs.map((spec) => (
                      <Grid item xs={4} key={spec.label}>
                        <Box
                          sx={{
                            p: 1.75,
                            bgcolor: isDark ? "#025133" : "#d1ecda",
                            border: "none",
                            textAlign: "center",
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: colors.palette[500] }}>{spec.value}</Typography>
                          <Typography sx={{ color: colors.palette[150], fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>{spec.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography sx={{ color: colors.palette[150], fontSize: "0.95rem", lineHeight: 1.65 }}>{model.desc}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default function HomeLanding() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const isDark = theme.palette.mode === "dark";
  const colorMode = useContext(ColorModeContext);

  const auto = useMemo(
    () =>
      isDark
        ? {
          page: "#070807",
          ink: "#f4f6f5",
          inkMuted: "rgba(244,246,245,0.68)",
          bandLight: "#101312",
          bandMid: "#0c0e0d",
          panel: "#131715",
          panelElevated: "#181c1a",
          footer: "#040504",
        }
        : {
          page: "#e9eceb",
          ink: "#ffffff",
          inkMuted: "rgba(255,255,255,0.72)",
          bandLight: "#ffffff",
          bandMid: "#f2f4f3",
          panel: "#ffffff",
          panelElevated: "#fafcfb",
          footer: "#0f1211",
        },
    [isDark]
  );

  /** Alternating section shells (A = even, B = odd) for rhythm below the hero. */
  const bands = useMemo(
    () =>
      isDark
        ? {
          even: { main: "#141a18", card: "#025133", well: "#101513", specChip: "#00d49b" },
          odd: { main: "#064f32", card: "#161d1a", well: "#0c1210", specChip: "#141a17" },
        }
        : {
          even: { main: "#ffffff", card: "#d1ecda", well: "#e6efe9", specChip: "#02b384" },
          odd: { main: "#d9e5dd", card: "#ffffff", well: "#c5d4cc", specChip: "#dceee4" },
        },
    [isDark]
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [dailyKm, setDailyKm] = useState(100);
  const [fleetSize, setFleetSize] = useState(5);
  const [fuelCost, setFuelCost] = useState(100);
  const [mileage, setMileage] = useState(20);
  const [savings, setSavings] = useState({
    current: "Rs 75,000",
    altener: "Rs 15,000",
    monthly: "Rs 60,000",
  });
  const [expandedFaq, setExpandedFaq] = useState(false);
  const containerRef = useRef(null);
  const statRefs = useRef([null, null, null]);
  const statAnimated = useRef(new Set());

  // Countdown effect
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const distance = LAUNCH_DATE.getTime() - now;
      if (distance > 0) {
        setCountdown({
          days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
          hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
          minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
          seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0"),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    const nodes = el.querySelectorAll("[data-reveal]");
    nodes.forEach((n) => observer.observe(n));
    return () => nodes.forEach((n) => observer.unobserve(n));
  }, []);

  // Animated counters for About stat cards (0, 60%, 2)
  const [statValues, setStatValues] = useState({ 0: 0, 60: 0, 2: 0 });
  useEffect(() => {
    const refs = statRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = refs.indexOf(entry.target);
          if (idx < 0 || statAnimated.current.has(idx)) return;
          statAnimated.current.add(idx);
          const target = STAT_TARGETS[idx];
          if (target === 0) {
            setStatValues((prev) => ({ ...prev, 0: 0 }));
            observer.unobserve(entry.target);
            return;
          }
          let current = 0;
          const step = Math.max(1, target / 50);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setStatValues((prev) => ({ ...prev, [target]: target }));
              clearInterval(timer);
            } else {
              setStatValues((prev) => ({ ...prev, [target]: Math.floor(current) }));
            }
          }, 30);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    refs.forEach((r) => r && observer.observe(r));
    return () => refs.forEach((r) => r && observer.unobserve(r));
  }, []);

  const handleCalculateSavings = () => {
    const fleet = Math.max(1, Number(fleetSize) || 1);
    const fuel = Math.max(80, Number(fuelCost) || 100);
    const mil = Math.max(10, Number(mileage) || 20);
    const monthlyFuel = (dailyKm / mil) * fuel * 30 * fleet;
    const monthlyElectric = dailyKm * 1.5 * 30 * fleet;
    const monthlySavingsVal = monthlyFuel - monthlyElectric;
    setSavings({
      current: `Rs ${Math.round(monthlyFuel).toLocaleString("en-IN")}`,
      altener: `Rs ${Math.round(monthlyElectric).toLocaleString("en-IN")}`,
      monthly: `Rs ${Math.round(monthlySavingsVal).toLocaleString("en-IN")}`,
    });
  };

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Models", href: "#models" },
    { label: "Benefits", href: "#benefits" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes gradientShift": {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
          "@keyframes fadeSlideUp": {
            from: { opacity: 0, transform: "translateY(40px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes lineExpand": {
            from: { width: 0 },
            to: { width: "100px" },
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          "@keyframes scaleIn": {
            from: { opacity: 0, transform: "scale(0.92)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
          "@keyframes countdownPulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.03)" },
          },
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          "@keyframes slideDown": {
            from: { opacity: 0, transform: "translateY(-20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes pulseGlow": {
            "0%, 100%": { transform: "scale(1)", opacity: 0.35 },
            "50%": { transform: "scale(1.08)", opacity: 0.55 },
          },
          "@keyframes orbit": {
            "0%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(-8px, -10px)" },
            "100%": { transform: "translate(0, 0)" },
          },
          "@keyframes logoMarquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          "@keyframes imageSlide": {
            "0%, 33.33%": { transform: "translateX(0)" },
            "50%, 83.33%": { transform: "translateX(-33.333%)" },
            "100%": { transform: "translateX(-66.666%)" },
          },
          ".reveal": {
            opacity: 0,
            transform: "translateY(30px)",
            transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          },
          ".reveal.active": {
            opacity: 1,
            transform: "translateY(0)",
          },
          ".reveal-delay-1": { transitionDelay: "0.1s" },
          ".reveal-delay-2": { transitionDelay: "0.2s" },
          ".reveal-delay-3": { transitionDelay: "0.3s" },
          ".reveal-delay-4": { transitionDelay: "0.4s" },
          ".reveal-scale": {
            opacity: 0,
            transform: "scale(0.95)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          },
          ".reveal-scale.active": {
            opacity: 1,
            transform: "scale(1)",
          },
          ".hero-glow": {
            animation: "pulseGlow 4s ease-in-out infinite",
          },
          ".orbit-chip": {
            animation: "orbit 3.8s ease-in-out infinite",
          },
          ".logo-marquee": {
            animation: "logoMarquee 18s linear infinite",
          },
          "html": { scrollBehavior: "smooth" },
        }}
      />
      <Box ref={containerRef} sx={{ bgcolor: auto.page, minHeight: "100vh", position: "relative" }}>
        {/* Site header */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: isDark ? "rgba(16, 36, 30, 0.92)" : "rgba(238, 238, 238, 0.94)",
            backdropFilter: "saturate(160%) blur(14px)",
            borderBottom: `1px solid ${isDark ? "rgba(140, 200, 175, 0.12)" : "rgba(46, 105, 88, 0.18)"}`,
            color: isDark ? "#e8f5f0" : "#0f1f1a",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              maxWidth: 1240,
              width: "100%",
              mx: "auto",
              px: { xs: 2, sm: 3 },
              minHeight: { xs: 58, md: 64 },
              gap: 2,
            }}
          >
            <Typography
              component="a"
              href="#"
              sx={{
                textDecoration: "none",
                color: "inherit",
                mr: "auto",
                fontFamily: "Kanit, sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "0.08em",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              <Box component="span" sx={{ color: colors.palette[510] }}>
                Alt
              </Box>
              Ener
            </Typography>
            <Box component="nav" sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.25 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  size="small"
                  sx={{
                    color: isDark ? "rgba(216, 242, 232, 0.78)" : "rgba(15, 31, 26, 0.72)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "none",
                    px: 1.25,
                    minWidth: 0,
                    "&:hover": {
                      color: isDark ? "#b8f0dc" : colors.palette[550],
                      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.45)",
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
            <IconButton
              onClick={colorMode.toggleColorMode}
              aria-label="Toggle theme"
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${isDark ? "rgba(140, 200, 175, 0.16)" : "rgba(46, 105, 88, 0.18)"}`,
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                color: isDark ? colors.palette[510] : colors.palette[500],
                width: 38,
                height: 38,
                ml: 1,
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)",
                },
                display: { xs: "inline-flex", md: "inline-flex" },
              }}
            >
              {isDark ? <Brightness7Icon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/login")}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                bgcolor: colors.palette[500],
                color: "#0a0c0b",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontSize: "0.7rem",
                px: 2,
                py: 0.75,
                boxShadow: "none",
                "&:hover": { bgcolor: colors.palette[550], boxShadow: "none" },
              }}
            >
              Login
            </Button>
            <IconButton
              edge="end"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              sx={{ display: { md: "none" }, color: "inherit" }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 300, bgcolor: isDark ? "#0c0e0d" : "#fff" } }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 1 }}>
            {navLinks.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton href={link.href} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 1, py: 1.25 }}>
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600, letterSpacing: "0.04em" }} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mt: 1, px: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                sx={{ bgcolor: colors.palette[500], color: "#0a0c0b", fontWeight: 700 }}
              >
                Login
              </Button>
            </ListItem>
          </List>
        </Drawer>

        {/* Hero: full-bleed photo; headline, CTAs, and vehicles all sit on the image */}
        <Box
          component="section"
          sx={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            pt: { xs: "58px", md: "64px" },
            overflow: "hidden",
            bgcolor: "#060807",
          }}
        >
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              position: "relative",
              zIndex: 2,
              flex: 1,
              px: { xs: 0, md: 0 },
              py: { xs: 3, md: 4 },
              margin: "5rem"
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              alignItems="center"
              sx={{ flex: 1 }}
            >
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxWidth: { md: 640 },
                    py: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    data-reveal
                    sx={{
                      color: colors.palette[500],
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      mb: 1.5,
                    }}
                  >
                    Electric Mobility For Logistics
                  </Typography>
                  <Box
                    data-reveal
                    sx={{
                      height: 3,
                      width: 96,
                      bgcolor: colors.palette[500],
                      mb: 2.5,
                      animation: "lineExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
                    }}
                  />
                  <Typography
                    data-reveal
                    variant="h1"
                    sx={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 900,
                      fontSize: { xs: "2.1rem", sm: "2.75rem", md: "3.4rem" },
                      lineHeight: 0.98,
                      letterSpacing: "-0.03em",
                      mb: 2,
                      color: "#fff",
                    }}
                  >
                    <Box component="span" sx={{ display: "block", opacity: 0.96 }}>
                      AltEner
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        background: `linear-gradient(105deg, ${colors.palette[510]} 0%, ${colors.palette[500]} 45%, #8fffe0 95%)`,
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "gradientShift 6s ease infinite",
                      }}
                    >
                      Electric Cargo
                    </Box>
                    <Box component="span" sx={{ display: "block", opacity: 0.96 }}>
                      intelligence
                    </Box>
                  </Typography>
                  <Typography
                    data-reveal
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.78)",
                      maxWidth: 520,
                      mb: 2.5,
                    }}
                  >
                    Launch-ready EV cargo vehicles with built-in telematics, optimized route efficiency, and lower operating costs for growing fleets.
                  </Typography>
                  <Grid data-reveal className="reveal-delay-1" container spacing={1.25} sx={{ mb: 2.5 }}>
                    {HERO_HIGHLIGHTS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Grid item xs={12} sm={4} key={item.title}>
                          <Box
                            sx={{
                              p: 1.75,
                              height: "100%",
                              border: "1px solid rgba(228, 225, 225, 0.08)",
                              borderLeft: `3px solid ${colors.palette[500]}`,
                              bgcolor: "rgba(240, 240, 240, 0.35)",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Icon sx={{ fontSize: 18, color: colors.palette[500] }} />
                              <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                {item.title}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>{item.value}</Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box data-reveal className="reveal-delay-2" sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.78)", letterSpacing: "0.22em", display: "block", mb: 1.25, fontWeight: 600 }}>
                      LAUNCHING IN
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {[
                        { value: countdown.days, label: "DAYS" },
                        { value: countdown.hours, label: "HOURS" },
                        { value: countdown.minutes, label: "MINS" },
                        { value: countdown.seconds, label: "SECS" },
                      ].map((item, i) => (
                        <Box
                          key={item.label}
                          className="countdown-box"
                          sx={{
                            bgcolor: "rgba(134, 134, 134, 0.45)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            px: 1.75,
                            py: 1.5,
                            minWidth: 72,
                            textAlign: "center",
                            backdropFilter: "blur(8px)",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "translateY(-2px)" },
                            animation: "countdownPulse 2s ease-in-out infinite",
                            animationDelay: `${i * 0.15}s`,
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: colors.palette[500], fontVariantNumeric: "tabular-nums" }}>
                            {item.value}
                          </Typography>
                          <Typography sx={{ color: "rgba(255, 255, 255, 0.81)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.12em" }}>
                            {item.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    data-reveal
                    className="reveal-delay-3"
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: 1.5,
                      alignItems: isMobile ? "stretch" : "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      href="#register"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: colors.palette[500],
                        color: "#0a0c0b",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        px: 2.5,
                        py: 1.1,
                        "&:hover": { bgcolor: colors.palette[550], boxShadow: "0 10px 28px rgba(2,179,132,0.35)" },
                      }}
                    >
                      Book Early Access
                    </Button>
                    <Button
                      variant="outlined"
                      href="#models"
                      sx={{
                        borderColor: "rgba(255,255,255,0.4)",
                        color: "#fff",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        px: 2.5,
                        py: 1.1,
                        "&:hover": { borderColor: colors.palette[500], color: colors.palette[500], bgcolor: "rgba(255,255,255,0.06)" },
                      }}
                    >
                      Explore Models
                    </Button>
                  </Box>
                  <Box data-reveal className="reveal-delay-4" sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                    {[{ icon: GpsFixedIcon, text: "Live Fleet Tracking" }, { icon: SecurityIcon, text: "Secure Telematics" }, { icon: ElectricBoltIcon, text: "High Efficiency EV" }].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Icon sx={{ fontSize: 18, color: colors.palette[500] }} />
                          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                            {item.text}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={7}>
                <Box
                  data-reveal
                  className="reveal-delay-2"
                  sx={{
                    position: "relative",
                    minHeight: { xs: 220, sm: 260, md: 420 },
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.16)",
                    bgcolor: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 16,
                      zIndex: 2,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "rgba(0, 0, 0, 0.8)",
                      textTransform: "uppercase",
                    }}
                  >
                    Fleet preview
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%)",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      zIndex: 0,
                    }}
                  >
                    {/* Auto-scrolling vehicle strip */}
                    <Box
                      sx={{
                        display: "flex",
                        width: "300%",
                        height: "100%",
                        animation: "imageSlide 7s ease-in-out infinite",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/lite-3-bg.jpg"
                        alt="AltEner LITE electric cargo vehicle"
                        sx={{ width: "33.333%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                      />
                      <Box
                        component="img"
                        src="/assets/buzz-3-bg.jpg"
                        alt="AltEner BUZZ electric cargo vehicle"
                        sx={{ width: "33.333%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                      />
                      <Box
                        component="img"
                        src="/assets/lite-3-bg.jpg"
                        alt="AltEner LITE electric cargo vehicle"
                        sx={{ width: "33.333%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* About — band A */}
        <Box
          id="about"
          sx={{
            py: { xs: 10, md: 14 },
            px: 3,
            bgcolor: bands.even.main,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="center">
              <Grid item xs={12} lg={6}>
                <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                  About US
                </Typography>
                <Typography
                  data-reveal
                  variant="h2"
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "2.65rem" },
                    letterSpacing: "-0.03em",
                    mb: 3,
                    color: colors.palette[100],
                  }}
                >
                  Building the Future of Commercial Mobility
                </Typography>
                <Typography data-reveal sx={{ color: colors.palette[150], fontSize: "1.05rem", lineHeight: 1.7, mb: 2 }}>
                  AltEner Solutions Pvt Ltd is a Bengaluru-based electric vehicle company focused on transforming commercial transportation in India.
                </Typography>
                <Typography data-reveal sx={{ color: colors.palette[150], fontSize: "1.05rem", lineHeight: 1.7 }}>
                  Our lineup combines robust engineering with advanced technology, designed specifically for fleet operators and logistics companies.
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box
                      ref={(el) => (statRefs.current[0] = el)}
                      sx={{
                        bgcolor: colors.palette[500],
                        color: "#0a0c0b",
                        p: { xs: 2.5, md: 3.5 },
                        textAlign: "left",
                        boxShadow: "12px 12px 0 rgba(0,0,0,0.12)",
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, fontWeight: 900, lineHeight: 1 }}>
                        {statValues[0]}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.2em", opacity: 0.85 }}>
                        EMISSIONS
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      ref={(el) => (statRefs.current[1] = el)}
                      sx={{
                        bgcolor: bands.even.card,
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,20,18,0.08)",
                        p: { xs: 2.5, md: 3.5 },
                        textAlign: "left",
                        boxShadow: isDark ? "8px 8px 0 rgba(0,0,0,0.2)" : "8px 8px 0 rgba(15,20,18,0.06)",
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, fontWeight: 900, color: colors.palette[500], lineHeight: 1 }}>
                        {statValues[60]}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.palette[150], fontWeight: 700, letterSpacing: "0.18em" }}>
                        LOWER COST
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        bgcolor: bands.even.card,
                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,20,18,0.08)",
                        p: { xs: 2.5, md: 3.5 },
                        textAlign: "left",
                        boxShadow: isDark ? "8px 8px 0 rgba(0,0,0,0.2)" : "8px 8px 0 rgba(15,20,18,0.06)",
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, fontWeight: 900, color: colors.palette[500], lineHeight: 1 }}>
                        24/7
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.palette[150], fontWeight: 700, letterSpacing: "0.18em" }}>
                        CONNECTIVITY
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      ref={(el) => (statRefs.current[2] = el)}
                      sx={{
                        bgcolor: colors.palette[500],
                        color: "#0a0c0b",
                        p: { xs: 2.5, md: 3.5 },
                        textAlign: "left",
                        boxShadow: "12px 12px 0 rgba(0,0,0,0.12)",
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, fontWeight: 900, lineHeight: 1 }}>
                        {statValues[2]}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.2em", opacity: 0.85 }}>
                        MODELS
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Models — band B */}
        <ModelsSection shellBg={bands.odd.main} cardBg={bands.odd.card} wellBg={bands.odd.well} />

        {/* Benefits — band A */}
        <Box
          id="benefits"
          sx={{
            py: { xs: 10, md: 14 },
            px: 3,
            bgcolor: bands.even.main,
          }}
        >
          <Container maxWidth="90%">
            <Box sx={{ textAlign: "center", mb: { xs: 6, md: 9 }, maxWidth: 720, mx: "auto" }}>
              <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                Fleet advantages
              </Typography>
              <Typography
                data-reveal
                className="reveal-delay-1"
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.65rem" },
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#0a0c0b",
                }}
              >
                Built for commercial electric mobility
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { title: "Lower Running Costs", desc: "Save up to 60% on fuel costs compared to diesel vehicles.", icon: "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" },
                { title: "Government Subsidies", desc: "Eligible for FAME-II incentives and state tax benefits.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { title: "Zero Emissions", desc: "Clean, green transportation for a sustainable future.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { title: "Low Maintenance", desc: "Fewer moving parts mean lower service costs and downtime.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
              ].map((item, i) => (
                <Grid item xs={12} sm={6} lg={3} key={item.title}>
                  <Box
                    data-reveal
                    className={`reveal-delay-${i + 1}`}
                    sx={{
                      height: "100%",
                      bgcolor: bands.even.card,
                      p: 3,
                      textAlign: "left",
                      borderLeft: `4px solid ${colors.palette[500]}`,
                      transition: "transform 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: isDark ? "0 12px 28px rgba(0,0,0,0.35)" : "0 12px 28px rgba(10,20,18,0.08)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: bands.even.specChip,
                        color: colors.palette[110],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Box component="svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d={item.icon} />
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: "1.18rem", md: "1.26rem" }, mb: 1, letterSpacing: "-0.02em", color: isDark ? "#ffffff" : "#0a0c0b" }}>{item.title}</Typography>
                    <Typography sx={{ color: isDark ? "rgba(255, 255, 255, 0.67)" : "#3d4a45", fontSize: { xs: "1.02rem", md: "1.08rem" }, lineHeight: 1.2 }}>{item.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ROI Calculator — band B */}
        <Box
          id="calculator"
          sx={{
            py: { xs: 10, md: 14 },
            px: 3,
            bgcolor: bands.odd.main,
            color: isDark ? "#ffffff" : "#0a0c0b",
            "& .MuiInputBase-input": { color: `${isDark ? "#ffffff" : "#0a0c0b"} !important` },
            "& .MuiInputLabel-root": { color: `${isDark ? "rgba(255,255,255,0.65)" : "#5a6662"} !important` },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: `${isDark ? "rgba(255,255,255,0.2)" : "rgba(10,12,11,0.2)"} !important`,
            },
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
              <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                Savings Calculator
              </Typography>
              <Typography
                data-reveal
                className="reveal-delay-1"
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.65rem" },
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#0a0c0b",
                }}
              >
                Calculate Your Savings
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  data-reveal
                  className="reveal-delay-2"
                  sx={{
                    bgcolor: bands.odd.card,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(10,12,11,0.1)"}`,
                    p: { xs: 2.5, md: 3.5 },
                    height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.3)" : "0 12px 32px rgba(10,20,18,0.08)" },
                  }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 3, letterSpacing: "0.06em", fontSize: "0.8rem", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.55)" : "#5a6662" }}>
                    Enter Your Details
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: isDark ? "rgba(255,255,255,0.7)" : "#3d4a45", mb: 1 }}>
                      Daily Running Distance (km)
                    </Typography>
                    <Slider
                      value={dailyKm}
                      onChange={(_, v) => setDailyKm(v)}
                      min={50}
                      max={200}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(v) => `${v} km`}
                      sx={{ color: colors.palette[500], "& .MuiSlider-thumb": { bgcolor: colors.palette[500] } }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: isDark ? "rgba(255,255,255,0.55)" : "#5a6662" }}>
                      <span>50 km</span>
                      <span style={{ fontWeight: 600, color: colors.palette[500] }}>{dailyKm} km</span>
                      <span>200 km</span>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="Fleet Size"
                    type="number"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 1, max: 100 }}
                  />
                  <TextField
                    fullWidth
                    label="Current Fuel Cost (Rs/litre)"
                    type="number"
                    value={fuelCost}
                    onChange={(e) => setFuelCost(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Vehicle Mileage (km/litre)"
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCalculateSavings}
                    sx={{
                      bgcolor: colors.palette[500],
                      transition: "all 0.3s ease",
                      "&:hover": { bgcolor: colors.palette[550], transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(2, 179, 132, 0.4)" },
                    }}
                  >
                    Calculate Savings
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  data-reveal
                  className="reveal-delay-2"
                  sx={{
                    bgcolor: colors.palette[500],
                    color: "#0a0c0b",
                    p: { xs: 2.5, md: 3.5 },
                    height: "100%",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(2,179,132,0.25)" },
                  }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 3, letterSpacing: "0.06em", fontSize: "0.8rem", textTransform: "uppercase", color: "#0a0c0b", opacity: 0.85 }}>
                    Your Estimated Savings
                  </Typography>
                  <Box sx={{ bgcolor: "#0a0c0b", color: "#ffffff", p: 2, mb: 2, borderLeft: `3px solid ${colors.palette[1200]}` }}>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mb: 0.5, fontWeight: 600 }}>Monthly Fuel Cost (Current)</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.45rem", color: "#ffffff" }}>{savings.current}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#0a0c0b", color: "#ffffff", p: 2, mb: 2, borderLeft: `3px solid ${colors.palette[1200]}` }}>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mb: 0.5, fontWeight: 600 }}>Monthly Electricity Cost (AltEner)</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.45rem", color: "#ffffff" }}>{savings.altener}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#ffffff", color: "#0a0c0b", p: 2.5, border: "2px solid #0a0c0b" }}>
                    <Typography variant="body2" sx={{ color: "#5a6662", mb: 0.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                      Monthly Savings
                    </Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.02em", color: colors.palette[500] }}>{savings.monthly}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features — band A */}
        <Box
          id="features"
          sx={{
            py: { xs: 10, md: 14 },
            px: 3,
            bgcolor: bands.even.main,
          }}
        >
          <Container maxWidth="70%">
            <Box sx={{ textAlign: "center", mb: { xs: 6, md: 9 }, maxWidth: 700, mx: "auto" }}>
              <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                Key Features
              </Typography>
              <Typography
                data-reveal
                className="reveal-delay-1"
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.65rem" },
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#0a0c0b",
                }}
              >
                Smart & Commercially Engineered
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { title: "LiFePO4 Battery", desc: "Advanced lithium iron phosphate technology for extended life and safety.", icon: BatteryChargingFullIcon },
                { title: "PMSM Motor", desc: "High torque permanent magnet synchronous motor for demanding loads.", icon: ElectricBoltIcon },
                { title: "GPS & LTE Tracking", desc: "Real-time vehicle tracking for complete fleet visibility.", icon: GpsFixedIcon },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Grid item xs={12} md={4} key={item.title}>
                    <Box
                      data-reveal
                      className={`reveal-scale reveal-delay-${i + 1}`}
                      sx={{
                        bgcolor: bands.even.card,
                        p: { xs: 2.5, md: 3.5 },
                        minHeight: { md: 240 },
                        border: isDark ? "2px solid rgba(255,255,255,0.1)" : "1px solid rgba(10,12,11,0.08)",
                        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                        "&:hover": {
                          borderColor: colors.palette[500],
                          transform: "translateY(-8px)",
                          "& .feature-icon": { bgcolor: colors.palette[500], color: "#0a0c0b" },
                        },
                      }}
                    >
                      <Box
                        className="feature-icon"
                        sx={{
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: bands.even.specChip,
                          color: colors.palette[110],
                          mb: 2.5,
                          transition: "transform 0.35s ease, background-color 0.35s ease, color 0.35s ease",
                        }}
                      >
                        <Icon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: "1.18rem", md: "1.26rem" }, mb: 1, letterSpacing: "-0.02em", color: isDark ? "#ffffff" : "#0a0c0b" }}>{item.title}</Typography>
                      <Typography sx={{ color: isDark ? "rgba(255,255,255,0.72)" : "#3d4a45", fontSize: "1.08rem", lineHeight: 1.2 }}>{item.desc}</Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* FAQ — band B */}
        <Box
          id="faq"
          sx={{
            bgcolor: bands.odd.main,
            py: { xs: 10, md: 14 },
            px: 3,
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
              <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                FAQ
              </Typography>
              <Typography
                data-reveal
                className="reveal-delay-1"
                variant="h2"
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.65rem" },
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#0a0c0b",
                }}
              >
                Common Questions
              </Typography>
            </Box>
            <Box sx={{ bgcolor: bands.odd.card, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(10,12,11,0.1)" }}>
              {[
                { q: "What is the expected warranty period?", a: "We offer a comprehensive 3-year warranty on the vehicle and 3-year/50,000 km warranty on the battery." },
                { q: "What is the charging time?", a: "Standard charging takes just 3-4 hours. Fast charging options can reduce this to approximately 1.5 hours." },
                { q: "Are financing options available?", a: "Yes, we have partnerships with leading banks and NBFCs for attractive financing options." },
                { q: "When will the vehicles be available?", a: "We are targeting Q2 2025 for commercial launch. Register now to be among the first to receive updates." },
              ].map((faq, i) => (
                <Accordion
                  key={faq.q}
                  expanded={expandedFaq === `panel${i}`}
                  onChange={(_, exp) => setExpandedFaq(exp ? `panel${i}` : false)}
                  sx={{
                    boxShadow: "none",
                    bgcolor: "transparent",
                    borderBottom: i < 3 ? `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(10,12,11,0.1)"}` : "none",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": { margin: 0 },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: "1.5rem", color: colors.palette[500] }} />}>
                    <Typography sx={{ fontWeight: 400, fontSize: "1.05rem", letterSpacing: "-0.01em", pr: 1, color: isDark ? "#ffffff" : "#0a0c0b" }}>{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                    <Typography sx={{ color: isDark ? "rgba(255,255,255,0.72)" : "#3d4a45", fontSize: "0.95rem", lineHeight: 1.65 }}>{faq.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Contact — band A */}
        <Box
          id="contact"
          sx={{
            py: { xs: 10, md: 14 },
            px: 3,
            bgcolor: bands.even.main,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="stretch">
              <Grid item xs={12} lg={6}>
                <Typography data-reveal sx={{ color: colors.palette[510], fontSize: 15, letterSpacing: "0.15em", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                  Contact Us
                </Typography>
                <Typography
                  data-reveal
                  className="reveal-delay-1"
                  variant="h2"
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "2.65rem" },
                    letterSpacing: "-0.03em",
                    mb: 3,
                    color: isDark ? "#ffffff" : "#0a0c0b",
                  }}
                >
                  Get in Touch
                </Typography>
                <Typography data-reveal className="reveal-delay-2" sx={{ color: isDark ? "rgba(255,255,255,0.72)" : "#3d4a45", fontSize: "1.1rem", lineHeight: 1.6, mb: 3 }}>
                  Ready to electrify your fleet? Have questions about our upcoming launch? We'd love to hear from you.
                </Typography>
                <Box data-reveal className="reveal-delay-2" sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: bands.even.card, color: colors.palette[500], display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.palette[500]}`, transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.08)" } }}>
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: isDark ? "rgba(255,255,255,0.55)" : "#5a6662", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, letterSpacing: 1 }}>Phone</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: isDark ? "#ffffff" : "#0a0c0b" }}>+91 80 0000 0000</Typography>
                  </Box>
                </Box>
                <Box data-reveal className="reveal-delay-2" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: bands.even.card, color: colors.palette[500], display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.palette[500]}`, transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.08)" } }}>
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: isDark ? "rgba(255,255,255,0.55)" : "#5a6662", textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, letterSpacing: 1 }}>Email</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: isDark ? "#ffffff" : "#0a0c0b" }}>info@altener.in</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box
                  data-reveal
                  className="reveal-delay-2"
                  sx={{
                    bgcolor: bands.even.card,
                    height: "100%",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(10,12,11,0.1)",
                    p: { xs: 2.5, md: 4 },
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.25)" : "0 8px 24px rgba(10,20,18,0.06)" },
                  }}
                >
                  <Box sx={{ width: 40, height: 3, bgcolor: colors.palette[500], mb: 2 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "1.15rem", mb: 3, letterSpacing: "-0.02em", color: isDark ? "#ffffff" : "#0a0c0b" }}>Send us a message</Typography>
                  <Box component="form" action="https://formspree.io/f/YOUR_ID_HERE" method="POST" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField name="name" placeholder="Your Name" required fullWidth />
                    <TextField name="email" type="email" placeholder="Your Email" required fullWidth />
                    <TextField name="message" placeholder="Your Message" multiline rows={4} required fullWidth />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: colors.palette[500],
                        transition: "all 0.3s ease",
                        "&:hover": { bgcolor: colors.palette[550], transform: "translateY(-2px)", boxShadow: 2 },
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer — always dark slab, light type */}
        <Box
          component="footer"
          data-reveal
          sx={{
            bgcolor: "#050807",
            py: { xs: 6, md: 8 },
            px: 3,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} md={7}>
                <Box sx={{ width: 40, height: 3, bgcolor: "#888", mb: 2, mx: { xs: "auto", md: 0 } }} />
                <Typography
                  sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    letterSpacing: "0.1em",
                    mb: 1.5,
                    color: "#ffffff",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  <Box component="span" sx={{ color: colors.palette[500] }}>Alt</Box>Ener
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 15,
                    lineHeight: 1.65,
                    maxWidth: 400,
                    mx: { xs: "auto", md: 0 },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Smart energy solutions for commercial electric mobility.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.71)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    textAlign: { xs: "center", md: "right" },
                  }}
                >
                  © 2026 AltEner Solutions Pvt Ltd.
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 254, 254, 0.64)",
                    fontSize: 11,
                    mt: 0.5,
                    textAlign: { xs: "center", md: "right" },
                  }}
                >
                  All rights reserved.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}
