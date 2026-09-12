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
import SectionHeading from "./SectionHeading";
import SectionWrapper from "./SectionWrapper";
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
 * VehicleCard – Premium card with gradient overlay and hover animations
 */
const MotionCard = motion.create(Card);

const VehicleCard = ({
  variant,
  modelName,
  onClick,
  index = 0,
  dark = false,
}) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      elevation={0}
      sx={{
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        border: dark
          ? "1px solid rgba(56,182,255,0.3)"
          : "1px solid rgba(0,0,0,0.08)",
        borderRadius: "20px",
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,100,200,0.06)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "#38b6ff",
          boxShadow: dark
            ? "0 16px 48px rgba(0,136,246,0.3)"
            : "0 16px 48px rgba(0,136,246,0.15)",
          transform: "translateY(-6px)",
        },
        "&:hover .card-overlay": { opacity: 1 },
        "&:hover .card-image": { transform: "scale(1.05)" },
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          height: 260,
          flexShrink: 0,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Box
          className="card-image"
          role="img"
          aria-label={`${modelName} ${variant.name}`}
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${variant.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "multiply",
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        <Box
          className="card-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
            opacity: 0,
            transition: "opacity 0.4s ease",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#0088f6", fontWeight: 700, letterSpacing: 1 }}
          >
            VIEW DETAILS →
          </Typography>
        </Box>
      </Box>
      <CardContent
        sx={{ textAlign: "center", py: 2.5, backgroundColor: "#ffffff" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0a1e3d" }}>
            {modelName}
          </Typography>
          <Chip
            label={variant.name}
            size="small"
            sx={{
              background: "rgba(0,136,246,0.1)",
              color: "#0077c0",
              fontWeight: 700,
              fontSize: "0.75rem",
              border: "1px solid rgba(0,136,246,0.2)",
            }}
          />
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default VehicleCard;
