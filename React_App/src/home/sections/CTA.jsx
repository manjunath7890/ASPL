import { Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

import brochureFile from "../assets/ALTENER_BUZZ.pdf";

import CustomButton from "../components/CustomButton";

/**
 * CTA – Bold vibrant blue gradient with animated decorative elements
 */
const CTA = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = brochureFile;
    link.download = "AltEner_Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        px: 3,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #004080 0%, #0066cc 25%, #0088f6 50%, #38b6ff 75%, #5cc8ff 100%)",
        backgroundSize: "300% 300%",
        animation: "gradient-shift 8s ease infinite",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: "-30%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
          animation: "float 12s ease-in-out infinite 3s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite 1.5s",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 700,
            letterSpacing: 3,
            mb: 2,
            display: "block",
          }}
        >
          GET STARTED TODAY
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            fontSize: { xs: "2rem", md: "3.2rem" },
            mb: 3,
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.15,
            textShadow: "0 2px 20px rgba(0,0,0,0.15)",
          }}
        >
          Ready to electrify your fleet?
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255,255,255,0.85)",
            maxWidth: 500,
            mx: "auto",
            mb: 5,
            fontSize: "1.1rem",
          }}
        >
          Join hundreds of businesses already saving with AltEner. Book a demo
          or reserve your vehicle today.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <CustomButton
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            sx={{
              backgroundColor: "#fff",
              color: "#0077c0",
              px: 6,
              py: 1.5,
              fontSize: "1.05rem",
              fontWeight: 700,
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#f0f8ff",
                boxShadow: "0 10px 32px rgba(0,0,0,0.25)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Book Now
          </CustomButton>
          <CustomButton
            variant="outlined"
            onClick={handleDownload}
            sx={{
              borderColor: "rgba(255,255,255,0.6)",
              color: "#fff",
              px: 4,
              py: 1.5,
              backdropFilter: "blur(4px)",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 4px 16px rgba(255,255,255,0.1)",
              },
            }}
          >
            Download Brochure
          </CustomButton>
        </Box>
      </motion.div>
    </Box>
  );
};

export default CTA;
