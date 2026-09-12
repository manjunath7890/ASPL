/* eslint-disable no-unused-vars */
import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

/**
 * Slide-up transition for the dialog
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * PdfViewer – Full-screen modal PDF viewer
 *
 * Props:
 *   open      – boolean controlling visibility
 *   onClose   – callback to close the viewer
 *   pdfUrl    – URL / imported path of the PDF to display
 *   title     – display name shown in the toolbar
 */
const PdfViewer = ({ open, onClose, pdfUrl, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: "#0a0e17",
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(0,136,246,0.08) 0%, transparent 60%)",
        },
      }}
    >
      {/* ─── Toolbar ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 3 },
          py: 1,
          backgroundColor: "rgba(15,20,35,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          minHeight: 56,
        }}
      >
        {/* Left – PDF icon + title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0088f6 0%, #00c6ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PictureAsPdfIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              color: "#e0eaff",
              fontWeight: 600,
              fontSize: { xs: "0.85rem", sm: "1rem" },
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Right – action buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Download */}
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownload}
            sx={{
              color: "#90b8f8",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              borderRadius: "8px",
              px: 1.5,
              display: { xs: "none", sm: "inline-flex" },
              "&:hover": {
                backgroundColor: "rgba(0,136,246,0.12)",
                color: "#fff",
              },
            }}
          >
            Download
          </Button>

          {/* Mobile download icon */}
          <IconButton
            onClick={handleDownload}
            sx={{
              color: "#90b8f8",
              display: { xs: "inline-flex", sm: "none" },
              "&:hover": { color: "#fff", backgroundColor: "rgba(0,136,246,0.15)" },
            }}
          >
            <FileDownloadIcon fontSize="small" />
          </IconButton>

          {/* Open in new tab */}
          <IconButton
            onClick={handleOpenNewTab}
            sx={{
              color: "#90b8f8",
              "&:hover": { color: "#fff", backgroundColor: "rgba(0,136,246,0.15)" },
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>

          {/* Close */}
          <IconButton
            onClick={onClose}
            sx={{
              color: "#90b8f8",
              ml: 0.5,
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(255,80,80,0.15)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ─── PDF Content ─── */}
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {pdfUrl ? (
          <Box
            component="iframe"
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={title}
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "#1a1f2e",
            }}
          />
        ) : (
          /* Fallback when no URL */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: "#5a6a8a",
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 64, opacity: 0.4 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              No document selected
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;
