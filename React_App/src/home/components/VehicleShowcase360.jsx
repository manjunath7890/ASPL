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
import VehicleCard from "./VehicleCard";
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
 * VehicleShowcase360
 * A component designed to display a 360-degree rotating view of a vehicle.
 * Note: Designed to accept an array of 360 frames. If only 1 image is provided,
 * it falls back to a pseudo-3D perspective tilt to provide interactive depth.
 */
const VehicleShowcase360 = ({ images = [], altText = "Vehicle" }) => {
  // If we have an actual 360 image sequence
  const hasSequence = images.length > 1;
  const [frameIndex, setFrameIndex] = useState(0);

  // Motion values for pseudo-3D fallback
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDrag = (event, info) => {
    if (hasSequence) {
      // Logic for swapping images based on drag
      const delta = info.offset.x;
      const sensitivity = 5; // pixels per frame
      let newIndex = Math.floor(delta / sensitivity) % images.length;
      if (newIndex < 0) newIndex += images.length;
      setFrameIndex(newIndex);
    }
  };

  const displayImage = hasSequence ? images[frameIndex] : images[0];

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 300, md: 450 },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.02)",
        overflow: "hidden",
        perspective: 1000,
      }}
    >
      {/* Background glowing orb for premium feel */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(56,182,255,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* The 3D Stage / Turntable */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 40, md: 60 },
          width: "70%",
          height: { xs: 40, md: 70 },
          border: "2px solid rgba(0,136,246,0.2)",
          borderRadius: "50%",
          backgroundColor: "rgba(0,136,246,0.02)",
          boxShadow: "0 10px 30px rgba(0,136,246,0.1)",
          pointerEvents: "none",
          transform: "rotateX(75deg)",
        }}
      />

      {/* The Interactive Vehicle Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={hasSequence ? 0 : 0.1}
        onDrag={handleDrag}
        style={{
          x: hasSequence ? 0 : x,
          rotateY: hasSequence ? 0 : rotateY,
          scale: hasSequence ? 1 : scale,
          cursor: "grab",
          width: "80%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={altText}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
        ) : (
          <Typography color="textSecondary">No image available</Typography>
        )}
      </motion.div>

      {/* 360 Indicator Badge */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          px: 2,
          py: 0.8,
          borderRadius: "20px",
          border: "1px solid rgba(0,136,246,0.2)",
          color: "#004488",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <ThreeSixtyIcon fontSize="small" sx={{ color: "#0088f6" }} />
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: 0.5 }}
        >
          DRAG TO ROTATE
        </Typography>
      </Box>
    </Box>
  );
};

export default VehicleShowcase360;

