
import { useTheme, Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { makeStyles } from "@mui/styles";
import Box6 from "../../components/Box_6";
import Box5 from "../../components/Box_5";
import MapleMaps from "../../components/MappleMaps";

const useStyles = makeStyles(() => ({
  topBlock: {
    height: "11rem",
    marginBottom: "1rem",
    padding: "0.5rem",
  },
  bottomBlock: {
    height: "27rem",
    padding: "0.5rem",
  },
  secondRightBlock: {
    height: "39rem",
  },
}));

const D4 = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const customFontFamily = "'Kanit', sans-serif";

  const [data, setData] = useState([]);
  const [preValue, setPreValue] = useState(0);
  const [status, setStatus] = useState(0);

  const styles = {
    background: colors.palette[300],
    boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
    borderRadius: "0.5rem",
    fontFamily: customFontFamily,
    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${colors.palette[50]}/getdata?user=${props.vehicleData}`
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.log("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [colors.palette, props.vehicleData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${colors.palette[50]}/getdata?user=${props.vehicleData}`
        );
        if (response.ok) {
          const result = await response.json();

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

    const intervalId = setInterval(fetchData, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [preValue, colors.palette]);

  return (
    <Box
     p={'0.2rem'}
     >
    <Grid
      container
      spacing={2}
      style={{
        width: "auto",
        margin: "0.5rem",
        border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
        borderRadius: '1rem',
        background: colors.palette[300]
      }}
    >
      <Grid item xs={12} sm={6} md={3}>
        <Box className={classes.topBlock} style={styles}>
          <Box5
            vehicleNumber={data.v3}
            vehicleName={data.v2}
            signal={status}
            user={data.user}
            dCycle={data.v21}
            cCycle={data.v22}
            role={props.role}
          />
        </Box>
        <Box className={classes.bottomBlock} style={styles}>
          <Box6 soc={data.v32} vMode={data.v42} odo={data.v41} />
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={9}>
        <Box className={classes.secondRightBlock} style={styles}>
          <MapleMaps
            token={props.mapKey}
            user={props.vehicleData}
            height={"85vh"}
            width={"100%"}
          />
        </Box>
      </Grid>
    </Grid></Box>
  );
};

export default D4;
