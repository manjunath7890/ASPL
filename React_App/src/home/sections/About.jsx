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

/**
 * About – Rich layered light-blue with depth
 */
const About = () => {
  return (
    <SectionWrapper
      id="about"
      sx={{
        background:
          "linear-gradient(135deg, #dff0ff 0%, #b8ddff 50%, #d6ebff 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "20%",
          left: "-8%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,136,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <SectionHeading
        title="About AltEner"
        subtitle="Pioneering electric commercial mobility in India."
      />
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "1.5rem", md: "2rem" },
                color: "#0a1e3d",
              }}
            >
              {aboutContent.title}
            </Typography>
            {aboutContent.paragraphs.map((para, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{ color: "#3a5a7a", mb: 2.5, lineHeight: 1.8 }}
              >
                {para}
              </Typography>
            ))}
          </motion.div>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(0,136,246,0.1), rgba(56,182,255,0.04))",
                  border: "1px solid rgba(0,136,246,0.18)",
                  boxShadow: "0 8px 32px rgba(0,100,200,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #38b6ff, #0088f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VisibilityIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#0a1e3d" }}
                  >
                    Our Vision
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#3a5a7a", lineHeight: 1.8 }}
                >
                  {aboutContent.vision}
                </Typography>
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #001a33 0%, #003366 50%, #004080 100%)",
                  color: "#fff",
                  boxShadow: "0 12px 40px rgba(0,26,51,0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-50%",
                    right: "-30%",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(56,182,255,0.15) 0%, transparent 70%)",
                    pointerEvents: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #38b6ff, #0077c0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RocketLaunchIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#fff" }}
                  >
                    Our Mission
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.8,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {aboutContent.mission}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};

export default About;

