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
 * SectionWrapper – Reusable section container with scroll animation
 * Provides consistent padding, optional dark bg, and fade-in-up animation
 */
const SectionWrapper = ({
  children,
  id,
  dark = false,
  sx = {},
  maxWidth = "lg",
  disableContainer = false,
  noPadding = false,
}) => {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: noPadding ? 0 : { xs: 8, md: 12 },
        px: noPadding ? 0 : { xs: 2, md: 0 },
        backgroundColor: dark ? "#001a33" : "transparent",
        color: dark ? "#FFFFFF" : "inherit",
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {disableContainer ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.div>
      ) : (
        <Container maxWidth={maxWidth}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </Container>
      )}
    </Box>
  );
};

export default SectionWrapper;

