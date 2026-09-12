import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Temp from "./Temperature";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const SpeedTemp = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styleTemperature = {
    p: "0.25rem",
    fontSize: "2rem",
  };

  return (
    <Box display={"flex"} justifyContent={"space-evenly"}>
      <Box width={"100%"} m={"1rem"}>
        <Box
          fontSize={"2rem"}
          fontWeight={"500"}
          mt={"5rem"}
          display={"flex"}
          justifyContent={"center"}
        >
          {props.vMode === 0
            ? "Vehicle Parked"
            : props.vMode === 1
            ? "Not Charging"
            : props.vMode === 2
            ? "Vehicle Charging"
            : "Vehicle is Moving"}
        </Box>

        <Box display={"flex"} mt={"1rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Driving MODE"}
            fontWeight={500}
            fontSize={"2rem"}
            hFont="0.7rem"
            value={
              props.fner === 0
                ? "-----"
                : props.fner === 1
                ? "parked"
                : props.fner === 2
                ? "ECO"
                : props.fner === 3
                ? "Drive"
                : props.fner === 4
                ? "Reverse"
                : "----"
            }
            height="5rem"
          />

          <Temp
            temp={"Driven Gear"}
            hFont="0.7rem"
            bg={500}
            bbg={300}
            fontSize={"2rem"}
            fontWeight={500}
            value={props.dGear}
            height="5rem"
          />
        </Box>

        <Box display={"flex"} mt={"0.5rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Battery Fault code"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={`0x${props.bHealth}`}
            bg={1400}
            bbg={300}
            icon={<HealthAndSafetyIcon sx={styleTemperature} />}
            height="4rem"
          />
          <Temp
            temp={"Controller Fault code"}
            fontSize={"1.5rem"}
            hFont="0.6rem"
            value={`0x${props.cHealth}`}
            bg={1300}
            bbg={300}
            icon={<HealthAndSafetyIcon sx={styleTemperature} />}
            height="4rem"
          />
        </Box>

        <Box display={"flex"} mt={"0.5rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Controller temperature"}
            unit={"°C"}
            hFont="0.6rem"
            value={props.cTemp}
            fontSize={"1.5rem"}
            bg={500}
            bbg={300}
            icon={<ThermostatIcon sx={styleTemperature} />}
            height="4rem"
          />
          <Temp
            temp={"Motor temperature"}
            unit={"°C"}
            hFont="0.6rem"
            value={props.mTemp}
            fontSize={"1.5rem"}
            color={colors.palette[100]}
            bg={500}
            bbg={300}
            icon={<ThermostatIcon sx={styleTemperature} />}
            height="4rem"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SpeedTemp;
