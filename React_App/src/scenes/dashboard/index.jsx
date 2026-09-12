import React, { useEffect, useMemo, useState } from "react";
import {
  useTheme,
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DataDownload from "../../components/DataDownload";
import DataDelete from "../../components/DataDelete";
import { tokens } from "../../theme";

const parseValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getVehicleRoute = (role) => {
  if (role === "admin" || role === "service") return "/template-1";
  if (role === "financer") return "/template-3";
  return "/template-2";
};

const getVehicleStatusLabel = (detail, isOnline, loading, redisSecondsAgo) => {
  if (loading && (redisSecondsAgo === undefined || redisSecondsAgo === null)) return "Loading...";
  
  if (!isOnline) {
    let secondsAgo = redisSecondsAgo;
    
    // Fallback: If Redis isn't configured, calculate time since last MongoDB telemetry
    if ((secondsAgo === undefined || secondsAgo === null) && detail?.timestamp) {
      const currentUTCDate = new Date();
      // timestamp in DB is saved as IST shifted, so we shift current time to match
      const currentIST = new Date(currentUTCDate.getTime() + 5.5 * 60 * 60 * 1000);
      const detailIST = new Date(detail.timestamp);
      secondsAgo = Math.max(0, Math.floor((currentIST - detailIST) / 1000));
    }

    if (secondsAgo !== undefined && secondsAgo !== null) {
       const mins = Math.floor(secondsAgo / 60);
       const hours = Math.floor(mins / 60);
       
       if (hours > 24) {
           const days = Math.floor(hours / 24);
           return `Offline (${days}d ago)`;
       } else if (hours > 0) {
           return `Offline (${hours}h ${mins % 60}m ago)`;
       } else if (mins > 0) {
           return `Offline (${mins}m ago)`;
       }
       return `Offline (${secondsAgo}s ago)`;
    }
    return "Vehicle Offline";
  }

  const mode = parseValue(detail?.v42);
  const parkFlag = parseValue(detail?.v44);

  if (mode === 3 && parkFlag === 1) return "Vehicle Parked";
  if (mode === 1) return "Charger Connected";
  if (mode === 2) return "Vehicle Charging";
  return "Vehicle in Motion";
};

const getVehicleName = (vehicle) => vehicle?.name || vehicle?.vehicleNo || vehicle?.vehicleId || "";

const getVehicleCreatedTimestamp = (vehicle) => {
  const createdValue =
    vehicle?.createdAt ??
    vehicle?.created_at ??
    vehicle?.createdOn ??
    vehicle?.created_on ??
    vehicle?.timestamp ??
    null;

  if (createdValue === null || createdValue === undefined) return 0;

  if (typeof createdValue === "number") {
    if (!Number.isFinite(createdValue)) return 0;
    return createdValue < 1e12 ? createdValue * 1000 : createdValue;
  }

  const dateValue = Date.parse(String(createdValue));
  return Number.isNaN(dateValue) ? 0 : dateValue;
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
  const isDark = theme.palette.mode === "dark";
  const storagePrefix = `vehicleDashboard:${props.role || "unknown"}:${props.accessToken || ""}:${props.dealerToken || ""}:${props.financeToken || ""}`;
  const storageKeys = {
    vehicles: `${storagePrefix}:vehicles`,
    details: `${storagePrefix}:details`,
    status: `${storagePrefix}:status`,
    previousV6: `${storagePrefix}:previousV6`,
    searchQuery: `${storagePrefix}:searchQuery`,
    statusFilter: `${storagePrefix}:statusFilter`,
    sortBy: `${storagePrefix}:sortBy`,
  };
  const initialVehicles = readSessionJson(storageKeys.vehicles, []);
  const initialDetails = readSessionJson(storageKeys.details, {});
  const initialStatus = readSessionJson(storageKeys.status, {});
  const initialPreviousV6 = readSessionJson(storageKeys.previousV6, {});
  const hasCachedVehicles = initialVehicles.length > 0;

  const [vehiclesData, setVehiclesData] = useState(initialVehicles);
  const [details, setDetails] = useState(initialDetails);
  const [previousV6, setPreviousV6] = useState(initialPreviousV6);
  const [newStatus, setNewStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(!hasCachedVehicles);
  const [searchQuery, setSearchQuery] = useState(
    () => readSessionString(storageKeys.searchQuery, "")
  );
  const [statusFilter, setStatusFilter] = useState(
    () => readSessionString(storageKeys.statusFilter, "all")
  );
  const [sortBy, setSortBy] = useState(
    () => readSessionString(storageKeys.sortBy, "name_asc")
  );
  const [isInitialLoad, setIsInitialLoad] = useState(
    () => Object.keys(initialPreviousV6).length === 0
  );
  // heartbeatMap: { [vehicleId]: { alive: boolean, secondsAgo: number|null } }
  // Populated by /api/sse/heartbeat (Redis-based). Empty = Redis not configured → fall back to v6.
  const [heartbeatMap, setHeartbeatMap] = useState({});

  const handleNavigate = (vehicleId, vehicleNo, vehicleModel) => {
    props.onVehicleIdClick(vehicleId, vehicleNo, vehicleModel);
  };

  const fetchDetailsForAllVehicles = async () => {
    if (!vehiclesData.length) {
      setLoading(false);
      return;
    }

    const detailsMap = {};
    const nextPreviousV6 = { ...previousV6 };
    const statusMap = {};

    await Promise.all(
      vehiclesData.map(async (vehicle) => {
        try {
          const response = await fetch(
            `${colors.palette[50]}/getdata?user=${vehicle.vehicleId}`
          );

          if (response.ok) {
            const result = await response.json();
            detailsMap[vehicle.vehicleId] = result;

            if (!isInitialLoad) {
              statusMap[vehicle.vehicleId] =
                previousV6[vehicle.vehicleId] === result.v6 ? "offline" : "online";
            } else {
              statusMap[vehicle.vehicleId] = "loading";
            }

            nextPreviousV6[vehicle.vehicleId] = result.v6;
          }
        } catch (error) {
          console.error(`Error fetching details for vehicle ${vehicle.vehicleId}:`, error);
          if (details[vehicle.vehicleId]) {
            detailsMap[vehicle.vehicleId] = details[vehicle.vehicleId];
          }
          if (previousV6[vehicle.vehicleId] !== undefined) {
            nextPreviousV6[vehicle.vehicleId] = previousV6[vehicle.vehicleId];
          }
          statusMap[vehicle.vehicleId] = newStatus[vehicle.vehicleId] || "loading";
        }
      })
    );

    sessionStorage.setItem(storageKeys.details, JSON.stringify(detailsMap));
    sessionStorage.setItem(storageKeys.status, JSON.stringify(statusMap));
    sessionStorage.setItem(storageKeys.previousV6, JSON.stringify(nextPreviousV6));

    setDetails(detailsMap);
    setPreviousV6(nextPreviousV6);
    setNewStatus(statusMap);
    setLoading(false);

    if (isInitialLoad) setIsInitialLoad(false);
  };

  // Fetch fleet-wide heartbeat (one call for all vehicles via Redis TTL)
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
      // Redis not configured or network error — v6 comparison remains active
    }
  };

  useEffect(() => {
    if (hasCachedVehicles) {
      setLoading(false);
    }
  }, [hasCachedVehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${colors.palette[50]}/vehicles`, {
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
      });
      const data = await response.json();
      setVehiclesData(data);
      sessionStorage.setItem(storageKeys.vehicles, JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehiclesData([]);
      sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
      setLoading(false);
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
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
      } else {
        setVehiclesData(result);
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify(result));
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehiclesData([]);
      sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
      setLoading(false);
    }
  };

  const fetchDealerTokenData = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/dealer/vehicles?dealerToken=${props.dealerToken}`
      );
      const result = await response.json();

      if (
        result.error === "No vehicles found for the provided dealerToken" ||
        result.length === 0
      ) {
        setVehiclesData([]);
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
      } else {
        setVehiclesData(result);
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify(result));
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehiclesData([]);
      sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
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
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
      } else {
        setVehiclesData(result);
        sessionStorage.setItem(storageKeys.vehicles, JSON.stringify(result));
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehiclesData([]);
      sessionStorage.setItem(storageKeys.vehicles, JSON.stringify([]));
    }
  };

  useEffect(() => {
    setLoading(!hasCachedVehicles);
    if (props.role === "admin") {
      fetchVehicles();
    } else if (props.role === "service") {
      fetchDealerTokenData();
    } else if (props.role === "financer") {
      fetchFinanceTokenData();
    } else {
      fetchSelectedVehicles();
    }
  }, []);

  useEffect(() => {
    if (vehiclesData.length) {
      fetchDetailsForAllVehicles();
    } else {
      setLoading(false);
    }
  }, [vehiclesData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDetailsForAllVehicles();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [vehiclesData, previousV6]);

  // Poll fleet heartbeat every 5s (independent of data fetch)
  useEffect(() => {
    fetchHeartbeat();
    const id = setInterval(fetchHeartbeat, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.searchQuery, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.statusFilter, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    sessionStorage.setItem(storageKeys.sortBy, sortBy);
  }, [sortBy]);

  const displayVehicles = useMemo(() => {
    let list = [...(vehiclesData || [])];

    const normalizedSearch = searchQuery.toLowerCase().trim();
    if (normalizedSearch) {
      list = list.filter((vehicle) => {
        const vehicleNo = (vehicle.vehicleNo || "").toLowerCase();
        const vehicleName = (vehicle.name || "").toLowerCase();
        return vehicleNo.includes(normalizedSearch) || vehicleName.includes(normalizedSearch);
      });
    }

    if (statusFilter === "online") {
      list = list.filter((vehicle) => !loading && newStatus[vehicle.vehicleId] === "online");
    } else if (statusFilter === "offline") {
      list = list.filter((vehicle) => loading || newStatus[vehicle.vehicleId] !== "online");
    }

    switch (sortBy) {
      case "name_desc":
        list.sort((a, b) => getVehicleName(b).localeCompare(getVehicleName(a)));
        break;
      case "created_newest":
        list.sort((a, b) => getVehicleCreatedTimestamp(b) - getVehicleCreatedTimestamp(a));
        break;
      case "created_oldest":
        list.sort((a, b) => getVehicleCreatedTimestamp(a) - getVehicleCreatedTimestamp(b));
        break;
      case "name_asc":
      default:
        list.sort((a, b) => getVehicleName(a).localeCompare(getVehicleName(b)));
        break;
    }

    return list;
  }, [vehiclesData, searchQuery, statusFilter, sortBy, newStatus, loading]);

  // Helper: resolve online status — prefer Redis heartbeat, fall back to v6 comparison
  const resolveOnline = (vehicleId) => {
    const hb = heartbeatMap[vehicleId];
    if (hb !== undefined) return hb.alive;
    return !loading && newStatus[vehicleId] === "online";
  };

  const onlineCount = loading
    ? 0
    : displayVehicles.filter((v) => resolveOnline(v.vehicleId)).length;

  const offlineCount = Math.max(0, displayVehicles.length - onlineCount);
  const templateRoute = getVehicleRoute(props.role);

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
        "& .dash-shell": {
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "0.9rem", md: "1.4rem 1.6rem 2rem 1.6rem" },
        },
        "@keyframes dashPulse": {
          "0%": { opacity: 0.45, transform: "scale(0.92)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      }}
    >
      <Box className="dash-shell">
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          m={{ xs: "0 0 0.85rem 0", md: "0 0 1.2rem 0" }}
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={isDark ? "rgba(61, 66, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"}
          sx={{
            backdropFilter: "blur(8px)",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
          }}
          boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
          gap={2}
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
              Vehicles Dashboard
            </Typography>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Live status and quick access to fleet details
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1.1}>
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
                Total: {vehiclesData.length}
              </Box>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#ececec" : "#3f3f46",
                  background: isDark ? "rgba(176,176,176,0.18)" : "rgba(120,120,120,0.13)",
                  border: `1px solid ${isDark ? "rgba(176,176,176,0.36)" : "rgba(120,120,120,0.22)"}`,
                }}
              >
                Showing: {displayVehicles.length}
              </Box>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#d6f5ff" : "#0b4f6c",
                  background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.11)",
                  border: `1px solid ${isDark ? "rgba(13,110,253,0.34)" : "rgba(13,110,253,0.22)"}`,
                }}
              >
                Online: {onlineCount}
              </Box>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#ececec" : "#3f3f46",
                  background: isDark ? "rgba(176,176,176,0.18)" : "rgba(120,120,120,0.13)",
                  border: `1px solid ${isDark ? "rgba(176,176,176,0.36)" : "rgba(120,120,120,0.22)"}`,
                }}
              >
                Offline: {offlineCount}
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="flex-end"
            gap={1.25}
            width={{ xs: "100%", sm: "auto" }}
          >
            <TextField
              label="Search Vehicle Number"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: "250px" },
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.palette[150], fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 150 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 170 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                },
              }}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(event) => setSortBy(event.target.value)}
              >
                <MenuItem value="name_asc">Name A-Z</MenuItem>
                <MenuItem value="name_desc">Name Z-A</MenuItem>
                <MenuItem value="created_newest">New - Old</MenuItem>
                <MenuItem value="created_oldest">Old - New</MenuItem>
              </Select>
            </FormControl>

            <DataDownload user={props.user} vehicle={vehiclesData} />
            <DataDelete user={props.user} vehicle={vehiclesData} />
          </Box>
        </Box>

        {displayVehicles.length === 0 ? (
          <Box
            p={{ xs: 2, md: 3 }}
            borderRadius="1rem"
            border={isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)"}
            bgcolor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"}
            sx={{ backdropFilter: "blur(8px)" }}
            boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
            textAlign="center"
          >
            <Typography sx={{ color: colors.palette[100], fontWeight: 700, mb: 0.5 }}>
              No vehicles found
            </Typography>
            <Typography sx={{ color: colors.palette[150], fontSize: "0.88rem" }}>
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting search or filters."
                : "No vehicles are available for this account."}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {displayVehicles.map((vehicle, index) => {
              const detail = details[vehicle.vehicleId];
              const onlineStatus = newStatus[vehicle.vehicleId];
              const isOnline = resolveOnline(vehicle.vehicleId);
              const hbInfo = heartbeatMap[vehicle.vehicleId]; // { alive, secondsAgo } | undefined
              const statusLabel = getVehicleStatusLabel(detail, isOnline, loading, hbInfo?.secondsAgo);
              const soc = parseValue(detail?.v32);
              const odometer = parseValue(detail?.v41);

              return (
                <Box
                  key={vehicle.vehicleId}
                  sx={{
                    borderRadius: "1rem",
                    p: 1.1,
                    bgcolor: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)",
                    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
                    boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
                    backdropFilter: "blur(8px)",
                    animation: "dashPulse 700ms ease forwards",
                    animationDelay: `${80 + index * 40}ms`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                      marginBottom: "0.8rem",
                      paddingBottom: "0.55rem",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {loading ? (
                        <Box
                          sx={{
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "0.9rem",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "dashPulse 900ms ease-in-out infinite alternate",
                          }}
                        >
                          <LocalShippingIcon sx={{ color: colors.palette[500] }} />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            width: "2.7rem",
                            height: "2.7rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0.9rem",
                            background: isOnline ? colors.palette[500] : colors.palette[700],
                          }}
                        >
                          <LocalShippingIcon
                            style={{
                              fontSize: "1.5rem",
                              color: isDark ? colors.palette[110] : "#ffffff",
                            }}
                          />
                        </Box>
                      )}

                      <Box>
                        <Typography sx={{ color: colors.palette[100], fontWeight: 700, fontSize: "1rem", lineHeight: 1.1 }}>
                          {vehicle.name || "Vehicle"}
                        </Typography>
                        <Typography sx={{ color: colors.palette[150], fontWeight: 600, fontSize: "0.84rem" }}>
                          {vehicle.vehicleNo}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      component={Link}
                      to={templateRoute}
                      onClick={() => handleNavigate(vehicle.vehicleId, vehicle.vehicleNo, vehicle.name)}
                      aria-label="open vehicle dashboard"
                      sx={{
                        minWidth: "2.5rem",
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "0.7rem",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                        color: colors.palette[500],
                      }}
                    >
                      <DoubleArrowIcon />
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "999px",
                      px: 1.1,
                      py: 0.42,
                      border: `1px solid ${
                        isOnline
                          ? isDark
                            ? "rgba(2,179,132,0.44)"
                            : "rgba(2,179,132,0.3)"
                          : isDark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.18)"
                      }`,
                      color: isOnline ? colors.palette[510] : colors.palette[150],
                      background: isOnline
                        ? isDark
                          ? "rgba(2,179,132,0.14)"
                          : "rgba(2,179,132,0.1)"
                        : isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.04)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {statusLabel}
                  </Box>

                  <Box mt={1.05} sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                    <Box
                      sx={{
                        borderRadius: "0.7rem",
                        p: "0.5rem 0.65rem",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.08)"}`,
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: colors.palette[150] }}>
                        Battery SOC
                      </Typography>
                      <Typography sx={{ fontSize: "1.02rem", color: colors.palette[100], fontWeight: 700 }}>
                        {soc !== null ? `${soc}%` : "--"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        borderRadius: "0.7rem",
                        p: "0.5rem 0.65rem",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.08)"}`,
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: colors.palette[150] }}>
                        Odometer
                      </Typography>
                      <Typography sx={{ fontSize: "1.02rem", color: colors.palette[100], fontWeight: 700 }}>
                        {odometer !== null ? `${odometer} km` : "--"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
