import React, { useEffect, useState } from "react";
import { Box, FormControl, MenuItem, useTheme, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import RepoData from "../../components/ReportData";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AddIcon from "@mui/icons-material/AddCircle";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SpeedIcon from "@mui/icons-material/Speed";
import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import ScaleIcon from "@mui/icons-material/Scale";
import MemoryIcon from "@mui/icons-material/Memory";
import RepoVehicleDetails from "../../components/ReportVehicleDetails";
import ReportTable from "../../components/ReportTable";
import BarChart from "../../components/ReportBarChart";
import Polarchart from "../../components/PolarChart";
import MapleMaps from "../../components/ReportMap";
import CellPack from "../../components/ChargingPack";

const useStyles = makeStyles(() => ({
  topBlock: {
    height: "7rem",
    marginBottom: "1rem",
  },
  bottomBlock: {
    height: "7rem",
  },
  sideBlock: {
    height: "100%",
    minHeight: "24rem",
    padding: "0.5rem",
  },
  TopBlock: {
    height: "5rem",
  },
  secondRightBlock: {
    height: "15rem",
    padding: "0.5rem",
  },
  GraphBlock: {
    height: "16.5rem",
  },
}));

const ApexBrushChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const classes = useStyles();

  const [userId, setUserId] = useState();
  const [vehicleNo, setvehicleNo] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclesData, setVehiclesData] = useState([]);
  const currentDate = new Date();
  const [value, setValue] = useState(dayjs(currentDate));
  const downloaddate = dayjs(value).format("YYYY-MM-DD");
  const [data, setData] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [sohData, setSohData] = useState(null);
  const [loadingSoh, setLoadingSoh] = useState(false);

  const styles = {
    border: isDark
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)",
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)",
    boxShadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)",
    borderRadius: "0.9rem",
    backdropFilter: "blur(8px)",
  };

  const stylesBar = {
    border: isDark
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)",
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)",
    boxShadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)",
    borderRadius: "0.9rem",
    backdropFilter: "blur(8px)",
    padding: "0.5rem 1rem",
  };

  const valueMappings = {
    1: "PARK",
    2: "ECO",
    3: "POWER",
    4: "REVERSE",
  };

  const gearMappings = {
    1: "1st Gear",
    2: "2nd Gear",
  };

  const colorMappings = {
    1: "#ff4560",
    2: "#09b482",
    3: "#feb019",
    4: "#0d6efd",
  };

  const style = {
    color: colors.palette[110],
    m: "0.2rem",
    fontSize: "2.2rem",
    p: "0.1rem",
  };

  const [selectedSessionIndex, setSelectedSessionIndex] = useState(-1);
  const activeMetrics = data
    ? selectedSessionIndex === -1
      ? data.wholeDay
      : data.sessions[selectedSessionIndex]
    : null;

  const isChargeSession =
    selectedSessionIndex !== -1 &&
    activeMetrics?.sessionType === "Charge Session";

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

    setFetchTrigger((prev) => prev + 1);

    setLoadingSoh(true);
    fetch(
      `${colors.palette[50]}/soh/${userId}?startDate=${downloaddate}&endDate=${downloaddate}`,
    )
      .then((res) => res.json())
      .then((json) => setSohData(json || null))
      .catch(() => setSohData({ error: "Fetch failed" }))
      .finally(() => setLoadingSoh(false));

    try {
      const response = await fetch(
        `${colors.palette[50]}/analytics/${userId}?startDate=${downloaddate}`,
      );
      const jsonData = await response.json();
      if (jsonData && jsonData.length > 0) {
        setData(jsonData[0]);
        const sessions = jsonData[0]?.sessions || [];
        const firstDriveIdx = sessions.findIndex(
          (s) => s.sessionType === "Drive Session",
        );

        if (firstDriveIdx !== -1) {
          setSelectedSessionIndex(firstDriveIdx);
        } else {
          // If no Drive Sessions exist, gracefully default to the first Charge Session
          const firstChargeIdx = sessions.findIndex(
            (s) => s.sessionType === "Charge Session",
          );
          setSelectedSessionIndex(firstChargeIdx !== -1 ? firstChargeIdx : -1);
        }
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        "& .analytics-anim": {
          opacity: 0,
          transform: "translateY(16px)",
          animation:
            "analyticsFadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        },
        "& .analytics-card": {
          transition: "transform 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: colors.palette[210],
          },
        },
        "& .analytics-delay-1": { animationDelay: "80ms" },
        "& .analytics-delay-2": { animationDelay: "150ms" },
        "& .analytics-delay-3": { animationDelay: "220ms" },
        "& .analytics-delay-4": { animationDelay: "290ms" },
        "& .analytics-delay-5": { animationDelay: "360ms" },
        "& .analytics-delay-6": { animationDelay: "430ms" },
        "@keyframes analyticsFadeUp": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
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
          className="analytics-anim analytics-delay-1"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          gap={1}
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={
            isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"
          }
          sx={{
            backdropFilter: "blur(8px)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.3)"
              : "1px solid rgba(0, 0, 0, 0.25)",
          }}
          boxShadow={
            isDark
              ? "0 10px 22px rgba(0,0,0,0.28)"
              : "0 2px 12px rgba(14, 21, 29, 0.1)"
          }
          justifyContent={{ xs: "flex-start", md: "space-between" }}
        >
          <Box sx={{ width: { xs: "100%", md: "auto" } }}>
            <Box
              sx={{
                fontWeight: 800,
                margin: 0,
                fontSize: { xs: "1.35rem", md: "1.75rem" },
                color: colors.palette[100],
                letterSpacing: "0.02em",
              }}
            >
              Day Analytics
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
              Daily performance insights and charging session breakdowns
            </Box>
          </Box>
          <Box
            className="analytics-anim analytics-delay-2"
            display="flex"
            flexWrap="wrap"
            gap={1}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            alignItems="center"
            sx={{ width: { xs: "100%", md: "auto" } }}
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
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    setUserId(selectedId);

                    const selectedVehicle = vehiclesData.find(
                      (vehicle) => vehicle.vehicleId === selectedId,
                    );
                    if (selectedVehicle) {
                      setvehicleNo(selectedVehicle.vehicleNo);
                      setVehicleModel(selectedVehicle.name);
                    }
                  }}
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
                    slotProps={{ textField: { size: "small" } }}
                    sx={{ width: "100%" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            {data && data.sessions && data.sessions.length > 0 && (
              <Box sx={{ width: { xs: "100%", sm: 200, md: 230 } }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="session-label">Select Session</InputLabel>
                  <Select
                    labelId="session-label"
                    value={selectedSessionIndex}
                    onChange={(e) => setSelectedSessionIndex(e.target.value)}
                    label="Select Session"
                  >
                    {data.sessions?.some(
                      (s) => s.sessionType === "Drive Session",
                    ) && <MenuItem value={-1}>Whole Day</MenuItem>}
                    {data.sessions.map((sesh, idx) => (
                      <MenuItem key={idx} value={idx}>
                        {sesh.sessionType === "Charge Session"
                          ? "🔋 Charge"
                          : "🚗 Drive"}{" "}
                        ({sesh.startTime} - {sesh.endTime})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={fetchData}
              startIcon={<AddIcon style={{ fontSize: "1.5rem" }} />}
              sx={{
                borderRadius: "0.3rem",
                fontSize: "0.9rem",
                textTransform: "none",
                fontWeight: 700,
                width: { xs: "100%", sm: "auto", md: "auto" },
                minWidth: { xs: "unset", sm: 120, md: 120 },
                height: "2.3rem",
                boxShadow: isDark
                  ? "0 1px 10px rgba(0, 227, 150, 0.25)"
                  : "0 1px 10px rgba(2, 179, 132, 0.22)",
                background: `linear-gradient(90deg, ${colors.palette[500]} 0%, ${colors.palette[550]} 100%)`,
                "&:hover": {
                  background: `linear-gradient(90deg, ${colors.palette[550]} 0%, ${colors.palette[500]} 100%)`,
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Box ml={0} mt={1}>
          <Grid container spacing={2} marginTop={1}>
            {!isChargeSession && (
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                className="analytics-anim analytics-delay-3"
              >
                <Box
                  className={`${classes.secondRightBlock} analytics-card`}
                  style={styles}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                >
                  <RepoVehicleDetails
                    vehicleName={data ? vehicleModel : "Vehicle Name"}
                    vehicleNo={data ? vehicleNo : "Vehicle Number"}
                    driveSessionMinutes={
                      activeMetrics?.driveSession?.maxMinDiffMinutes || 0
                    }
                    driveSessionRanges={
                      activeMetrics?.driveSession?.sessionRanges || []
                    }
                    driveSessionRangeDetails={
                      activeMetrics?.driveSession?.sessionRangeDetails || []
                    }
                    gearPercentages={
                      activeMetrics?.driveSession?.gearPercentages || {}
                    }
                    modePercentages={
                      activeMetrics?.driveSession?.modePercentages || {}
                    }
                    gearMappings={gearMappings}
                    modeMappings={valueMappings}
                    modeColors={colorMappings}
                  />
                </Box>
              </Grid>
            )}

            {!isChargeSession && (
              <Grid
                item
                xs={6}
                sm={6}
                md={2}
                className="analytics-anim analytics-delay-3"
              >
                <Box
                  className={`${classes.topBlock} analytics-card`}
                  style={styles}
                >
                  <RepoData
                    title={"Watt-Hour/km"}
                    secondary={` ${activeMetrics ? activeMetrics.summaryBlocks.wattHourPerKm.max : "---"} Wh/km`}
                    primary={`${activeMetrics ? activeMetrics.summaryBlocks.wattHourPerKm.avg : "---"}`}
                    background={"#fbc968"}
                    iconColor={colors.palette[500]}
                    icon={<ElectricRickshawIcon sx={style} />}
                  />
                </Box>
                <Box
                  className={`${classes.bottomBlock} analytics-card`}
                  style={styles}
                >
                  <RepoData
                    title={"Vehicle Weight"}
                    primary={`${activeMetrics ? activeMetrics.summaryBlocks.vehicleWeight.max : "---"} kg`}
                    iconColor={colors.palette[500]}
                    icon={<ScaleIcon sx={style} />}
                  />
                </Box>
              </Grid>
            )}

            {!isChargeSession && (
              <Grid
                item
                xs={6}
                sm={6}
                md={2}
                className="analytics-anim analytics-delay-4"
              >
                <Box
                  className={`${classes.topBlock} analytics-card`}
                  style={styles}
                >
                  <RepoData
                    title={" Speedometer"}
                    secondary={`${activeMetrics ? activeMetrics.summaryBlocks.speedometer.max : "---"} km/h`}
                    primary={`${activeMetrics ? activeMetrics.summaryBlocks.speedometer.avg : "---"} km/h`}
                    iconColor={colors.palette[500]}
                    icon={<SpeedIcon sx={style} />}
                  />
                </Box>
                <Box
                  className={`${classes.bottomBlock} analytics-card`}
                  style={styles}
                >
                  <RepoData
                    title={" Distance Travelled"}
                    secondary={`${activeMetrics ? activeMetrics.summaryBlocks.distanceTravelled.max : "---"} km`}
                    primary={`${activeMetrics ? activeMetrics.summaryBlocks.distanceTravelled.trip : "---"} km`}
                    iconColor={colors.palette[500]}
                    icon={<LocalShippingIcon sx={style} />}
                  />
                </Box>
              </Grid>
            )}

            {!isChargeSession && (
              <>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={2}
                  className="analytics-anim analytics-delay-4"
                >
                  <Box
                    className={`${classes.topBlock} analytics-card`}
                    style={styles}
                  >
                    <RepoData
                      title={"Battery SOC"}
                      secondary={`${activeMetrics ? activeMetrics.summaryBlocks.batterySoc.min : "---"} %`}
                      primary={`${activeMetrics ? activeMetrics.summaryBlocks.batterySoc.trip : "---"} %`}
                      iconColor={colors.palette[500]}
                      icon={<DataUsageIcon sx={style} />}
                    />
                  </Box>
                  {props.role !== "customer" ? (
                    <Box
                      className={`${classes.bottomBlock} analytics-card`}
                      style={styles}
                    >
                      <RepoData
                        title={"Current"}
                        secondary={`${activeMetrics ? activeMetrics.summaryBlocks.current.max : "---"} A`}
                        primary={`${activeMetrics ? activeMetrics.summaryBlocks.current.avg : "---"} A`}
                        iconColor={colors.palette[500]}
                        icon={<BrightnessAutoIcon sx={style} />}
                      />
                    </Box>
                  ) : (
                    <Box
                      className={`${classes.bottomBlock} analytics-card`}
                      style={styles}
                    >
                      <RepoData
                        title={"AH consumed"}
                        secondary={`${activeMetrics ? activeMetrics.summaryBlocks.ahConsumed.max : "---"} Ah`}
                        primary={`${activeMetrics ? activeMetrics.summaryBlocks.ahConsumed.trip : "---"} Ah`}
                        iconColor={colors.palette[500]}
                        icon={<BrightnessAutoIcon sx={style} />}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={2}
                  className="analytics-anim analytics-delay-5"
                >
                  <Box
                    className={`${classes.topBlock} analytics-card`}
                    style={styles}
                  >
                    <RepoData
                      title={" controller temperature"}
                      secondary={`${activeMetrics ? activeMetrics.summaryBlocks.controllerTemp.max : "---"} °C`}
                      primary={`${activeMetrics ? activeMetrics.summaryBlocks.controllerTemp.avg : "---"} °C`}
                      iconColor={colors.palette[500]}
                      icon={<MemoryIcon sx={style} />}
                    />
                  </Box>
                  <Box
                    className={`${classes.bottomBlock} analytics-card`}
                    style={styles}
                  >
                    <RepoData
                      title={" motor temperature"}
                      secondary={`${activeMetrics ? activeMetrics.summaryBlocks.motorTemp.max : "---"} °C`}
                      primary={`${activeMetrics ? activeMetrics.summaryBlocks.motorTemp.avg : "---"}  °C`}
                      iconColor={colors.palette[500]}
                      icon={<ThermostatIcon sx={style} />}
                    />
                  </Box>
                </Grid>
              </>
            )}
            {isChargeSession && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  className="analytics-anim analytics-delay-5"
                >
                  <Box>
                    <CellPack
                      vehicleId={userId}
                      date={downloaddate}
                      sohData={sohData}
                      loadingSoh={loadingSoh}
                      initSoc={activeMetrics?.chargingSession?.initSoc ?? 10}
                      finalSoc={activeMetrics?.chargingSession?.finalSoc ?? 10}
                      avgCurrent={
                        activeMetrics?.chargingSession?.avgCurrent ?? 0
                      }
                      mosTemp={activeMetrics?.chargingSession?.mosTemp ?? 0}
                      temp1={activeMetrics?.chargingSession?.temp1 ?? 0}
                      temp2={activeMetrics?.chargingSession?.temp2 ?? 0}
                      temp3={activeMetrics?.chargingSession?.temp3 ?? 0}
                      temp4={activeMetrics?.chargingSession?.temp4 ?? 0}
                      timeMax={
                        activeMetrics?.chargingSession?.timeMax ?? "00:00:00"
                      }
                      timeMin={
                        activeMetrics?.chargingSession?.timeMin ?? "00:00:00"
                      }
                      timeMinutes={
                        activeMetrics?.chargingSession?.timeMinutes ?? 0
                      }
                      ahConsumed={
                        activeMetrics?.chargingSession?.ahConsumed ?? 0
                      }
                      role={props.role}
                      fault={
                        activeMetrics?.chargingSession?.faults?.length
                          ? activeMetrics.chargingSession.faults.map(
                              (value, index) => (
                                <React.Fragment key={index}>
                                  {index > 0 && ", "}
                                  {value}
                                </React.Fragment>
                              ),
                            )
                          : [0]
                      }
                    />
                  </Box>
                </Grid>
              </>
            )}
            {!isChargeSession && props.role !== "customer" ? (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                className="analytics-anim analytics-delay-6"
              >
                <Box
                  className={`${classes.sideBlock} analytics-card`}
                  style={styles}
                >
                  <ReportTable
                    data={{
                      avgGradient: activeMetrics?.reportTable?.avgGradient ?? 0,
                      ambTemperature:
                        activeMetrics?.reportTable?.ambTemperature ?? 0,
                      initVoltage: activeMetrics?.reportTable?.initVoltage ?? 0,
                      finalVoltage:
                        activeMetrics?.reportTable?.finalVoltage ?? 0,
                      cycles: activeMetrics?.reportTable?.cycles ?? 0,
                      contCurrentMax:
                        activeMetrics?.reportTable?.contCurrentMax ?? 0,
                      contCurrentAvg:
                        activeMetrics?.reportTable?.contCurrentAvg ?? 0,
                      batteryFault: activeMetrics?.reportTable?.batteryFault
                        ?.length
                        ? activeMetrics.reportTable.batteryFault
                        : [0],
                      controllerFault: activeMetrics?.reportTable
                        ?.controllerFault?.length
                        ? activeMetrics.reportTable.controllerFault
                        : [0],
                      AHConsumed: activeMetrics?.reportTable?.AHConsumed ?? 0,
                      maxMosTemperature:
                        activeMetrics?.reportTable?.maxMosTemperature ?? 0,
                      highCellVoltage:
                        activeMetrics?.reportTable?.highCellVoltage ?? 0,
                      lowCellVoltage:
                        activeMetrics?.reportTable?.lowCellVoltage ?? 0,
                    }}
                    role={props.role}
                  />
                </Box>
              </Grid>
            ) : (
              <></>
            )}

            {!isChargeSession && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className="analytics-anim analytics-delay-6"
                >
                  <Box
                    className={`${classes.sideBlock} analytics-card`}
                    style={styles}
                  >
                    <Polarchart d={activeMetrics?.polarChart || {}} />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={5}
                  className="analytics-anim analytics-delay-6"
                >
                  <Box
                    className={`${classes.sideBlock} analytics-card`}
                    style={styles}
                  >
                    <Box
                      p={"0.25rem 0.5rem"}
                      fontSize={"1.3rem"}
                      fontWeight={"500"}
                    >
                      Map Routes
                    </Box>
                    <MapleMaps
                      key={fetchTrigger}
                      fetchTrigger={fetchTrigger}
                      token={props.mapKey}
                      user={userId}
                      fetch={false}
                      date={downloaddate}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  className="analytics-anim analytics-delay-6"
                >
                  <Box
                    className={`${classes.sideBlock} analytics-card`}
                    style={stylesBar}
                  >
                    <Box p={"0rem 0rem"} fontSize={"1.3rem"} fontWeight={"500"}>
                      Summary Bar Chart
                    </Box>
                    <BarChart
                      role={props.role}
                      d={{
                        avgCurrentat10SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[0] || 0,
                        avgCurrentat20SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[1] || 0,
                        avgCurrentat30SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[2] || 0,
                        avgCurrentat40SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[3] || 0,
                        avgCurrentat50SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[4] || 0,
                        avgCurrentat60SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[5] || 0,
                        avgCurrentat70SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[6] || 0,
                        avgCurrentat80SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[7] || 0,
                        avgCurrentat90SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[8] || 0,
                        avgCurrentat100SOC:
                          activeMetrics?.barChart?.avgCurrentAtSoc?.[9] || 0,

                        avgSpeedat10SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[0] || 0,
                        avgSpeedat20SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[1] || 0,
                        avgSpeedat30SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[2] || 0,
                        avgSpeedat40SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[3] || 0,
                        avgSpeedat50SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[4] || 0,
                        avgSpeedat60SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[5] || 0,
                        avgSpeedat70SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[6] || 0,
                        avgSpeedat80SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[7] || 0,
                        avgSpeedat90SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[8] || 0,
                        avgSpeedat100SOC:
                          activeMetrics?.barChart?.avgSpeedAtSoc?.[9] || 0,

                        tripAt10Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[0] || 0,
                        tripAt20Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[1] || 0,
                        tripAt30Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[2] || 0,
                        tripAt40Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[3] || 0,
                        tripAt50Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[4] || 0,
                        tripAt60Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[5] || 0,
                        tripAt70Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[6] || 0,
                        tripAt80Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[7] || 0,
                        tripAt90Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[8] || 0,
                        tripAt100Soc:
                          activeMetrics?.barChart?.tripAtSoc?.[9] || 0,

                        avgControllerTemperatureat100SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[9] || 0,
                        avgControllerTemperatureat90SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[8] || 0,
                        avgControllerTemperatureat80SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[7] || 0,
                        avgControllerTemperatureat70SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[6] || 0,
                        avgControllerTemperatureat60SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[5] || 0,
                        avgControllerTemperatureat50SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[4] || 0,
                        avgControllerTemperatureat40SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[3] || 0,
                        avgControllerTemperatureat30SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[2] || 0,
                        avgControllerTemperatureat20SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[1] || 0,
                        avgControllerTemperatureat10SOC:
                          activeMetrics?.barChart
                            ?.avgControllerTempAtSoc?.[0] || 0,

                        avgMotorTemperatureat100SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[9] || 0,
                        avgMotorTemperatureat90SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[8] || 0,
                        avgMotorTemperatureat80SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[7] || 0,
                        avgMotorTemperatureat70SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[6] || 0,
                        avgMotorTemperatureat60SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[5] || 0,
                        avgMotorTemperatureat50SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[4] || 0,
                        avgMotorTemperatureat40SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[3] || 0,
                        avgMotorTemperatureat30SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[2] || 0,
                        avgMotorTemperatureat20SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[1] || 0,
                        avgMotorTemperatureat10SOC:
                          activeMetrics?.barChart?.avgMotorTempAtSoc?.[0] || 0,
                      }}
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ApexBrushChart;
