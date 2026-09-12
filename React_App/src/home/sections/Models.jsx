/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Chip,
  IconButton,
  Grid2 as Grid,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
  useMediaQuery,
  TextField,
  Alert,
  Snackbar,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  useScrollTrigger,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useInView,
  useSpring,
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
  connectivityData,
} from "../data";

import CustomButton from "../components/CustomButton";
import FeatureCard from "../components/FeatureCard";
import SectionHeading from "../components/SectionHeading";
import SectionWrapper from "../components/SectionWrapper";
import VehicleCard from "../components/VehicleCard";
import VehicleShowcase360 from "../components/VehicleShowcase360";

const Models = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Flatten all variants from models into a single array for easy tab navigation
  const allVariants = vehicleModels.flatMap((model) =>
    model.variants.map((variant) => ({
      ...variant,
      modelName: model.name,
      tagline: model.tagline,
    })),
  );

  const [activeTab, setActiveTab] = useState(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const activeVariant = allVariants[activeTab];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <SectionWrapper
      id="models"
      sx={{
        background:
          "linear-gradient(160deg, #cce6ff 0%, #b8ddff 40%, #dff0ff 70%, #c5e3ff 100%)",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
      }}
    >
      <SectionHeading
        title="Our Models"
        subtitle="Explore our purpose-built electric cargo vehicles."
      />

      {/* Tabs Navigation for Variants */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 6,
          maxWidth: "100%",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          centered={!isMobile}
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#5a7a9a",
              textTransform: "none",
              px: { xs: 2, md: 4 },
            },
            "& .Mui-selected": {
              color: "#0088f6 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#0088f6",
              height: "3px",
            },
          }}
        >
          {allVariants.map((variant) => (
            <Tab
              key={variant.id}
              label={`${variant.modelName} ${variant.name}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Split View Content */}
      <Grid container spacing={6} alignItems="center">
        {/* Left Side: Image / 360 Showcase */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              borderRadius: "2rem",
              p: 0,
              border: "1px solid rgba(0, 136, 246, 0.1)",
              boxShadow: "0 20px 50px rgba(0, 43, 84, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: { xs: 330, sm: 430, md: 580 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeVariant.id}
                src={activeVariant.image}
                alt={activeVariant.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </AnimatePresence>
          </Box>
        </Grid>

        {/* Right Side: Details & Specs */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ pl: { md: 4 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#0a1e3d",
                mb: 1,
                fontSize: { xs: "2.5rem", md: "3rem" },
              }}
            >
              {activeVariant.modelName}{" "}
              <span style={{ color: "#0088f6" }}>{activeVariant.name}</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#5a7a9a", mb: 5, fontWeight: 500, lineHeight: 1.4 }}
            >
              {activeVariant.tagline}
            </Typography>

            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: "#0088f6",
                display: "block",
                letterSpacing: 2,
              }}
            >
              Core Performance Specs
            </Typography>

            {/* Row 1: range, payload, charging */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {["range", "payload", "charging"].map((key) => {
                const val = activeVariant.specs[key];
                return (
                  <Grid size={{ xs: 6, sm: 4 }} key={key}>
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: "#a1ceff", // Light Blue Accent BG
                        border: "1px solid #6eb8f5ff",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        height: "100%",
                        width: "100%",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "#e0efff",
                          borderColor: "#0088f6",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 24px rgba(0, 136, 246, 0.08)",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          mb: 0.5,
                          letterSpacing: 0.5,
                        }}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          color: "#0a1e3d",
                          fontSize: "1.05rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {val}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Row 2: topSpeed, battery, motor */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {["topSpeed", "battery", "motor"].map((key) => {
                const val = activeVariant.specs[key];
                return (
                  <Grid size={{ xs: 6, sm: 4 }} key={key}>
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: "#a1ceff", // Light Blue Accent BG
                        border: "1px solid #6eb8f5ff",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        height: "100%",
                        width: "100%",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "#e0efff",
                          borderColor: "#0088f6",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 24px rgba(0, 136, 246, 0.08)",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          mb: 0.5,
                          letterSpacing: 0.5,
                        }}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          color: "#0a1e3d",
                          fontSize: "1.05rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {val}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* <Divider sx={{ my: 4, borderColor: "#e0eaf5" }} /> */}

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#0a1e3d" }}
            >
              Premium Capabilities
            </Typography>
            <List dense disablePadding sx={{ mb: 4 }}>
              {activeVariant.features.map((feat, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: "#0088f6", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feat}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      color: "#334e68",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <CustomButton
                onClick={() => {
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                sx={{
                  backgroundColor: "#0088f6",
                  color: "#fff",
                  px: 4,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#006bb3" },
                }}
              >
                Configure & Book
              </CustomButton>
              <CustomButton
                variant="outlined"
                onClick={() => setIsSpecsOpen(true)}
                sx={{
                  borderColor: "#0a1e3d",
                  color: "#0a1e3d",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#0088f6",
                    color: "#0088f6",
                    backgroundColor: "transparent",
                  },
                }}
              >
                More Specs
              </CustomButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <SpecsModal
        open={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        variant={activeVariant}
      />
    </SectionWrapper>
  );
};

/**
 * SpecsModal – Professional Technical Data Sheet
 */
const SpecsModal = ({ open, onClose, variant }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 4,
          py: 3,
          background: "linear-gradient(135deg, #0a1e3d 0%, #0d2a52 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "#38b6ff",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: "0.7rem",
            }}
          >
            Technical Data Sheet
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.2 }}
          >
            {variant.modelName}{" "}
            <span style={{ color: "#38b6ff" }}>{variant.name}</span>
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#fff",
            backgroundColor: "rgba(255,255,255,0.08)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.16)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: "#f8fafc" }}>
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Determine which model's specs to show */}
          {(detailedSpecs[variant.id?.startsWith("buzz") ? "buzz" : "lite"] || []).map((category) => (
            <Box key={category.id}>
              {/* Category Label */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: "rgba(0,136,246,0.08)",
                  borderRadius: "8px",
                  borderLeft: "3px solid #0088f6",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: "#0088f6",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    fontSize: "0.65rem",
                  }}
                >
                  {category.title}
                </Typography>
              </Box>

              {/* Single Table per Category */}
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Table
                  size="small"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableBody>
                    {category.specs.map((spec, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td": { border: 0 },
                          "&:hover": { backgroundColor: "#f0f7ff" },
                          transition: "background 0.15s ease",
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "42%",
                            py: 1.6,
                            pl: 2.5,
                            fontWeight: 600,
                            color: "#64748b",
                            fontSize: "0.82rem",
                            backgroundColor: "#f8fafc",
                            borderRight: "1px solid #e2e8f0",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {spec.label}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 1.6,
                            pl: 2.5,
                            fontWeight: 700,
                            color: "#0a1e3d",
                            fontSize: "0.88rem",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {spec.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>

        {/* Footer CTA */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            backgroundColor: "#fff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 800, color: "#0a1e3d" }}
            >
              Ready to upgrade your fleet?
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Our experts will find the right configuration for you.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <CustomButton
              variant="outlined"
              onClick={onClose}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "10px",
                borderColor: "#e2e8f0",
                color: "#64748b",
                fontSize: "0.85rem",
                "&:hover": { borderColor: "#0088f6", color: "#0088f6" },
              }}
            >
              Close
            </CustomButton>
            <CustomButton
              onClick={() => {
                onClose();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "10px",
                backgroundColor: "#0088f6",
                color: "#fff",
                fontSize: "0.85rem",
                "&:hover": { backgroundColor: "#006bb3" },
              }}
            >
              Book Now
            </CustomButton>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Models;
