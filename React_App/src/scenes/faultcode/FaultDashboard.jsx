import {
  useTheme,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  IconButton,
  Menu,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { squircle } from "ldrs";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FaultBox from "../../components/FaultBox";
import FaultBox2 from "../../components/FaultBox_2";
import { LuCircleParking } from "react-icons/lu";
import { FaChargingStation } from "react-icons/fa";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import MemoryIcon from "@mui/icons-material/Memory";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';

const parseValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const readSessionJson = (key, fallback) => {
  try {
    const rawValue = sessionStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.error(`Failed to parse session storage key: ${key}`, error);
    return fallback;
  }
};

const readSessionString = (key, fallback) => {
  try {
    const rawValue = sessionStorage.getItem(key);
    return rawValue ?? fallback;
  } catch (error) {
    console.error(`Failed to read session storage key: ${key}`, error);
    return fallback;
  }
};

const Home = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const storagePrefix = `faultDashboard:${props.role || "unknown"}:${props.accessToken || ""
    }:${props.dealerToken || ""}:${props.financeToken || ""}`;
  const storageKeys = {
    vehicles: `${storagePrefix}:vehicles`,
    details: `${storagePrefix}:details`,
    status: `${storagePrefix}:status`,
    previousV6: `${storagePrefix}:previousV6`,
    searchQuery: `${storagePrefix}:searchQuery`,
    selectedDealer: `${storagePrefix}:selectedDealer`,
  };
  const initialPreviousV6 = readSessionJson(storageKeys.previousV6, {});

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  squircle.register();

  const [userData, setUserData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState(
    () => readSessionJson(storageKeys.vehicles, [])
  );
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [details, setDetails] = useState(
    () => readSessionJson(storageKeys.details, {})
  );
  const [previousV6, setPreviousV6] = useState(initialPreviousV6);
  const [newStatus, setNewStatus] = useState(
    () => readSessionJson(storageKeys.status, {})
  );
  const [searchQuery, setSearchQuery] = useState(
    () => readSessionString(storageKeys.searchQuery, "")
  );
  const [isInitialLoad, setIsInitialLoad] = useState(
    () => Object.keys(initialPreviousV6).length === 0
  );
  const [selectedDealer, setSelectedDealer] = useState(
    () => readSessionString(storageKeys.selectedDealer, "none")
  );
  const [heartbeatMap, setHeartbeatMap] = useState({});

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${colors.palette[50]}/users`);
      const result = await response.json();

      const filteredUsers = result.filter((user) => user.role === "service");
      setUserData(filteredUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDetailsForAllVehicles = async () => {
    const detailsMap = {};
    const newPreviousV6 = {};
    const Status = {};

    await Promise.all(
      vehiclesData.map(async (vehicle) => {
        const vehicleKey = vehicle.vehicleId;
        try {
          const response = await fetch(
            `${colors.palette[50]}/getdata?user=${vehicleKey}`
          );
          if (response.ok) {
            const result = await response.json();
            detailsMap[vehicleKey] = result;

            if (!isInitialLoad && previousV6[vehicleKey] !== undefined) {
              if (previousV6[vehicleKey] === result.v6) {
                Status[vehicleKey] = "offline";
              } else {
                Status[vehicleKey] = "online";
              }
            } else {
              Status[vehicleKey] = "loading";
            }

            newPreviousV6[vehicleKey] = result.v6;
          } else {
            console.log(`Failed to fetch details for vehicle ${vehicleKey}.`);
            if (details[vehicleKey]) detailsMap[vehicleKey] = details[vehicleKey];
            if (previousV6[vehicleKey] !== undefined) newPreviousV6[vehicleKey] = previousV6[vehicleKey];
            Status[vehicleKey] = newStatus[vehicleKey] || "loading";
          }
        } catch (error) {
          console.error(`Error fetching details for vehicle ${vehicleKey}:`, error);
          if (details[vehicleKey]) detailsMap[vehicleKey] = details[vehicleKey];
          if (previousV6[vehicleKey] !== undefined) newPreviousV6[vehicleKey] = previousV6[vehicleKey];
          Status[vehicleKey] = newStatus[vehicleKey] || "loading";
        }
      })
    );

    // Persist newest fetched cycle immediately.
    sessionStorage.setItem(storageKeys.details, JSON.stringify(detailsMap));
    sessionStorage.setItem(storageKeys.status, JSON.stringify(Status));
    sessionStorage.setItem(storageKeys.previousV6, JSON.stringify(newPreviousV6));

    setDetails(detailsMap);
    setPreviousV6(newPreviousV6);
    setNewStatus(Status);

    // Disable the initial load flag after first fetch
    if (isInitialLoad && vehiclesData.length > 0) setIsInitialLoad(false);
  };

  const fetchHeartbeat = async () => {
    try {
      const res = await fetch(`${colors.palette[50]}/sse/heartbeat`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.vehicles?.length) return;
      const map = {};
      data.vehicles.forEach((v) => {
        if (v.user) map[v.user] = { alive: v.alive, secondsAgo: v.secondsAgo ?? null };
      });
      setHeartbeatMap(map);
    } catch {
      // ignore
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${colors.palette[50]}/vehicles`, {
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
      });
      const data = await response.json();
      setVehiclesData(data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const fetchSelectedVehicles = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/fleet/vehicles?accessToken=${props.accessToken}`
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

  const fetchDealerTokenData = async (dealerToken) => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/dealer/vehicles?dealerToken=${dealerToken}`
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
      setVehiclesData([]);
    }
  };

  const fetchFinanceTokenData = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/financer/vehicles?financeToken=${props.financeToken}`
      );
      const result = await response.json();

      if (
        result.error === "No vehicles found for the provided financeToken" ||
        result.length === 0
      ) {
        setVehiclesData([]);
      } else {
        setVehiclesData(result);
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehiclesData([]);
    }
  };

  useEffect(() => {
    if (props.role === "admin") {
      fetchUserData();
      if (selectedDealer === "none") {
        fetchVehicles();
      } else {
        fetchDealerTokenData(selectedDealer);
      }
    } else if (props.role === "service") {
      fetchDealerTokenData(props.dealerToken);
    } else if (props.role === "financer") {
      fetchFinanceTokenData();
    } else {
      fetchSelectedVehicles();
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.vehicles, JSON.stringify(vehiclesData));
  }, [vehiclesData, storageKeys.vehicles]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.details, JSON.stringify(details));
  }, [details, storageKeys.details]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.status, JSON.stringify(newStatus));
  }, [newStatus, storageKeys.status]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.previousV6, JSON.stringify(previousV6));
  }, [previousV6, storageKeys.previousV6]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.searchQuery, searchQuery);
  }, [searchQuery, storageKeys.searchQuery]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.selectedDealer, selectedDealer);
  }, [selectedDealer, storageKeys.selectedDealer]);

  useEffect(() => {
    fetchDetailsForAllVehicles();
  }, [vehiclesData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDetailsForAllVehicles();
    }, 2700);

    return () => {
      clearInterval(intervalId);
    };
  }, [vehiclesData, previousV6]);

  useEffect(() => {
    fetchHeartbeat();
    const id = setInterval(fetchHeartbeat, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const filtered = vehiclesData?.filter((vehicle) =>
      vehicle.vehicleId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(filtered);
    console.log("Filtered Vehicles:", filtered);
  }, [searchQuery, vehiclesData]);

  const batteryFaultConditions = [
    { code: [1], label: "Battery cell voltage issue" },
    { code: [3, 4], label: "Battery pack voltage issue" },
    { code: [5, 6], label: "Battery charge temperature issue" },
    { code: [7, 8], label: "Battery discharge temperature issue" },
    { code: [11], label: "Battery short circuit" },
    { code: [12], label: "BMS Malfunctioning" },
    { code: [13], label: "mosFET turned OFF" },
  ];
  const controllerFaultConditions = [
    { code: 49, label: "Controller overload fault" },
    { code: 10, label: "Motor overload fault" },
    { code: 18, label: "Controller encoder sensor disconnected" },
    { code: 12, label: "Motor terminals short circuited to ground" },
    { code: 17, label: "High motor temperature" },
    { code: 21, label: "Controller input low voltage" },
    { code: 20, label: "Controller input high voltage" },
  ];

  const resolveOnline = (vehicleId) => {
    const hb = heartbeatMap[vehicleId];
    if (hb !== undefined) return hb.alive;
    return newStatus[vehicleId] === "online";
  };

  const vehicleBuckets = useMemo(() => {
    const total = [...filteredVehicles];

    const active = total.filter(
      (vehicle) => resolveOnline(vehicle.vehicleId)
    );
    const offline = total.filter(
      (vehicle) => !resolveOnline(vehicle.vehicleId)
    );

    const parked = active.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const isOnline = resolveOnline(vehicle.vehicleId);
      const hbInfo = heartbeatMap[vehicle.vehicleId];
      const mode = parseValue(detail.v42);
      const parkFlag = parseValue(detail.v44);

      let statusLabel = "Vehicle Offline";
      if (isOnline) {
        if (mode === 3 && parkFlag === 1) statusLabel = "Vehicle Parked";
        else if (mode === 1) statusLabel = "Charger Connected";
        else if (mode === 2) statusLabel = "Vehicle Charging";
        else statusLabel = "Vehicle in Motion";
      } else {
        let secondsAgo = hbInfo?.secondsAgo;

        if ((secondsAgo === undefined || secondsAgo === null) && detail?.timestamp) {
          const currentUTCDate = new Date();
          const currentIST = new Date(currentUTCDate.getTime() + 5.5 * 60 * 60 * 1000);
          const detailIST = new Date(detail.timestamp);
          secondsAgo = Math.max(0, Math.floor((currentIST - detailIST) / 1000));
        }

        if (secondsAgo !== undefined && secondsAgo !== null) {
          const mins = Math.floor(secondsAgo / 60);
          const hours = Math.floor(mins / 60);
          if (hours > 24) statusLabel = `Offline (${Math.floor(hours / 24)}d ago)`;
          else if (hours > 0) statusLabel = `Offline (${hours}h ${mins % 60}m ago)`;
          else if (mins > 0) statusLabel = `Offline (${mins}m ago)`;
          else statusLabel = `Offline (${secondsAgo}s ago)`;
        }
      }

      return mode === 0 || (mode === 3 && parkFlag === 1);
    });

    const charging = active.filter((vehicle) => {
      const mode = parseValue(details[vehicle.vehicleId]?.v42);
      return mode === 1 || mode === 2;
    });

    const running = active.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const mode = parseValue(detail.v42);
      const parkFlag = parseValue(detail.v44);
      const isParked = mode === 0 || (mode === 3 && parkFlag === 1);
      const isCharging = mode === 1 || mode === 2;
      return !isParked && !isCharging;
    });

    const level5Issue = total.filter((vehicle) => {
      const batteryFault = parseValue(details[vehicle.vehicleId]?.v8);
      return batteryFault !== null && batteryFault > 0;
    });

    const level4Issue = total.filter((vehicle) => {
      const controllerFault = parseValue(details[vehicle.vehicleId]?.v7);
      const batteryFault = parseValue(details[vehicle.vehicleId]?.v8);
      return controllerFault !== null && controllerFault > 0 && batteryFault === 0;
    });

    const level3Issue = total.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const soc = parseValue(detail.v32);
      const cTemp = parseValue(detail.v45);
      const mTemp = parseValue(detail.v46);
      return (
        ((soc !== null && soc <= 5) ||
          (cTemp !== null && cTemp >= 65) ||
          (mTemp !== null && mTemp >= 160)) &&
        parseValue(detail.v7) === 0 &&
        parseValue(detail.v8) === 0
      );
    });

    const level2Issue = total.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const soc = parseValue(detail.v32);
      const cTemp = parseValue(detail.v45);
      const mTemp = parseValue(detail.v46);
      return (
        ((soc !== null && soc <= 10 && soc > 5) ||
          (cTemp !== null && cTemp >= 60 && cTemp < 65) ||
          (mTemp !== null && mTemp >= 150 && mTemp < 160)) &&
        parseValue(detail.v7) === 0 &&
        parseValue(detail.v8) === 0
      );
    });

    const level1Issue = total.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const soc = parseValue(detail.v32);
      const cTemp = parseValue(detail.v45);
      const mTemp = parseValue(detail.v46);
      return (
        ((soc !== null && soc <= 15 && soc > 10) ||
          (cTemp !== null && cTemp >= 50 && cTemp < 60) ||
          (mTemp !== null && mTemp >= 130 && mTemp < 150)) &&
        parseValue(detail.v7) === 0 &&
        parseValue(detail.v8) === 0
      );
    });

    const noIssue = total.filter((vehicle) => {
      const detail = details[vehicle.vehicleId] || {};
      const soc = parseValue(detail.v32);
      const cTemp = parseValue(detail.v45);
      const mTemp = parseValue(detail.v46);
      return (
        soc !== null &&
        soc >= 15 &&
        cTemp !== null &&
        cTemp <= 50 &&
        mTemp !== null &&
        mTemp <= 130 &&
        parseValue(detail.v7) === 0 &&
        parseValue(detail.v8) === 0
      );
    });

    return {
      total,
      active,
      offline,
      parked,
      running,
      charging,
      level1Issue,
      level2Issue,
      level3Issue,
      level4Issue,
      level5Issue,
      noIssue,
    };
  }, [filteredVehicles, newStatus, details]);

  const totalVehicles = vehicleBuckets.total.length;
  const activeVehicles = vehicleBuckets.active.length;
  const offlineVehicles = vehicleBuckets.offline.length;
  const parkedVehicles = vehicleBuckets.parked.length;
  const chargingVehicles = vehicleBuckets.charging.length;
  const runningVehicles = vehicleBuckets.running.length;
  const noIssueVehicles = vehicleBuckets.noIssue.length;
  const activeAlerts = Math.max(0, totalVehicles - noIssueVehicles);
  const statChips = [
    {
      key: "total",
      label: "Total",
      value: totalVehicles,
      text: isDark ? "#d7f8ec" : "#134e3b",
      bg: isDark ? "rgba(2,179,132,0.16)" : "rgba(2,179,132,0.12)",
      border: isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)",
    },
    {
      key: "active",
      label: "Active",
      value: activeVehicles,
      text: isDark ? "#d6f5ff" : "#0b4f6c",
      bg: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.11)",
      border: isDark ? "rgba(13,110,253,0.34)" : "rgba(13,110,253,0.22)",
    },
    {
      key: "offline",
      label: "Offline",
      value: offlineVehicles,
      text: isDark ? "#ececec" : "#3f3f46",
      bg: isDark ? "rgba(176,176,176,0.18)" : "rgba(120,120,120,0.13)",
      border: isDark ? "rgba(176,176,176,0.36)" : "rgba(120,120,120,0.22)",
    },
    {
      key: "parked",
      label: "Parked",
      value: parkedVehicles,
      text: isDark ? "#f3edff" : "#4c1d95",
      bg: isDark ? "rgba(119,93,208,0.24)" : "rgba(119,93,208,0.14)",
      border: isDark ? "rgba(119,93,208,0.4)" : "rgba(119,93,208,0.24)",
    },
    {
      key: "running",
      label: "Running",
      value: runningVehicles,
      text: isDark ? "#dcfff4" : "#064e3b",
      bg: isDark ? "rgba(0,211,139,0.2)" : "rgba(0,211,139,0.12)",
      border: isDark ? "rgba(0,211,139,0.38)" : "rgba(0,211,139,0.24)",
    },
    {
      key: "charging",
      label: "Charging",
      value: chargingVehicles,
      text: isDark ? "#fff6dc" : "#78350f",
      bg: isDark ? "rgba(254,176,25,0.2)" : "rgba(254,176,25,0.16)",
      border: isDark ? "rgba(254,176,25,0.4)" : "rgba(254,176,25,0.26)",
    },
    {
      key: "alerts",
      label: "Active Alerts",
      value: activeAlerts,
      text: isDark ? "#ffe0d4" : "#7f1d1d",
      bg: isDark ? "rgba(255,95,69,0.17)" : "rgba(255,95,69,0.12)",
      border: isDark ? "rgba(255,95,69,0.35)" : "rgba(255,95,69,0.22)",
    },
  ];

  const openVehicleListPage = (title, vehicles) => {
    navigate("/dashboard/fault-vehicles", {
      state: { title, vehicles },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: colors.palette[130],
        // "&::before": {
        //   content: "\"\"",
        //   position: "absolute",
        //   inset: 0,
        //   pointerEvents: "none",
        //   background: isDark
        //     ? "radial-gradient(circle at 12% 18%, rgba(0,211,139,0.18) 0%, rgba(0,211,139,0) 40%), radial-gradient(circle at 88% 76%, rgba(13,110,253,0.18) 0%, rgba(13,110,253,0) 45%)"
        //     : "radial-gradient(circle at 12% 18%, rgba(2,179,132,0.16) 0%, rgba(2,179,132,0) 40%), radial-gradient(circle at 88% 76%, rgba(13,110,253,0.12) 0%, rgba(13,110,253,0) 45%)",
        // },
        "& .fault-shell": {
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "0.9rem", md: "1.4rem 1.6rem 2rem 1.6rem" },
        },
        "& .glass-card": {
          border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
          background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.84)",
          boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
          // backdropFilter: "blur(8px)",
        },
        "& .summary-group": {
          borderRadius: "1rem",
          padding: "0.75rem",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.55)",
        },
        "& .summary-group-title": {
          fontSize: "0.76rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.palette[150],
          marginBottom: "0.55rem",
          paddingLeft: "0.2rem",
        },
        "& .fault-anim": {
          opacity: 0,
          transform: "translateY(16px)",
          animation: "faultFadeUp 540ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        },
        "& .fault-card": {
          transition: "transform 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: colors.palette[200] || colors.palette[210],
          },
        },
        "& .fault-delay-1": { animationDelay: "80ms" },
        "& .fault-delay-2": { animationDelay: "150ms" },
        "& .fault-delay-3": { animationDelay: "220ms" },
        "& .fault-delay-4": { animationDelay: "290ms" },
        "& .fault-delay-5": { animationDelay: "360ms" },
        "@keyframes faultFadeUp": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box className="fault-shell">
        {/* Top Controls */}
        <Box
          className="fault-anim fault-delay-1 glass-card fault-card"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          m={{ xs: "0 0 0.8rem 0", md: "0 0 1.25rem 0" }}
          p={{ xs: "1rem", md: "1.1rem 1.25rem" }}
          borderRadius="1rem"
          gap={2}
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
              Fault Dashboard
            </Box>
            <Box
              component="p"
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Live fault levels, issue distribution, and quick filters
            </Box>
            {/* <Box
              display="grid"
              gridTemplateColumns={{ xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }}
              gap={0.8}
              mt={1.1}
            > */}
            {/* {statChips.map((chip) => (
                <Box
                  key={chip.key}
                  sx={{
                    px: 1.05,
                    py: 0.45,
                    borderRadius: "0.7rem",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: chip.text,
                    background: chip.bg,
                    border: `1px solid ${chip.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip.label}: {chip.value}
                </Box> */}
            {/* ))}
            </Box> */}
          </Box>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row", md: "row" }}
            alignItems={{ xs: "stretch", sm: "center", md: "baseline" }}
            gap={2}
            width={{ xs: "100%", md: "auto" }}
          >
            <TextField
              label="Search VIN Number"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: "100%", sm: "15rem" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.25)",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.palette[500],
                },
                "& .MuiInputLabel-root": {
                  color: colors.palette[150],
                },
              }}
              size="small"
            />
            {props.role === "admin" && (
              <FormControl
                sx={{
                  minWidth: 200,
                  width: { xs: "100%", sm: "15rem" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.75rem",
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.25)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.palette[500],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.palette[150],
                  },
                }}
                size="small"
              >
                <InputLabel id="dealer-id-label">Dealer</InputLabel>
                <Select
                  labelId="dealer-id-label"
                  id="dealer-id"
                  value={selectedDealer}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedDealer(value);
                    if (value === "none") {
                      fetchVehicles();
                    } else {
                      fetchDealerTokenData(value);
                    }
                  }}
                  label="Dealer"
                >
                  <MenuItem value="none">None</MenuItem>
                  {userData.map((user) => (
                    <MenuItem key={user._id} value={user.dealerToken}>
                      {user.dealerToken}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {/* Main Panel */}
        <Box m={{ xs: 0, md: 0 }} className="fault-anim fault-delay-2">
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            gap={{ xs: 1.5, lg: 2 }}
          >
            {/* Summary Boxes */}
            <Box
              className="fault-anim fault-delay-3"
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
              gap={{ xs: 1.2, sm: 2 }}
              width={{ xs: "100%", lg: "34%" }}
              sx={{
                alignItems: "stretch",
                justifyItems: "stretch",
                gridAutoRows: "1fr",
                "& > *": {
                  width: "100%",
                },
              }}
            >
              <FaultBox2
                title="Total Vehicles"
                count={totalVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<LocalShippingIcon fontSize="large" />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Total Vehicles", vehicleBuckets.total)}
              />
              <FaultBox2
                title="Active Vehicles"
                count={activeVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<AssignmentTurnedInIcon fontSize="large" />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Active Vehicles", vehicleBuckets.active)}
              />
              <FaultBox2
                title="Offline Vehicles"
                count={offlineVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<CommentsDisabledIcon fontSize="large" />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Offline Vehicles", vehicleBuckets.offline)}
              />
              <FaultBox2
                title="Vehicles Parked"
                count={parkedVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<LuCircleParking size={32} />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Vehicles Parked", vehicleBuckets.parked)}
              />
              <FaultBox2
                title="Vehicles Charging"
                count={chargingVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<FaChargingStation size={32} />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Vehicles Charging", vehicleBuckets.charging)}
              />
              <FaultBox2
                title="Vehicles Running"
                count={runningVehicles}
                bgColor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}
                textColor={colors.palette[100]}
                icon={<DoubleArrowIcon fontSize="large" />}
                squircleBg={colors.palette[550]}
                onClick={() => openVehicleListPage("Vehicles Running", vehicleBuckets.running)}
              />
            </Box>

            {/* Issues Section */}
            <Box
              className="fault-anim fault-delay-3 fault-card"
              width={{ xs: "100%", lg: "66%" }}
              p={{ xs: 1.2, md: 1.5 }}
              borderRadius="1rem"
              minWidth={0}
              boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
              sx={{
                background: `${isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255,255,255,0.88)"}`,
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Header / Menu */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={0.6}
              >
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ color: colors.palette[100], letterSpacing: "0.02em", fontSize: { xs: "1.15rem", md: "1.35rem" } }}
                  >
                    Issues Related to Vehicle
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: colors.palette[150], mt: 0.25 }}>
                    Severity level distribution for filtered vehicles
                  </Typography>
                  {/* <Box
                    sx={{
                      mt: 0.75,
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.35,
                      borderRadius: "999px",
                      border: `1px solid ${isDark ? "rgba(255,95,69,0.35)" : "rgba(255,95,69,0.22)"}`,
                      background: isDark ? "rgba(255,95,69,0.16)" : "rgba(255,95,69,0.1)",
                      color: isDark ? "#ffd9cf" : "#7f1d1d",
                      fontWeight: 700,
                      fontSize: "0.74rem",
                    }}
                  >
                    Vehicles With Issues: {activeAlerts}
                  </Box> */}
                </Box>
                <IconButton
                  onClick={handleClick}
                  sx={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                    borderRadius: "0.65rem",
                  }}
                >
                  <MoreVertIcon sx={{ color: colors.palette[100] }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    style: {
                      padding: "0.75rem 0.9rem",
                      minWidth: 268,
                      borderRadius: "0.75rem",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)"}`,
                      background: isDark ? "rgba(16, 23, 31, 0.95)" : "rgba(255,255,255,0.97)",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1, fontSize: "0.9rem", color: colors.palette[100] }}>
                    Severity Rules
                  </Typography>
                  {[
                    {
                      level: "Level 1",
                      rules: ["SOC <= 15%", "Controller temp >= 50 deg C", "Motor temp >= 130 deg C"],
                    },
                    {
                      level: "Level 2",
                      rules: ["SOC <= 10%", "Controller temp >= 60 deg C", "Motor temp >= 150 deg C"],
                    },
                    {
                      level: "Level 3",
                      rules: ["SOC <= 5%", "Controller temp >= 65 deg C", "Motor temp >= 160 deg C"],
                    },
                    { level: "Level 4", rules: ["Controller faults"] },
                    { level: "Level 5", rules: ["Battery faults"] },
                  ].map((item) => (
                    <Box key={item.level} sx={{ mb: 1.05 }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: colors.palette[100], mb: 0.4 }}>
                        {item.level}
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2.2, color: colors.palette[150], fontSize: "0.76rem" }}>
                        {item.rules.map((rule) => (
                          <Box key={rule} component="li" sx={{ mb: 0.15 }}>
                            {rule}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Menu>
              </Box>

              {/* Fault Levels */}
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr 1fr", // phones: 2 per row
                  sm: "1fr 1fr", // small tablets: still 2 per row
                  md: "1fr 1fr 1fr", // tablets >=900px: 3 per row
                  lg: "repeat(5, 1fr)", // desktop: all in a row (5 per row)
                }}
                gap={2}
                mt={3}
              >
                <FaultBox
                  title={"Level 5 Issue"}
                  count={vehicleBuckets.level5Issue.length}
                  bgColor={colors.palette[1400]}
                  textColor={colors.palette[100]}
                  icon={<BatteryAlertIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={colors.palette[1250]}
                  iconColor={colors.palette[110]}
                  onClick={() => openVehicleListPage("Level 5 Issue", vehicleBuckets.level5Issue)}
                />

                <FaultBox
                  title={"Level 4 Issue"}
                  count={vehicleBuckets.level4Issue.length}
                  bgColor={"#ff5f45"}
                  textColor={colors.palette[100]}
                  icon={<MemoryIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={colors.palette[1250]}
                  iconColor={colors.palette[110]}
                  onClick={() => openVehicleListPage("Level 4 Issue", vehicleBuckets.level4Issue)}
                />
                <FaultBox
                  title={"Level 3 Issue"}
                  count={vehicleBuckets.level3Issue.length}
                  bgColor={"#ff9245"}
                  textColor={colors.palette[100]}
                  icon={<PriorityHighIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={colors.palette[1400]}
                  iconColor={colors.palette[110]}
                  onClick={() => openVehicleListPage("Level 3 Issue", vehicleBuckets.level3Issue)}
                />

                <FaultBox
                  title={"Level 2 Issue"}
                  count={vehicleBuckets.level2Issue.length}
                  bgColor={colors.palette[1300]}
                  textColor={colors.palette[100]}
                  icon={<PriorityHighIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={"#ff9245"}
                  iconColor={colors.palette[110]}
                  onClick={() => openVehicleListPage("Level 2 Issue", vehicleBuckets.level2Issue)}
                />

                <FaultBox
                  title={"Level 1 Issue"}
                  count={vehicleBuckets.level1Issue.length}
                  bgColor={"#fed719"}
                  textColor={colors.palette[100]}
                  icon={<PriorityHighIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={"#fed719"}
                  iconColor={colors.palette[110]}
                  onClick={() => openVehicleListPage("Level 1 Issue", vehicleBuckets.level1Issue)}
                />
              </Box>

              {/* Bottom Fault Boxes */}
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-around"
                gap={2}
                mt={2}
              >
                <FaultBox
                  title={"Vehicles with No Issues"}
                  count={noIssueVehicles}
                  bgColor={colors.palette[550]}
                  textColor={colors.palette[100]}
                  icon={<PriorityHighIcon style={{ fontSize: "1.5rem" }} />}
                  iconBg={colors.palette[550]}
                  iconColor={colors.palette[110]}
                  onClick={() =>
                    openVehicleListPage("Vehicles with No Issues", vehicleBuckets.noIssue)
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Fault Table Section */}
        <Box m={{ xs: "0.9rem 0 0 0", md: "1rem 0 0 0" }} className="fault-anim fault-delay-4">
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={{ xs: 2, md: 2 }}
            width="100%"
          >
            {/* Controller/Motor Issues Table */}
            <TableContainer
              className="fault-anim fault-delay-5 fault-card"
              component={Paper}
              sx={{
                width: "100%",
                maxWidth: { xs: "100vw", md: "calc(50% - 10px)" },
                overflowX: "auto",
                mb: { xs: 2, md: 0 },
                background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.86)",
                borderRadius: "1rem",
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
                boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)" }}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="600" fontSize={"1.1rem"}>
                        Issue related to Controller/ Motor
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="600" fontSize={"1.1rem"}>
                        No. of Vehicles
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {controllerFaultConditions.map(({ code, label }) => (
                    <TableRow
                      key={label}
                      sx={{
                        "&:nth-of-type(even)": {
                          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.95rem", fontWeight: 400 }}>{label}</TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", fontWeight: 500, color: colors.palette[100] }}>
                        {
                          filteredVehicles.filter(
                            (vehicle) => details[vehicle.vehicleId]?.v7 === code
                          ).length
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Battery Issues Table */}
            <TableContainer
              className="fault-anim fault-delay-5 fault-card"
              component={Paper}
              sx={{
                width: "100%",
                maxWidth: { xs: "100vw", md: "calc(50% - 10px)" },
                overflowX: "auto",
                mb: { xs: 2, md: 0 },
                background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.86)",
                borderRadius: "1rem",
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
                boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)" }}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="600" fontSize={"1.1rem"}>
                        Issue related to Battery
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="600" fontSize={"1.1rem"}>
                        No. of Vehicles
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batteryFaultConditions.map(({ code, label }) => (
                    <TableRow
                      key={label}
                      sx={{
                        "&:nth-of-type(even)": {
                          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.95rem", fontWeight: 400 }}>{label}</TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", fontWeight: 500, color: colors.palette[100] }}>
                        {
                          filteredVehicles.filter((vehicle) => {
                            const batteryFault = details[vehicle.vehicleId]?.v8;
                            return code.includes(batteryFault);
                          }).length
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
