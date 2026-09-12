import React, { useState, useEffect } from "react";
import {
  Button,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const Tables = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDealerData = async () => {
      const response = await fetch(
        `${colors.palette[50]}/dealer/users?dealerToken=${props.dealerToken}`
      );
      const result = await response.json();

      const usersWithSerialNumbers = result
        .filter((user) => user.role !== "service")
        .map((user, index) => ({
          id: index + 1,
          serialNumber: index + 1,
          userName: user.userName,
          email: user.email,
          contact: user.contact,
          accessToken: user.accessToken,
        }));

      setData(usersWithSerialNumbers);
    };

    fetchDealerData();
  }, [props]);

  const handleNavigate = () => {
    navigate(`/user-table`);
  };

  const columns = [
    { field: "serialNumber", headerName: "Sl no.", width: 90 },
    { field: "userName", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact", flex: 1 },
    { field: "accessToken", headerName: "Fleet/Customer ID", flex: 1.2 },
  ];


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
          border={isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)"}
          bgcolor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"}
          sx={{ backdropFilter: "blur(8px)" }}
          boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
          gap={2}
        >
          <Box display="flex" alignItems="flex-start" gap={1.2}>
            <Button
              onClick={handleNavigate}
              variant="outlined"
              startIcon={<ArrowBackIosIcon />}
              sx={{
                minWidth: "2.4rem",
                height: "2.4rem",
                px: 1,
                borderRadius: "0.7rem",
                textTransform: "none",
                borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                color: colors.palette[100],
              }}
            >
              Back
            </Button>
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
                {props.user}'s Customers
              </Typography>
              <Typography
                sx={{
                  margin: 0,
                  marginTop: "0.2rem",
                  color: colors.palette[150],
                  fontSize: "0.85rem",
                }}
              >
                Customer list linked to this dealer account
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.2,
              py: 0.55,
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              alignSelf: { xs: "flex-start", md: "center" },
              color: isDark ? "#d6f5ff" : "#0b4f6c",
              background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.11)",
              border: `1px solid ${isDark ? "rgba(13,110,253,0.34)" : "rgba(13,110,253,0.22)"}`,
            }}
          >
            Total Customers: {data.length}
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
            "& .MuiDataGrid-root": {
              border: "none",
              background: "transparent",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.95rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)",
              color: colors.palette[100],
              fontSize: "1rem",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "transparent",
            },
            "& .MuiDataGrid-virtualScroller": {
              background: "transparent",
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
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Tables;
