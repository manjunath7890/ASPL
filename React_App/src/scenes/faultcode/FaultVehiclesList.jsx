import React from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const FaultVehiclesList = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const title = location.state?.title || "Filtered Vehicles";
  const vehicles = Array.isArray(location.state?.vehicles)
    ? location.state.vehicles
    : [];

  const handleOpenD1 = (vehicle) => {
    props.onVehicleIdClick?.(vehicle.vehicleId, vehicle.vehicleNo, vehicle.name);
    navigate("/template-1");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: colors.palette[130],
        "&::before": {
          content: "\"\"",
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "0.9rem", md: "1.4rem 1.6rem 2rem 1.6rem" },
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"}
          sx={{
            backdropFilter: "blur(8px)",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
          }}
          boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
          gap={1.5}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                margin: 0,
                fontSize: { xs: "1.35rem", md: "1.75rem" },
                color: colors.palette[100],
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Vehicles matching this selected fault box
            </Typography>
            <Box
              sx={{
                mt: 1.1,
                px: 1.1,
                py: 0.45,
                borderRadius: "999px",
                width: "fit-content",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: isDark ? "#d7f8ec" : "#134e3b",
                background: isDark ? "rgba(2,179,132,0.16)" : "rgba(2,179,132,0.12)",
                border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
              }}
            >
              Vehicles: {vehicles.length}
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{ textTransform: "none", borderRadius: "0.75rem" }}
            >
              Back to Fault Dashboard
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            mt: 1.2,
            borderRadius: "1rem",
            overflow: "hidden",
            background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.86)",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
            boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)" }}>
                <TableCell>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>Vehicle Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>Vehicle Number</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography sx={{ py: 1.5, color: colors.palette[150] }}>
                      No vehicles found for this category.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.vehicleId}
                    sx={{
                      "&:nth-of-type(even)": {
                        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.92rem", fontWeight: 500 }}>
                      {vehicle.name || "Vehicle"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.92rem", fontWeight: 500 }}>
                      {vehicle.vehicleNo || vehicle.vehicleId || "--"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        endIcon={<DoubleArrowIcon />}
                        onClick={() => handleOpenD1(vehicle)}
                        sx={{ textTransform: "none", borderRadius: "0.7rem" }}
                      >
                        Open Dashboard
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default FaultVehiclesList;
