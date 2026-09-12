import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import "./index.css";
import ReactApexChart from "react-apexcharts";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

function ApexBrushChart(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const [userId, setUserId] = useState("");
  const [vehiclesData, setVehiclesData] = useState([]);
  const currentDate = new Date();
  const [value, setValue] = useState(dayjs(currentDate));
  const downloaddate = dayjs(value).format("YYYY-MM-DD");
  const [data, setData] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);

  const variableDisplayNames = {
    v39: "Speed",
    v40: "RPM",
    v38: "Wh/km",
    v41: "Distance",
    v33: "Current",
    v32: "SOC",
    v34: "Voltage",
    v11: "MOS Temperature",
    v35: "AH Consumed",
    v45: "C Temperature",
    v46: "M Temperature",
    v47: "Gradient",
    v19: "Trip",
    v5: "Range",
    v24: "AC Current",
    v12: "Charger Temperature",
    v23: "Driven Gear",
  };

  const handleVariableChange = (event, index) => {
    const newSelectedVariables = [...selectedVariables];
    newSelectedVariables[index] = event.target.value;
    setSelectedVariables(newSelectedVariables);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${colors.palette[50]}/vehicles`);
        const data = await response.json();
        setVehiclesData(data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    const fetchSelectedVehicles = async () => {
      try {
        const response = await fetch(
          `${colors.palette[50]}/fleet/vehicles?accessToken=${props.accessToken}`,
        );
        const result = await response.json();
        if (
          result.error === "No vehicles found for the provided accessToken" ||
          result.length === 0
        ) {
          setVehiclesData([]);
        } else {
          setVehiclesData(result);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    const fetchDealerTokenData = async () => {
      try {
        const response = await fetch(
          `${colors.palette[50]}/dealer/vehicles?dealerToken=${props.dealerToken}`,
        );
        const result = await response.json();
        if (
          result.error === "No vehicles found for the provided dealerToken" ||
          result.length === 0
        ) {
          setVehiclesData([]);
        } else {
          setVehiclesData(result);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    props.role === "admin"
      ? fetchVehicles()
      : props.role === "service"
        ? fetchDealerTokenData()
        : fetchSelectedVehicles();
  }, []);
  const fetchData = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${colors.palette[50]}/api/brush?fileName=${downloaddate}&userName=${userId}`,
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const series = selectedVariables
    .map((variable) => {
      if (!variable) return null;
      return {
        name: variableDisplayNames[variable] || "Unknown",
        data: data.map((item) => ({
          x: item.timestamp,
          y: item[variable],
        })),
      };
    })
    .filter(Boolean);

  const chartOptions = {
    chart: {
      height: 550,
      type: "area",
      stacked: false,
      foreColor: colors.palette[150],
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
        tools: {
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        export: {
          csv: {
            filename: "chart-data",
            columnDelimiter: ",",
            headerCategory: "Timestamp",
            headerValue: "Value",
            dateFormatter(timestamp) {
              // console.log("Raw timestamp:", timestamp);
              return timestamp;
            },
          },
        },
      },
    },
    colors: ["#0d6efd", "#00d38b", "#feb019", "#ff4560", "#775dd0", "#0dcaf0"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: colors.palette[100],
        },
      },
    },
    yaxis: {
      title: {
        text: "",
      },
      labels: {
        style: {
          colors: colors.palette[100],
        },
      },
    },

    title: {
      text: "",
      align: "center",
    },
    tooltip: {
      shared: true,
      x: {
        format: "HH:mm:ss",
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
      style: {
        fontSize: "11px",
        fontFamily: "Arial",
        color: colors.palette[100],
      },
    },
    legend: {
      position: "top",
    },
    grid: {
      opacity: 0.5,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: colors.palette[130],
        "&::before": {
          content: '""',
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
          flexDirection="column"
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={
            isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"
          }
          sx={{
            backdropFilter: "blur(8px)",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
          }}
          boxShadow={
            isDark
              ? "0 10px 22px rgba(0,0,0,0.28)"
              : "0 2px 12px rgba(14, 21, 29, 0.1)"
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
              <Box
                component="h1"
                sx={{
                  fontWeight: 800,
                  margin: 0,
                  fontSize: { xs: "1.35rem", md: "1.75rem" },
                  color: colors.palette[100],
                  letterSpacing: "0.02em",
                }}
              >
                Graph Analytics
              </Box>
              <Box
                sx={{
                  marginTop: "0.2rem",
                  color: colors.palette[150],
                  fontSize: "0.85rem",
                }}
              >
                Compare key telemetry signals over time
              </Box>
            </Box>
            <Box
              sx={{
                px: 1.1,
                py: 0.45,
                borderRadius: "999px",
                width: "fit-content",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: isDark ? "#d7f8ec" : "#134e3b",
                background: isDark
                  ? "rgba(2,179,132,0.16)"
                  : "rgba(2,179,132,0.12)",
                border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
              }}
            >
              Active Series: {series.length}
            </Box>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={1}
            alignItems="center"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
          >
            <Box
              sx={{ minWidth: 200, width: { xs: "100%", sm: 200, md: 200 } }}
            >
              <FormControl fullWidth size="small">
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
            </Box>

            <Box sx={{ width: { xs: "100%", sm: 200, md: 200 } }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]} sx={{ p: 0, m: 0 }}>
                  <DatePicker
                    label="Select Date"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    sx={{ width: "100%" }}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>

            {[...Array(6)].map((_, index) => (
              <Box
                sx={{
                  minWidth: 60,
                  width: { xs: "100%", sm: 120, md: 120 },
                }}
                key={index}
              >
                <FormControl fullWidth size="small">
                  <InputLabel id={`variable-label-${index}`}>
                    V{index + 1}
                  </InputLabel>
                  <Select
                    labelId={`variable-label-${index}`}
                    id={`variable-select-${index}`}
                    value={selectedVariables[index] || ""}
                    label={`Variable ${index + 1}`}
                    onChange={(event) => handleVariableChange(event, index)}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="v32">SOC</MenuItem>
                    <MenuItem value="v34">Voltage</MenuItem>
                    <MenuItem value="v33">Current</MenuItem>
                    <MenuItem value="v11">MOS Temperature</MenuItem>
                    <MenuItem value="v12">Charger Temperature</MenuItem>
                    <MenuItem value="v35">AH Consumed</MenuItem>
                    <MenuItem value="v39">Speed</MenuItem>
                    <MenuItem value="v40">RPM</MenuItem>
                    <MenuItem value="v38">Wh/km</MenuItem>
                    <MenuItem value="v41">Distance</MenuItem>
                    <MenuItem value="v19">Trip</MenuItem>
                    <MenuItem value="v5">Range</MenuItem>
                    <MenuItem value="v45">C-Temperature</MenuItem>
                    <MenuItem value="v46">M-Temperature</MenuItem>
                    <MenuItem value="v24">AC Current</MenuItem>
                    <MenuItem value="v47">Gradient</MenuItem>
                    <MenuItem value="v23">Driven Gear</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ))}

            <Button
              variant="contained"
              onClick={fetchData}
              startIcon={
                <DownloadForOfflineIcon style={{ fontSize: "1.2rem" }} />
              }
              sx={{
                borderRadius: "0.3rem",
                fontSize: "0.9rem",
                width: { xs: "100%", sm: "auto" },
                minWidth: 120,
                textTransform: "none",
                fontWeight: 700,
                height: "2.3rem",
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
            mt: 1.2,
            borderRadius: "1rem",
            p: { xs: "0.4rem", md: "0.8rem" },
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
            background: isDark
              ? "rgba(66, 69, 71, 0.78)"
              : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(8px)",
            boxShadow: isDark
              ? "0 10px 22px rgba(0,0,0,0.28)"
              : "0 2px 12px rgba(14, 21, 29, 0.1)",
          }}
        >
          <ReactApexChart
            key={JSON.stringify(series)}
            options={chartOptions}
            series={series}
            type="area"
            height={650}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ApexBrushChart;
