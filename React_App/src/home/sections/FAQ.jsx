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
 * FAQ – Deep blue gradient with glassmorphism accordion cards
 */
const FAQ = () => {
  return (
    <SectionWrapper
      id="faq"
      dark
      sx={{
        background:
          "linear-gradient(160deg, #002b54 0%, #003b73 40%, #004488 70%, #003366 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "30%",
          right: "-15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,182,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "pulse-glow 8s ease-in-out infinite",
        },
      }}
    >
      <SectionHeading
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about AltEner electric vehicles."
        light
      />
      {faqData.map((item, index) => (
        <Accordion
          key={index}
          disableGutters
          sx={{
            maxWidth: 800,
            mx: "auto",
            backgroundColor: "rgba(56,182,255,0.06)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(56,182,255,0.12)",
            color: "#fff",
            borderRadius: "14px !important",
            mb: 1.5,
            "&:hover": {
              backgroundColor: "rgba(56,182,255,0.12)",
              borderColor: "rgba(56,182,255,0.35)",
              boxShadow: "0 4px 24px rgba(0,136,246,0.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#38b6ff" }} />}
            sx={{ px: 3, py: 1, "& .MuiAccordionSummary-content": { my: 1.5 } }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#fff" }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, pb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}
            >
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </SectionWrapper>
  );
};

export default FAQ;

