/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Button, Card, CardContent, Typography, Box, Container, Chip, IconButton,
  Grid2 as Grid, Tab, Tabs, Paper, List, ListItem, ListItemIcon, ListItemText,
  Stack, useTheme, useMediaQuery, TextField, Alert, Snackbar, MenuItem,
  Accordion, AccordionSummary, AccordionDetails, Collapse, Link, Divider,
  Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, AppBar, Toolbar, Drawer, ListItemButton,
  useScrollTrigger, ThemeProvider, createTheme, CssBaseline,
} from "@mui/material";
import {
  motion, useMotionValue, useTransform, AnimatePresence, useInView, useSpring,
} from "framer-motion";
import * as MuiIcons from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoltIcon from "@mui/icons-material/Bolt";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";

import {
  navLinks,
  heroSlides,
  vehicleModels,
  featureHighlights,
  technologyData,
  techEcosystem,
  detailedSpecs,
  statsData,
  faqData,
  aboutContent,
  connectivityData
} from "../data";

import CustomButton from "../components/CustomButton";
import FeatureCard from "../components/FeatureCard";
import SectionHeading from "../components/SectionHeading";
import SectionWrapper from "../components/SectionWrapper";
import VehicleCard from "../components/VehicleCard";
import VehicleShowcase360 from "../components/VehicleShowcase360";

const FeatureAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Custom Parallax for Image Pane
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureHighlights.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timerRef.current);
  }, [isPaused, activeIndex]);

  const handleManualSelect = (index) => {
    setActiveIndex(index);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <SectionWrapper
      id="features"
      dark
      sx={{
        backgroundColor: "#051024",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(56,182,255,0.15) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: "#ffffff",
            textShadow: "0 0 30px rgba(56,182,255,0.3)",
          }}
        >
          Performance & Reliability
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#8aa6c1", fontWeight: 500, maxWidth: 700, mx: "auto" }}
        >
          Engineered to reduce your operating costs and maximise uptime.
        </Typography>
      </Box>

      <Grid container spacing={6} alignItems="center">
        {/* Left Side: Accordion Story Mode */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {featureHighlights.map((feature, index) => {
              const Icon = Icons[feature.icon] || Icons.Star;
              const isActive = activeIndex === index;

              return (
                <Box
                  key={feature.title}
                  onClick={() => handleManualSelect(index)}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    borderRadius: "20px",
                    backgroundColor: isActive
                      ? "rgba(0,136,246,0.15)"
                      : "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(10px)",
                    border: isActive
                      ? "1px solid rgba(56,182,255,0.5)"
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isActive
                      ? "0 12px 32px rgba(0,136,246,0.15)"
                      : "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(0,136,246,0.2)"
                        : "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {/* Story Progress Bar */}
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #38b6ff, #0088f6)",
                      }}
                    />
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        backgroundColor: isActive
                          ? "#0088f6"
                          : "rgba(0,136,246,0.1)",
                        color: isActive ? "#fff" : "#0088f6",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Icon fontSize="medium" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: isActive ? "#ffffff" : "#8aa6c1",
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>

                  <Collapse in={isActive}>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        ml: { xs: 0, sm: 8 },
                        color: "#8aa6c1",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Grid>

        {/* Right Side: Parallax Media Pane */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{
              perspective: 1000,
              width: "100%",
              height: { xs: 300, sm: 400, md: 500 },
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                rotateX,
                rotateY,
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                backgroundColor: "rgba(0,0,0,0.4)",
                boxShadow:
                  "inset 0 0 80px rgba(0,136,246,0.1), 0 20px 60px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(56,182,255,0.2)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Premium Glow */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  height: "80%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(56,182,255,0.2) 0%, transparent 70%)",
                  zIndex: 0,
                }}
              />

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={featureHighlights[activeIndex].image}
                  alt={featureHighlights[activeIndex].title}
                  initial={{ opacity: 0, scale: 0.9, z: -50 }}
                  animate={{ opacity: 1, scale: 1, z: 50 }}
                  exit={{ opacity: 0, scale: 1.1, z: 100 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "relative",
                    zIndex: 1,
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                  }}
                />
              </AnimatePresence>

              {/* TVS-style Dot Navigation Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  zIndex: 2,
                  display: "flex",
                  gap: 1,
                }}
              >
                {featureHighlights.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleManualSelect(idx)}
                    sx={{
                      width: activeIndex === idx ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        activeIndex === idx ? "#0088f6" : "rgba(0,136,246,0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Box>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};

export default FeatureAccordion;
