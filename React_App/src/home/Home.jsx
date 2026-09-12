import React from "react";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Models from "./sections/Models";
import Features from "./sections/Features";
import AdvancedConnectivity from "./sections/AdvancedConnectivity";
import About from "./sections/About";
import FAQ from "./sections/FAQ";
import CTA from "./sections/CTA";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

/**
 * Global Theme for Landing Page
 */
const homeTheme = createTheme({
  palette: {
    primary: { main: "#0088f6" },
    secondary: { main: "#28c79c" },
    background: {
      default: "#ffffff",
      paper: "#f8fbfc",
    },
    text: {
      primary: "#0a1e3d",
      secondary: "#5a7a9a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        },
      },
    },
  },
});

/**
 * Home – Landing page entry point. Assembles all sections.
 */
function Home() {
  return (
    <ThemeProvider theme={homeTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Navbar />
        <Hero />
        <Features />
        <Models />
        <AdvancedConnectivity />
        <About />
        <FAQ />
        <CTA />
        <Contact />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
