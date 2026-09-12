import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tokens } from "../../theme";

const TableAnalytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const apiBase = colors.palette[50];

  const [userId, setUserId] = useState("");
  const currentDate = new Date();
  const [vehiclesData, setVehiclesData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs(currentDate));
  const [endDate, setEndDate] = useState(dayjs(currentDate));
  const [data, setData] = useState([]);

  const columns = [
    { field: "id", headerName: "Sl no.", flex: 0.4 },
    { field: "vehicleNo", headerName: "Vehicle Number", flex: 0.8 },
    { field: "date", headerName: "Date", flex: 0.8 },
    { field: "distance", headerName: "Distance travelled", flex: 1.5 },
    { field: "chargeCycle", headerName: "Battery cycles", flex: 1.5 },
  ];

  const fetchLastDocumentForDate = async (date, selectedUserId) => {
    try {
      const response = await fetch(
        `${apiBase}/api/documents?fileName=${date}&userName=${selectedUserId}`,
      );
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchData = async () => {
    if (!userId) {
      console.warn("User ID is not selected!");
      return;
    }

    try {
      const startDateFormatted = dayjs(startDate).format("YYYY-MM-DD");
      const endDateFormatted = dayjs(endDate).format("YYYY-MM-DD");

      let dayCursor = dayjs(startDateFormatted);
      const endDateObj = dayjs(endDateFormatted);
      const fetchedData = [];

      while (dayCursor.isBefore(endDateObj) || dayCursor.isSame(endDateObj)) {
        const dateFormatted = dayCursor.format("YYYY-MM-DD");
        const lastDocument = await fetchLastDocumentForDate(
          dateFormatted,
          userId,
        );

        if (lastDocument && lastDocument.length > 0) {
          lastDocument.forEach((doc) =>
            fetchedData.push({
              id: fetchedData.length + 1,
              vehicleNo: doc.v3,
              date: new Date(doc.timestamp).toISOString().slice(0, 10),
              distance: doc.v41,
              driveCycle: doc.v21,
              chargeCycle: doc.v22,
            }),
          );
        }

        dayCursor = dayCursor.add(1, "day");
      }

      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${apiBase}/vehicles`);
        const responseData = await response.json();
        setVehiclesData(responseData);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicles();
  }, [apiBase]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(132deg, #0d1117 0%, #101a26 56%, #0f2028 100%)"
          : "linear-gradient(132deg, #edf4f7 0%, #f8fafc 55%, #eef6ef 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(circle at 12% 18%, rgba(0,211,139,0.18) 0%, rgba(0,211,139,0) 40%), radial-gradient(circle at 88% 76%, rgba(13,110,253,0.18) 0%, rgba(13,110,253,0) 45%)"
            : "radial-gradient(circle at 12% 18%, rgba(2,179,132,0.16) 0%, rgba(2,179,132,0) 40%), radial-gradient(circle at 88% 76%, rgba(13,110,253,0.12) 0%, rgba(13,110,253,0) 45%)",
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
          flexDirection="column"
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={
            isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"
          }
          sx={{ backdropFilter: "blur(8px)" }}
          boxShadow={
            isDark
              ? "0 14px 32px rgba(0,0,0,0.25)"
              : "0 12px 28px rgba(15, 23, 42, 0.1)"
          }
          gap={1.5}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            gap={1.2}
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
                Trip & Battery Cycle
              </Typography>
              <Typography
                sx={{
                  margin: 0,
                  marginTop: "0.2rem",
                  color: colors.palette[150],
                  fontSize: "0.85rem",
                }}
              >
                Review trip distance and charge cycle history by date range
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.1,
                py: 0.45,
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                width: "fit-content",
                color: isDark ? "#d7f8ec" : "#134e3b",
                background: isDark
                  ? "rgba(2,179,132,0.16)"
                  : "rgba(2,179,132,0.12)",
                border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
              }}
            >
              Records: {data.length}
            </Box>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-input": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <InputLabel id="vehicle-id-label">Vehicle Number</InputLabel>
              <Select
                labelId="vehicle-id-label"
                id="vehicle-id"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                label="Vehicle Number"
              >
                {vehiclesData.map((vehicle) => (
                  <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.vehicleNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ p: 0, m: 0 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(newValue) => setStartDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ p: 0, m: 0 }}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <Button
              variant="contained"
              onClick={fetchData}
              startIcon={<AddIcon style={{ fontSize: "1.2rem" }} />}
              sx={{
                height: "2.3rem",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                borderRadius: "0.3rem",
                px: 1.6,
                background: `linear-gradient(90deg, ${colors.palette[500]} 0%, ${colors.palette[550]} 100%)`,
                boxShadow: isDark
                  ? "0 1px 10px rgba(0, 227, 150, 0.25)"
                  : "0 1px 10px rgba(2, 179, 132, 0.22)",
                "&:hover": {
                  background: `linear-gradient(90deg, ${colors.palette[550]} 0%, ${colors.palette[500]} 100%)`,
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            height: "70vh",
            marginTop: "1rem",
            borderRadius: "1rem",
            overflow: "hidden",
            border: "none",
            background: isDark
              ? "rgba(66, 69, 71, 0.78)"
              : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(8px)",
            boxShadow: isDark
              ? "0 14px 30px rgba(0,0,0,0.24)"
              : "0 12px 28px rgba(15, 23, 42, 0.1)",
            "& .MuiDataGrid-root": {
              border: "none",
              background: "transparent",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.9rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
              color: colors.palette[100],
              fontSize: "1rem",
              background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(2,179,132,0.08)",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "transparent",
            },
            "& .MuiDataGrid-virtualScroller": {
              background: "transparent",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              background: isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.015)",
            },
            "& .MuiDataGrid-row:hover": {
              background: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(2,179,132,0.06)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(2,179,132,0.08)",
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
            "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows":
              {
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
            pageSize={10}
            rowsPerPageOptions={[10]}
            sx={{ fontFamily: "Kanit, sans-serif" }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TableAnalytics;
