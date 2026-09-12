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

import CustomButton from "./CustomButton";
import FeatureCard from "./FeatureCard";
import SectionWrapper from "./SectionWrapper";
import VehicleCard from "./VehicleCard";
import VehicleShowcase360 from "./VehicleShowcase360";
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


/**
 * SectionHeading – Consistent heading with animated gradient underline
 */
const SectionHeading = ({
  title,
  subtitle,
  light = false,
  align = "center",
}) => {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 5, md: 7 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            color: light ? "#FFFFFF" : "#0088f6",
            mb: 1.5,
            textShadow: light ? "0 2px 12px rgba(0,0,0,0.2)" : "none",
            fontWeight: 900,
          }}
        >
          {title}
        </Typography>
      </motion.div>

      {/* Animated gradient underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          originX: align === "center" ? 0.5 : 0,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #38b6ff, #0088f6, #0077c0)",
            backgroundSize: "200% 100%",
            animation: "gradient-shift 3s ease infinite",
            mx: align === "center" ? "auto" : 0,
            mb: 2,
          }}
        />
      </motion.div>

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: 600,
              mx: align === "center" ? "auto" : 0,
              color: light ? "rgba(255,255,255,0.75)" : "#4a6a8a",
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            {subtitle}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default SectionHeading;

