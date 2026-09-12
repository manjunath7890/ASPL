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
 * Contact – Soft gradient blue with glassmorphism form card
 */
const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    message: "",
  });
  const [snackOpen, setSnackOpen] = useState(false);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Chandigarh",
    "Puducherry",
  ];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackOpen(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      state: "",
      city: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon sx={{ color: "#fff" }} />,
      label: "Address",
      value: "AltEner Solutions Pvt. Ltd.\nBengaluru, Karnataka, India",
    },
    {
      icon: <PhoneIcon sx={{ color: "#fff" }} />,
      label: "Phone",
      value: "+91 80 1234 5678",
    },
    {
      icon: <EmailIcon sx={{ color: "#fff" }} />,
      label: "Email",
      value: "hello@altener.in",
    },
  ];

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(6px)",
      "& fieldset": { borderColor: "rgba(0,136,246,0.15)" },
      "&:hover fieldset": { borderColor: "#38b6ff" },
      "&.Mui-focused fieldset": { borderColor: "#0088f6" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0088f6" },
  };

  return (
    <SectionWrapper
      id="contact"
      sx={{
        background:
          "linear-gradient(160deg, #cce6ff 0%, #b8ddff 40%, #dff0ff 70%, #c5e3ff 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,136,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <SectionHeading
        title="Get in Touch"
        subtitle="Have questions? Want to schedule a test drive? We'd love to hear from you."
      />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "24px",
                backgroundColor: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              }}
            >
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  >
                    {indianStates.map((s) => (
                      <MenuItem key={s} value={s}>
                         {s}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomButton
                    type="submit"
                    sx={{
                      backgroundColor: "#0088f6",
                      color: "#fff",
                      px: 5,
                      py: 1.5,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      "&:hover": {
                        backgroundColor: "#0077c0",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    Send Message
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3.5,
                pt: { md: 4 },
              }}
            >
              {contactInfo.map((info) => (
                <Box key={info.label} sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#0088f6",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#5a7a9a",
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        display: "block",
                        mb: 0.3,
                      }}
                    >
                      {info.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1a3a5c",
                        whiteSpace: "pre-line",
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      {info.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                mt: 4,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,136,246,0.12)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: 200,
              }}
            >
              <iframe
                title="AltEner Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497511.2348503742!2d77.30126189778032!3d12.954517017076847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </Box>
          </motion.div>
        </Grid>
      </Grid>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{
            backgroundColor: "#0088f6",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
            borderRadius: "12px",
          }}
        >
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </SectionWrapper>
  );
};

export default Contact;
