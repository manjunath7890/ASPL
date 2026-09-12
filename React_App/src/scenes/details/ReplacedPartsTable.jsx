import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Snackbar,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const ReplacedPartsFormAndTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const apiBase = colors.palette[50];
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const formatDateField = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      return value.includes("T") ? value.split("T")[0] : value;
    }
    return new Date(value).toISOString().split("T")[0];
  };

  const handleNavigate = () => {
    navigate(`/materials/form`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiBase}/replace/vehicleparts/${props.chassisNumber}/${props.partId}`
        );
        const result = await response.json();

        if (response.ok && result) {
          const formattedParts = result.map((part, index) => ({
            id: index + 1,
            ...part,
            dateInstalled: formatDateField(part.dateInstalled),
            previousUsageDates: formatDateField(part.previousUsageDates),
          }));
          setData(formattedParts);
        } else {
          setData([]);
          setSnackbarOpen(true);
          setSnackbarMessage(
            "No vehicle found with the provided chassis number."
          );
        }
      } catch (error) {
        setData([]);
        setSnackbarOpen(true);
        setSnackbarMessage("Error fetching data.");
      }
    };

    fetchData();
  }, [apiBase, props.chassisNumber, props.partId]);

  const columns = useMemo(
    () => [
      { field: "partId", headerName: "Part ID", flex: 1 },
      { field: "partName", headerName: "Part Name", flex: 1 },
      { field: "quantityUsed", headerName: "Quantity Used", flex: 1 },
      { field: "dateInstalled", headerName: "Date Installed", flex: 1 },
      { field: "mileageAtInstallation", headerName: "Mileage at Installation", flex: 1.2 },
      { field: "supplier", headerName: "Supplier", flex: 1 },
      { field: "costPerUnit", headerName: "Cost per Unit", flex: 1 },
      { field: "replacementCount", headerName: "Replacement Count", flex: 1.2 },
      { field: "previousUsageDates", headerName: "Previous Usage Dates", flex: 1.2 },
      { field: "previousMileages", headerName: "Previous Mileages", flex: 1 },
      { field: "notes", headerName: "Notes", flex: 1 },
    ],
    []
  );

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
          gap={2}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={0.8}>
              <Button
                onClick={handleNavigate}
                startIcon={<ArrowBackIosIcon />}
                sx={{ minWidth: "1.8rem", p: 0, color: colors.palette[100] }}
              />
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
                Replaced Parts Information
              </Typography>
            </Box>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Historical replacement entries for the selected part
            </Typography>
            <Box sx={{ mt: 1.1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#d7f8ec" : "#134e3b",
                  background: isDark ? "rgba(2,179,132,0.16)" : "rgba(2,179,132,0.12)",
                  border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
                }}
              >
                Chassis No: {props.chassisNumber}
              </Box>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#dce6ff" : "#1e3a8a",
                  background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.12)",
                  border: `1px solid ${isDark ? "rgba(13,110,253,0.35)" : "rgba(13,110,253,0.2)"}`,
                }}
              >
                Part ID: {props.partId}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "75vh",
            marginTop: "1rem",
            borderRadius: "1rem",
            overflow: "hidden",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
            background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(8px)",
            boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
            "& .MuiDataGrid-root": { border: "none", background: "transparent" },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)",
              color: colors.palette[100],
              fontSize: "1rem",
            },
            "& .MuiDataGrid-columnSeparator": { color: "transparent" },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.95rem",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
            },
            "& .MuiDataGrid-row:hover": {
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(2,179,132,0.06)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)",
              minHeight: "46px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-root": {
              width: "100%",
              overflow: "hidden",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-toolbar": {
              minHeight: "46px",
              flexWrap: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              paddingLeft: "0.8rem",
              paddingRight: "0.8rem",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-actions": {
              marginLeft: "0.25rem",
              flexShrink: 0,
            },
            "& .MuiDataGrid-toolbarContainer": {
              p: 1,
              borderBottom: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.palette[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            pagination
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default ReplacedPartsFormAndTable;
