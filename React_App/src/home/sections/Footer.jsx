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
 * Footer – Company links, social icons, and copyright
 * Deep navy background
 */
const Footer = () => {
  const footerLinks = {
    Company: ["About Us", "Careers", "Press", "Blog"],
    Products: ["BUZZ", "LITE", "Fleet Solutions", "Accessories"],
    Support: ["Service Centres", "Warranty", "Contact", "FAQ"],
    Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
  };

  const socialIcons = [
    { icon: <LinkedInIcon />, href: "#" },
    { icon: <TwitterIcon />, href: "#" },
    { icon: <InstagramIcon />, href: "#" },
    { icon: <YouTubeIcon />, href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #002b54, #001122)",
        color: "#fff",
        pt: { xs: 6, md: 8 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}
            >
              <BoltIcon sx={{ color: "#38b6ff", fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Alt<span style={{ color: "#38b6ff" }}>Ener</span>
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.5)",
                mb: 3,
                maxWidth: 280,
                lineHeight: 1.7,
              }}
            >
              Powering India's last-mile revolution with zero-emission electric
              cargo vehicles.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialIcons.map((s, i) => (
                <IconButton
                  key={i}
                  href={s.href}
                  target="_blank"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    "&:hover": {
                      color: "#38b6ff",
                      backgroundColor: "rgba(56,182,255,0.1)",
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={title}>
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  letterSpacing: 2,
                  display: "block",
                  mb: 2,
                }}
              >
                {title}
              </Typography>
              {links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  underline="none"
                  sx={{
                    display: "block",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    mb: 1.2,
                    transition: "color 0.2s",
                    "&:hover": { color: "#38b6ff" },
                  }}
                >
                  {link}
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.35)" }}
          >
            Â© {new Date().getFullYear()} AltEner Technologies Pvt. Ltd. All
            rights reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.35)" }}
          >
            Made with âš¡ in India
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

