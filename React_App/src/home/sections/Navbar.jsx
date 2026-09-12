/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  useScrollTrigger,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { navLinks, vehicleModels } from "../data";
import PdfViewer from "../components/PdfViewer";

// General model brochures
import brochureBuzz from "../assets/ALTENER_BUZZ.pdf";
import brochureLite from "../assets/ALTENER LITE.pdf";
// Per-variant brochure PDFs
import brochureBuzzContainer from "../assets/ALTENER_BUZZ_ CONTAINER.pdf";
import brochureBuzzLowdeck from "../assets/ALTENER_BUZZ _LOWERDECK.pdf";
import brochureBuzzFlatbed from "../assets/ALTENER_BUZZ_FLATBED.pdf";
import brochureLiteContainer from "../assets/ALTENER LITE - Container.pdf";
import brochureLiteLowdeck from "../assets/ALTENER LITE - Lower Deck.pdf";
import brochureLiteFlatbed from "../assets/ALTENER LITE - Flatbed.pdf";

// Map variant / model IDs to their dedicated brochure files
const brochureMap = {
  buzz: brochureBuzz,
  "buzz-container": brochureBuzzContainer,
  "buzz-lowdeck": brochureBuzzLowdeck,
  "buzz-flatbed": brochureBuzzFlatbed,
  lite: brochureLite,
  "lite-container": brochureLiteContainer,
  "lite-lowdeck": brochureLiteLowdeck,
  "lite-flatbed": brochureLiteFlatbed,
};

/**
 * Navbar – Sticky top navigation with glassmorphism effect
 * Responsive: hamburger drawer on mobile, full menu on desktop
 */
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brochureAnchorEl, setBrochureAnchorEl] = useState(null);
  const brochureOpen = Boolean(brochureAnchorEl);

  // PDF Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPdf, setViewerPdf] = useState(null);
  const [viewerTitle, setViewerTitle] = useState("");

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const handleNavClick = (href) => {
    setDrawerOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBrochureClick = (event) => {
    setBrochureAnchorEl(event.currentTarget);
  };

  const handleBrochureClose = () => {
    setBrochureAnchorEl(null);
  };

  /** Open the in-app PDF viewer instead of downloading */
  const handleViewPdf = (variantId, displayName) => {
    handleBrochureClose();
    setDrawerOpen(false);
    const file = brochureMap[variantId];
    if (!file) return;
    setViewerPdf(file);
    setViewerTitle(`AltEner ${displayName.replace(/_/g, " ")}`);
    setViewerOpen(true);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled
            ? "rgba(224, 240, 255, 0.92)"
            : "rgba(240, 247, 255, 0.75)",
          backdropFilter: "blur(24px)",
          borderBottom: scrolled
            ? "1px solid rgba(0, 0, 0, 0.06)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                mr: 4,
              }}
              onClick={() => handleNavClick("#home")}
            >
              <BoltIcon sx={{ color: "#0088f6", fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0a0a0a",
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.3rem", md: "1.5rem" },
                }}
              >
                Alt
                <span style={{ color: "#0088f6" }}>Ener</span>
              </Typography>
            </Box>

            {/* Desktop Nav Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
                flexGrow: 1,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    px: 2,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 136, 246, 0.08)",
                      color: "#0088f6",
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleBrochureClick}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={<PictureAsPdfIcon />}
                sx={{
                  borderColor: "#ddd",
                  color: "#333",
                  fontWeight: 600,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 2,
                  "&:hover": {
                    borderColor: "#0088f6",
                    color: "#0088f6",
                    backgroundColor: "rgba(0,136,246,0.04)",
                  },
                }}
              >
                Brochures
              </Button>

              <Menu
                anchorEl={brochureAnchorEl}
                open={brochureOpen}
                onClose={handleBrochureClose}
                elevation={4}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                    mt: 1.5,
                    minWidth: 220,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {vehicleModels.map((model) => (
                  <Box key={model.id}>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 2,
                        py: 1,
                        display: "block",
                        fontWeight: 800,
                        color: "#0088f6",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        backgroundColor: "rgba(0,136,246,0.03)",
                      }}
                    >
                      {model.name} Series
                    </Typography>
                    <MenuItem
                      onClick={() =>
                        handleViewPdf(model.id, `${model.name}_Full_Catalog`)
                      }
                      sx={{
                        py: 1.2,
                        px: 2.5,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#0088f6",
                        "&:hover": {
                          backgroundColor: "rgba(0,136,246,0.08)",
                        },
                      }}
                    >
                      <PictureAsPdfIcon
                        sx={{ fontSize: 16, mr: 1, opacity: 0.7 }}
                      />
                      {model.name} Full Catalog
                    </MenuItem>
                    {model.variants.map((variant) => (
                      <MenuItem
                        key={variant.id}
                        onClick={() =>
                          handleViewPdf(
                            variant.id,
                            `${model.name}_${variant.name}`,
                          )
                        }
                        sx={{
                          py: 1.2,
                          px: 2.5,
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: "rgba(0,136,246,0.06)",
                            color: "#0088f6",
                          },
                        }}
                      >
                        <PictureAsPdfIcon
                          sx={{ fontSize: 16, mr: 1, opacity: 0.5 }}
                        />
                        {model.name} {variant.name}
                      </MenuItem>
                    ))}
                    <Divider sx={{ my: 0.5, opacity: 0.6 }} />
                  </Box>
                ))}
              </Menu>

              <Button
                variant="outlined"
                size="small"
                href="/login"
                sx={{
                  borderColor: "#ddd",
                  color: "#333",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#0a0a0a",
                    backgroundColor: "rgba(0,0,0,0.03)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleNavClick("#contact")}
                sx={{
                  backgroundColor: "#0088f6",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(0,136,246,0.35)",
                  "&:hover": {
                    backgroundColor: "#0077c0",
                    boxShadow: "0 6px 20px rgba(0,136,246,0.45)",
                  },
                }}
              >
                Book Now
              </Button>
            </Box>

            {/* Mobile Hamburger */}
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" }, ml: "auto", color: "#0a0a0a" }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "#f0f7ff",
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, mb: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(link.href)}
                sx={{
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(0,136,246,0.08)",
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            px: 3,
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Per-model brochure accordions */}
          {vehicleModels.map((model) => (
            <Accordion
              key={model.id}
              disableGutters
              elevation={0}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "10px !important",
                "&:before": { display: "none" },
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                sx={{
                  minHeight: 44,
                  px: 2,
                  "& .MuiAccordionSummary-content": { my: 0.8 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PictureAsPdfIcon sx={{ fontSize: 18, color: "#0088f6" }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {model.name} Brochures
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding dense>
                  <ListItemButton
                    onClick={() =>
                      handleViewPdf(model.id, `${model.name}_Full_Catalog`)
                    }
                    sx={{
                      py: 1,
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: "rgba(0,136,246,0.08)",
                        color: "#0088f6",
                      },
                    }}
                  >
                    <ListItemText
                      primary={`${model.name} Full Catalog`}
                      primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#0088f6",
                      }}
                    />
                  </ListItemButton>
                  {model.variants.map((variant) => (
                    <ListItemButton
                      key={variant.id}
                      onClick={() =>
                        handleViewPdf(
                          variant.id,
                          `${model.name}_${variant.name}`,
                        )
                      }
                      sx={{
                        py: 1,
                        px: 2.5,
                        "&:hover": {
                          backgroundColor: "rgba(0,136,246,0.06)",
                          color: "#0088f6",
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${model.name} ${variant.name}`}
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            variant="outlined"
            fullWidth
            href="/login"
            sx={{ borderColor: "#ddd", color: "#333" }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavClick("#contact")}
            sx={{
              backgroundColor: "#0088f6",
              color: "#fff",
              "&:hover": { backgroundColor: "#0077c0" },
            }}
          >
            Book Now
          </Button>
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />

      {/* PDF Viewer Modal */}
      <PdfViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        pdfUrl={viewerPdf}
        title={viewerTitle}
      />
    </>
  );
};

export default Navbar;
