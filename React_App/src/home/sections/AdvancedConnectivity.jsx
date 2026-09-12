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

const AdvancedConnectivity = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const current = connectivityData[activeTab];
  const Icon = Icons[current.icon] || Icons.DeviceHub;

  return (
    <SectionWrapper
      id="connectivity"
      sx={{
        background: "linear-gradient(180deg, #dff0ff 0%, #f1f8ff 100%)",
        py: { xs: 8, md: 12 },
      }}
    >
      <SectionHeading
        title="Connected Intelligence"
        subtitle="Smarter features for drivers. Stronger oversight for business owners."
      />

      {/* Tabs Navigation */}
      <Box
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          mb: { xs: 6, md: 10 },
          backgroundColor: "rgba(0, 136, 246, 0.04)",
          p: 0.8,
          borderRadius: "20px",
          border: "1px solid rgba(0, 136, 246, 0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          centered={!isMobile}
          scrollButtons="auto"
          sx={{
            minHeight: "48px",
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "none",
              color: "#5a7a9a",
              minHeight: "48px",
              px: { xs: 2, md: 4 },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "16px",
              opacity: 0.8,
              "&:hover": {
                opacity: 1,
                backgroundColor: "#a1ceff",
              },
            },
            "& .Mui-selected": {
              color: "#fff !important",
              backgroundColor: "#0088f6",
              boxShadow: "0 8px 16px rgba(0, 136, 246, 0.2)",
              opacity: 1,
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {connectivityData.map((item) => (
            <Tab key={item.id} label={item.label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Grid container spacing={6} sx={{ alignItems: "center" }}>
              {/* Image Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    borderRadius: "32px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0, 43, 84, 0.1)",
                    border: "1px solid rgba(0, 136, 246, 0.1)",
                  }}
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>

              {/* Specifications Column (Same Row) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ pl: { md: 4 } }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Box sx={{ color: "#0088f6", display: "flex" }}>
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 900, color: "#0a1e3d" }}
                    >
                      {current.title}
                    </Typography>
                  </Stack>

                  <List sx={{ mb: 4 }}>
                    {current.features.map((feature, idx) => (
                      <ListItem
                        key={idx}
                        disableGutters
                        sx={{ alignItems: "flex-start", py: 1.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                          <Icons.CheckCircle
                            sx={{ color: "#0088f6", fontSize: 22 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: "1.15rem",
                                fontWeight: 600,
                                color: "#334e68",
                                lineHeight: 1.4,
                              }}
                            >
                              {feature}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Box>
    </SectionWrapper>
  );
};

export default AdvancedConnectivity;
