import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Temp from "./Temperature";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import MovingIcon from "@mui/icons-material/Moving";
import TitleIcon from "@mui/icons-material/Title";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const SpeedTemp = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    fontSize: "1.5rem",
  };

  const styleTemperature = {
    p: "0.2rem",
    fontSize: "1.3rem",
  };

  return (
    <Box display="flex" justifyContent="space-evenly" width="100%">
      {/* Speed and Status Section */}
      <Box
        width="40%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        // marginTop="0.5rem"
        mr="0.5rem"
      >
        <Box
          padding="1rem"
          width="60%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          Speed
          <Box fontSize="4rem" fontWeight="500" mb="-0.9rem" display={"flex"} alignItems="center" flexDirection="column">
            {props.speed}
            <Box fontSize="0.9rem" mt={"-0.5rem"}>kmph</Box>
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginTop="0.5rem"
          border={`1px solid ${colors.palette[900]}`}
          boxShadow={colors.palette[210]}
          borderRadius="0.5rem"
          width="100%"
          padding="0.5rem 1rem"
          m="0.4rem 0"
        >
          <Box
            color={colors.palette[100]}
            fontSize="1.2rem"
            display="flex"
            alignItems="center"
            mr="1.3rem"
          >
            <Box color={colors.palette[150]} fontSize="0.7rem">
              RPM:&nbsp;&nbsp;
            </Box>
            {props.rpm}
          </Box>

          <Box color={colors.palette[100]} fontSize="1.2rem" display="flex" alignItems="center">
            <Box color={colors.palette[150]} fontSize="0.7rem">
              ODO:&nbsp;&nbsp;
            </Box>
            {props.odo}
            <Box fontSize="0.8rem" color={colors.palette[100]}>
              &nbsp;&nbsp;&nbsp;km
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Status & Temperature Info */}
      <Box width="60%" pb="0.5rem">
        <Box display="flex">
          <Temp
            fontSize="1.5rem"
            value={
              props.cfan === 0
                ? "Parked and Safe"
                : props.cfan === 1
                ? "Charger connected to Charge"
                : props.cfan === 2
                ? "Vehicle Charging"
                : "On the Move"
            }
            justifyContent="center"
            bg={1100}
            bbg={300}
          />
        </Box>

        <Box display="flex" mt="0.3rem" justifyContent="space-evenly">
          <Temp
            temp="Driving MODE"
            value={
              props.fner === 0
                ? "-----"
                : props.fner === 1
                ? "Parked"
                : props.fner === 2
                ? "ECO"
                : props.fner === 3
                ? "Drive"
                : props.fner === 4
                ? "Reverse"
                : "----"
            }
            icon={<OpenWithIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bbg={300}
          />
          <Temp
            temp="Controller Health"
            value={props.cerror === 0 ? "Good" : props.cerror}
            icon={<HealthAndSafetyIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bg={1400}
            bbg={300}
          />
        </Box>

        <Box display="flex" mt="0.3rem" justifyContent="space-evenly">
          <Temp
            temp="Trip"
            value={props.trip}
            unit="km"
            icon={<TitleIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bg={500}
            bbg={300}
          />
          <Temp
            temp="Range"
            value={props.range}
            unit="km"
            icon={<MovingIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bg={500}
            bbg={300}
          />
        </Box>

        <Box display="flex" mt="0.3rem" justifyContent="space-evenly">
          <Temp
            temp="Controller"
            value={props.ctemp}
            unit="°C"
            icon={<ThermostatIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bg={1500}
            bbg={300}
          />
          <Temp
            temp="Motor"
            value={props.mtemp}
            unit="°C"
            icon={<ThermostatIcon sx={styleTemperature} />}
            fontSize="1.1rem"
            bg={1500}
            bbg={300}
            color={colors.palette[100]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SpeedTemp;
