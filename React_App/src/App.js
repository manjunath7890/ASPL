import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  ThemeProvider
} from "@mui/material";
import {
  ColorModeContext,
  useMode,
  tokens
} from "./theme";

// Global Components
import Topbar from "./scenes/global/Topbar";
import SideBar from "./scenes/global/Sidebar";

// Landing & Auth Pages
import HomeLanding from "./scenes/home/Home";
import Login from "./scenes/form/login";
import ForgotPassword from './scenes/form/ForgotPassword';
import VerifyOTP from './scenes/form/VerifyOTP';
import ResetPassword from './scenes/form/ResetPassword';
import BuzzInfo from './scenes/buzzInfo/BuzzInfo';
import LiteInfo from './scenes/liteInfo/LiteInfo';
import BuzzDetails from './scenes/buzzInfo/BuzzDetails';
import LiteDetails from './scenes/liteInfo/LiteDetails';

// Dashboard Templates
import Home from "./scenes/dashboard";
import HomeDashboard from "./home/Home";
import D1 from "./scenes/dashboard/d1";
import D3 from "./scenes/dashboard/d3";
import D4 from "./scenes/dashboard/d4";
import FaultDashboard from "./scenes/faultcode/FaultDashboard";
import FaultVehiclesList from "./scenes/faultcode/FaultVehiclesList";

// Tables
import UserTable from "./scenes/Tables/UserTable";
import VehicleTable from "./scenes/Tables/VehicleTable";
import Tables from "./scenes/Tables/DealerTable";

// Analytics
import BAR from "./scenes/bar";
import AnalyticsTemplate from "./scenes/Analytics/Analytics";
import TableAnalytics from "./scenes/multiAnalytics";
// import FaultTableAnalytics from "./scenes/faultcode/FaultTable"; // If needed

// Details
import PartsFormAndTable from "./scenes/details/PartsTable";
import ReplacedPartsFormAndTable from "./scenes/details/ReplacedPartsTable";

function App() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const authSurfaceBorder =
    theme.palette.mode === "dark"
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)";
  const authSurfaceShadow =
    theme.palette.mode === "dark"
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)";

  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = location.pathname === "/" || location.pathname === "/login" ||
      location.pathname === "/forgot-password" || location.pathname === "/verify-otp" ||
      location.pathname === "/reset-password" || location.pathname === "/buzz-info" ||
      location.pathname === "/lite-info" || location.pathname.startsWith("/buzz-info") ||
      location.pathname.startsWith("/lite-info");

  // Auth & User State
  const [path, setPath] = useState(); // role
  const [token, setToken] = useState();
  const [dealerToken, setDealerToken] = useState();
  const [financeToken, setFinanceToken] = useState();
  const [dealerTokenId, setDealerTokenId] = useState();
  const [userName, setUserName] = useState([]);

  // Vehicle State
  const [receivedVehicleNumber, setReceivedVehicleNumber] = useState([]);
  const [receivedChassisNumber, setReceivedChassisNumber] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState([]);
  const [vehicleModel, setVehicleModel] = useState([]);
  const [vehicleId, setVehicleId] = useState([]);

  // Parts State
  const [partId, setPartId] = useState([]);

  // Map API Token
  const [mapAPI, setMapAPI] = useState([]);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handler for Login Callback
  const handleDataFromChild = (role, accessToken, dealerToken, financeToken) => {
    setPath(role);
    setToken(accessToken);
    setDealerToken(dealerToken);
    setFinanceToken(financeToken);
  };

  // Handler for vehicle list click
  const handleVehiclesData = (vehicleId, vehicleNumber, vehicleModel) => {
    setVehicleId(vehicleId);
    setVehicleNumber(vehicleNumber);
    setVehicleModel(vehicleModel);
  };

  // Handler for vehicle selection (number and chassis)
  const handleVehicleNumber = (chassisNo, vehicleNo) => {
    setReceivedVehicleNumber(vehicleNo);
    setReceivedChassisNumber(chassisNo);
  };

  // Handler for selected part
  const handlePartId = (partId) => {
    setPartId(partId);
  };

  // Handler for dealer click
  const handleDealerClick = (user, dealerToken) => {
    setDealerTokenId(dealerToken);
    setUserName(user);
  };

  // Fetch Map API Token when path (role) is set
  useEffect(() => {
    if (path) {
      const fetchMapAPI = async () => {
        try {
          const response = await fetch(`${colors.palette[50]}/map-api/token`);
          if (response.ok) {
            const mapAPI = await response.json();
            setMapAPI(mapAPI.access_token);
          } else {
            console.log('Failed to fetch map API.');
          }
        } catch (error) {
          console.error('Error fetching map API:', error);
        }
      };
      fetchMapAPI();
    }
  }, [path]);

  // On hard reload, if auth role state is empty, send user to landing page.
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const isReload =
      navigationEntries.length > 0
        ? navigationEntries[0].type === "reload"
        : window.performance?.navigation?.type === 1;

    const authPages = new Set([
      "/",
      "/login",
      "/forgot-password",
      "/verify-otp",
      "/reset-password",
      "/buzz-info",
      "/lite-info",
    ]);

    const isAuthPage =
      authPages.has(location.pathname) ||
      location.pathname.startsWith("/buzz-info") ||
      location.pathname.startsWith("/lite-info");

    if (isReload && !path && !isAuthPage) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate, path]);

  // Disable right-click context menu globally
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" width="100%">
          {/* Sidebar - hide on landing and login */}
          {path && !isAuth && <SideBar isOpen={sidebarOpen} role={path} />}

          <Box
            flex="1"
            width="100%"
            sx={
              !isAuth
                ? {
                    minHeight: "100vh",
                    background: colors.palette[130],
                    "& .MuiPaper-root": {
                      border: authSurfaceBorder,
                      boxShadow: authSurfaceShadow,
                    },
                    "& .MuiCard-root": {
                      border: authSurfaceBorder,
                      boxShadow: authSurfaceShadow,
                    },
                    "& .MuiTableContainer-root": {
                      border: authSurfaceBorder,
                      boxShadow: authSurfaceShadow,
                    },
                  }
                : undefined
            }
          >
            {/* Topbar */}
            {!isAuth && (
              path && <Topbar role={path} onBrandClick={() => setSidebarOpen(!sidebarOpen)} />
            )}

            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/login" element={<Login onLogin={handleDataFromChild} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/buzz-info" element={<BuzzInfo />} />
              <Route path="/buzz-info/:id" element={<BuzzDetails />} />
              <Route path="/lite-info" element={<LiteInfo />} />
              <Route path="/lite-info/:id" element={<LiteDetails />} />

              {/* Protected Routes */}
              {path && (
                <>
                  <Route
                    path="/vehicles-list"
                    element={
                      <Home
                        onVehicleIdClick={handleVehiclesData}
                        accessToken={token}
                        role={path}
                        dealerToken={dealerToken}
                        financeToken={financeToken}
                      />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <FaultDashboard
                        role={path}
                        accessToken={token}
                        dealerToken={dealerToken}
                        financeToken={financeToken}
                        mapKey={mapAPI}
                      />
                    }
                  />
                  <Route
                    path="/dashboard/fault-vehicles"
                    element={
                      <FaultVehiclesList
                        role={path}
                        onVehicleIdClick={handleVehiclesData}
                      />
                    }
                  />
                  <Route
                    path="/template-1"
                    element={
                      <D1
                        vehicleData={vehicleId}
                        mapKey={mapAPI}
                        role={path}
                        vehicleNo={vehicleNumber}
                        vehicleModel={vehicleModel}
                      />
                    }
                  />
                  <Route
                    path="/template-2"
                    element={
                      <D3
                        vehicleData={vehicleId}
                        mapKey={mapAPI}
                        role={path}
                        vehicleNo={vehicleNumber}
                        vehicleModel={vehicleModel}
                      />
                    }
                  />
                  <Route
                    path="/template-3"
                    element={
                      <D4
                        vehicleData={vehicleId}
                        mapKey={mapAPI}
                        role={path}
                        vehicleNo={vehicleNumber}
                        vehicleModel={vehicleModel}
                      />
                    }
                  />
                  <Route
                    path="/vehicle-table"
                    element={
                      <VehicleTable
                        onVehicleNumberClick={handleVehicleNumber}
                        role={path}
                        accessToken={token}
                        dealerToken={dealerToken}
                      />
                    }
                  />
                  <Route
                    path="/user-table"
                    element={
                      <UserTable
                        role={path}
                        dealerToken={dealerToken}
                        onDealerClick={handleDealerClick}
                      />
                    }
                  />
                  <Route
                    path="/moredetails"
                    element={
                      <Tables
                        role={path}
                        dealerToken={dealerTokenId}
                        user={userName}
                      />
                    }
                  />
                  <Route
                    path="/analytics/graph"
                    element={
                      <BAR
                        role={path}
                        accessToken={token}
                        dealerToken={dealerToken}
                      />
                    }
                  />
                  <Route
                    path="/analytics/dashboard"
                    element={
                      <AnalyticsTemplate
                        role={path}
                        accessToken={token}
                        dealerToken={dealerToken}
                        mapKey={mapAPI}
                      />
                    }
                  />
                  <Route
                    path="/analytics/summary"
                    element={
                      <TableAnalytics
                        role={path}
                        accessToken={token}
                        dealerToken={dealerToken}
                      />
                    }
                  />
                  <Route
                    path="/materials/form"
                    element={
                      <PartsFormAndTable
                        onPartIdClick={handlePartId}
                        chassisNumber={receivedChassisNumber}
                        vehicleNumber={receivedVehicleNumber}
                        role={path}
                      />
                    }
                  />
                  <Route
                    path="/replaced/materials/form"
                    element={
                      <ReplacedPartsFormAndTable
                        chassisNumber={receivedChassisNumber}
                        partId={partId}
                      />
                    }
                  />
                </>
              )}
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
