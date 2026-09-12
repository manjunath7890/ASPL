import { useTheme, Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tokens } from "../../theme";
import VehicleStatusCard from "../../components/VehicleStatusCard";
import PerformanceCard from "../../components/PerformanceCard";
import BatterySummaryCard from "../../components/BatterySummaryCard";
import EfficiencyDriveCard from "../../components/EfficiencyDriveCard";
import TempsCard from "../../components/TempsCard";
import CellVoltagesCard from "../../components/CellVoltagesCard";
import RealTimeGraph from "../../components/RealTimeGraph";
import MapleMaps from "../../components/MappleMaps";

const D1 = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const customFontFamily = "'Kanit', sans-serif";
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [preValue, setPreValue] = useState(0);
  const [status, setStatus] = useState(0);

  // Common styles for card containers
  const cardStyles = {
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.9)",
    boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
    borderRadius: "0.9rem",
    fontFamily: customFontFamily,
    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(8px)",
    padding: 2,
  };

  const buildCardStyle = (accentFrom, accentTo) => ({
    ...cardStyles,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: "\"\"",
      position: "absolute",
      inset: "0 0 auto 0",
      height: "3px",
      // background: `linear-gradient(90deg, #333 0%, #333 100%)`,
      opacity: 0.95,
    },
    "&::after": {
      content: "\"\"",
      position: "absolute",
      right: "-50px",
      top: "-50px",
      width: "135px",
      height: "135px",
      pointerEvents: "none",
      // background: `radial-gradient(circle, ${accentFrom}30 0%, transparent 70%)`,
    },
  });

  const cardTitle = {
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: colors.palette[150],
    mb: 1.1,
    display: "inline-flex",
    px: 1.5,
    py: 0.32,
    borderRadius: "999px",
    background: isDark ? "rgba(255,255,255,0.07)" : "rgba(219, 219, 219, 0.49)",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${colors.palette[50]}/getdata?user=${props.vehicleData}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
          if (preValue !== result.v6) {
            setPreValue(result.v6);
            setStatus(1);
          } else {
            setStatus(0);
          }
        } else {
          console.log("Failed to fetch data for status.");
        }
      } catch (error) {
        console.error("Error fetching data for status:", error);
      }
    };
    const intervalId = setInterval(fetchData, 2200);
    return () => clearInterval(intervalId);
  }, [props.vehicleData, preValue]);

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
        "& .d1-anim": {
          opacity: 0,
          transform: "translateY(16px)",
          animation: "d1FadeUp 560ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        },
        "& .d1-card": {
          transition: "transform 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: colors.palette[200] || colors.palette[210],
          },
        },
        "& .d1-delay-1": { animationDelay: "80ms" },
        "& .d1-delay-2": { animationDelay: "140ms" },
        "& .d1-delay-3": { animationDelay: "200ms" },
        "& .d1-delay-4": { animationDelay: "260ms" },
        "& .d1-delay-5": { animationDelay: "320ms" },
        "& .d1-delay-6": { animationDelay: "380ms" },
        "& .d1-delay-7": { animationDelay: "440ms" },
        "& .d1-delay-8": { animationDelay: "500ms" },
        "@keyframes d1FadeUp": {
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
          className="d1-anim d1-delay-1"
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
          gap={1.2}
          mb={1.2}
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
              Vehicle Deep Dashboard
            </Typography>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Real-time performance, battery and route insights
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: "none", borderRadius: "0.75rem" }}
            >
              Back
            </Button>
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          }}
          gap={2}
          marginTop={"0.5rem"}
        >
        <Box
          className="d1-anim d1-card d1-delay-2"
          sx={{ ...buildCardStyle("#00d38b", "#0d6efd"), minHeight: { xs: 180, md: 220 } }}
        >
          <Box sx={cardTitle}>Vehicle Info</Box>
          <VehicleStatusCard
            model={props.vehicleModel || "-------"}
            number={props.vehicleNo || "-------"}
            controllerHealth={data.v7 === 0 ? "Good" : data.v7 || "—"}
            batteryCondition={data.v8 === 0 ? "Good" : data.v8 || "—"}
            vehicleStatus={
              status
                ? (data.v42 === 3 && data.v44 === 1)
                  ? "Vehicle is parked"
                  : data.v42 === 1
                    ? "Charger Connected"
                    : data.v42 === 2
                      ? "Vehicle is Charging"
                      : "Vehicle in Motion"
                : " Vehicle Offline"
            }
            gps={data.v10 || 0}
            online={status}
            role={props.role}
            user={data.user}
            gradient={data.v47 || 0}
            auto={data.v25 || 0}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-3"
          sx={{ ...buildCardStyle("#0d6efd", "#0dcaf0"), minHeight: { xs: 280, md: 320 } }}
        >
          <Box sx={cardTitle}>Performance</Box>
          <PerformanceCard
            speed={data.v39 || 0}
            rpm={data.v40 || 0}
            range={parseInt(data.v5) || 0}
            odo={data.v41 || 0}
            trip={data.v19 || 0}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-4"
          sx={{ ...buildCardStyle("#775dd0", "#0d6efd"), minHeight: { xs: 200, md: 320 } }}
        >
          <Box sx={cardTitle}>Efficiency & Drive</Box>
          <EfficiencyDriveCard
            whpkm={data.v38 || 0}
            whr={data.v37 ? (data.v37 * 1).toFixed(2) : 0}
            range={parseInt(data.v5) || 0}
            gradient={data.v47 || 0}
            driveMode={data.v44 || 0}
            gear={data.v23 || 0}
            controllerCurrent={data.v24 || 0}
            AH={data.v9 || 0}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-5"
          sx={{ ...buildCardStyle("#feb019", "#ff7b00"), minHeight: { xs: 200, md: 320 } }}
        >
          <Box sx={cardTitle}>Battery</Box>
          <BatterySummaryCard
            soc={data.v32 || 0}
            current={data.v33 || 0}
            voltage={data.v34 || 0}
            power={data.v36 ? (data.v36 * 1).toFixed(0) : 0}
            low={data.v17 || 0}
            high={data.v18 || 0}
            cycles={data.v22 || 0}
            totalCapacity={data.v9 || 0}
            capacity={data.v35 || 0}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-6"
          sx={{ ...buildCardStyle("#ff4560", "#feb019"), minHeight: { xs: 200, md: 320 } }}
        >
          <Box sx={[cardTitle, { mb: "1rem" }]}>Temperatures</Box>
          <TempsCard
            motor={data.v46 || 0}
            controller={data.v45 || 0}
            mos={data.v11 || 0}
            t1={data.v13 || 0}
            t2={data.v14 || 0}
            t3={data.v15 || 0}
            t4={data.v16 || 0}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-7"
          sx={{ ...buildCardStyle("#0dcaf0", "#775dd0"), minHeight: { xs: 220, md: 300 } }}
        >
          <Box sx={cardTitle}>Cell Voltages</Box>
          <CellVoltagesCard
            cells={[
              data.v51,
              data.v52,
              data.v53,
              data.v54,
              data.v55,
              data.v56,
              data.v57,
              data.v58,
              data.v59,
              data.v60,
              data.v61,
              data.v62,
              data.v63,
              data.v64,
              data.v65,
              data.v66,
              data.v67,
              data.v68,
              data.v69,
              data.v70,
              data.v71,
              data.v72,
              data.v73,
              data.v74,
            ]}
          />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-8"
          sx={{
            ...buildCardStyle("#0d6efd", "#00d38b"),
            minHeight: { xs: 220, md: 320 },
            gridColumn: { xs: "1 / -1", md: "span 2" },
          }}
        >
          <Box sx={cardTitle}>Map</Box>
          <MapleMaps token={props.mapKey} user={props.vehicleData} fetch={true} />
        </Box>

        <Box
          className="d1-anim d1-card d1-delay-8"
          sx={{
            ...buildCardStyle("#00d38b", "#0dcaf0"),
            minHeight: { xs: 200, md: 320 },
            gridColumn: { xs: "1 / -1", md: "span 4" },
          }}
        >
          <Box sx={cardTitle}>Real-Time Graph</Box>
          <RealTimeGraph d1={data.v33 || 0} d2={data.v39 || 0} />
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default D1;
