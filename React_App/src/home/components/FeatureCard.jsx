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
import SectionHeading from "./SectionHeading";
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
 * FeatureCard – Glassmorphism card with gradient icon badge and animated hover
 */
const MotionCard = motion.create(Card);

const FeatureCard = ({ icon, title, description, index = 0, dark = false }) => {
  const IconComponent = MuiIcons[icon] || MuiIcons.Star;

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      elevation={0}
      sx={{
        p: 1,
        height: "100%",
        textAlign: "center",
        backgroundColor: dark ? "#01609a69" : "#f6fcffff",
        backdropFilter: "blur(12px)",
        border: dark
          ? "1px solid rgba(60, 182, 253, 0.52)"
          : "1px solid #89ccf3ff",
        boxShadow: dark
          ? "0 4px 20px rgba(0,0,0,0.2)"
          : "0 4px 20px rgba(0,100,200,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: dark
            ? "rgba(56,182,255,0.08)"
            : "rgba(255,255,255,0.9)",
          borderColor: "#38b6ff",
          transform: "translateY(-6px)",
          boxShadow: dark
            ? "0 12px 40px rgba(0,136,246,0.2)"
            : "0 12px 40px rgba(0,136,246,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
            background: dark
              ? "linear-gradient(135deg, rgba(56,182,255,0.2), rgba(0,136,246,0.1))"
              : "linear-gradient(135deg, #38b6ff, #0088f6)",
            boxShadow: dark
              ? "0 4px 16px rgba(56,182,255,0.15)"
              : "0 6px 20px rgba(0,136,246,0.25)",
          }}
        >
          <IconComponent
            sx={{ fontSize: 30, color: dark ? "#38b6ff" : "#fff" }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: dark ? "#fff" : "#0a1e3d",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: dark ? "rgba(255,255,255,0.65)" : "#4a6a8a",
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

export default FeatureCard;

