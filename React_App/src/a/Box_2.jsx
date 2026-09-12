import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
// import SemiCircleRadialGauge from "./SemiCircle";
import Temp from "./Temperature";
import MovingIcon from "@mui/icons-material/Moving";
import TitleIcon from "@mui/icons-material/Title";

const Box_2 = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styleTemperature = {
    p: "0.2rem",
    fontSize: "1.5rem",
    color: colors.palette[110],

  };

  return (
    <Box>
      <h4 style={{ marginTop: "1rem", marginLeft: "1rem" }}>Speedometer</h4>
      <Box

        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop="1rem"
      >
        <Box
          padding="1rem"
          width="60%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          Speed
          <Box fontSize="6rem" fontWeight="500" mb="-0.9rem" display={"flex"} alignItems="center" flexDirection="column">
            {props.speed}
            <Box fontSize="0.9rem" mt={"-0.5rem"}>kmph</Box>
          </Box>
        </Box>
      </Box>

      <Box m={"1rem"}>
        <Box display={"flex"} mt={"1rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Trip"}
            unit={"km"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={props.trip}
            bg={500}
            bbg={300}
            height="3.5rem"
            icon={<TitleIcon sx={styleTemperature} />}
          />
          <Temp
            temp={"Range"}
            unit={"km"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={(props.range * 1).toFixed(1)}
            bg={500}
            bbg={300}
            height="3.5rem"
            icon={<MovingIcon sx={styleTemperature} />}
          />
        </Box>
        <Box display={"flex"} mt={"0.3rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Motor RPM"}
            unit={"RPM"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={props.rpm}
            bg={500}
            bbg={300}
            height="3.5rem"
            icon={<TitleIcon sx={styleTemperature} />}
          />
          <Temp
            temp={"Total distance"}
            unit={"km"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={props.odo}
            bg={500}
            bbg={300}
            height="3.5rem"
            icon={<MovingIcon sx={styleTemperature} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Box_2;
