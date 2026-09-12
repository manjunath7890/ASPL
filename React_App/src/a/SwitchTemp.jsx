import { Box,useTheme } from "@mui/material";
import { tokens } from "../theme";
import SwitchExample from "./Switch";
import Temp from "./Temperature";

const SwitchTemp = (props) => {
  const theme = useTheme(); 
  const colors = tokens(theme.palette.mode); 

  console.log(props.gps)

  return (
    <Box
      display="flex"
      alignItems="baseline"
      justifyContent={"space-between"}
      width="100%"
      p={"0 0.5rem"}
    >
      <Box mt={"0.5rem"} width={"70%"}>
        <Box display={"flex"} alignItems={"baseline"}>
          <h2
            style={{
              color: colors.palette[100],
              marginBottom: "0rem",
              fontWeight: "600",
              margin: "0 1rem 0 0",
            }}
          >
            {props.model}
          </h2>
          <h4
            style={{
              color: colors.palette[510],
              marginBottom: "0rem",
              fontWeight: "500",
              fontSize: "0.9rem",
            }}
          >
            {props.number}
          </h4>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1rem",
              padding: "0.2rem",
              paddingRight: "0.4rem",
              background:
                (props.gps === 1 && props.signal === 1) ? colors.palette[1150] : colors.palette[400],
              color:
                (props.gps === 1 && props.signal === 1) ? colors.palette[510] : colors.palette[1400],
              fontSize: "0.6rem",
              borderRadius: "0.3rem",
              fontWeight: 500,
            }}
          >
            GPS
          </Box>
        </Box>
        <Box display={"flex"} mt={"2rem"} justifyContent={"space-evenly"}>
          <Temp
            temp={"Watt-hr/km"}
            value={props.whpkm}
            fontSize={"1.3rem"}
            bg={300}
            color={100}
          />
          {/* <Temp
            temp={"Temperature"}
            unit={"°C"}
            value={props.ambient}
            fontSize={"1.3rem"}
            bg={300}
            color={100}
          /> */}
          <Temp
            temp={"Gradient"}
            fontSize={"1.3rem"}
            value={`${props.gradient} °`}
            bg={300}
          />

          <Temp
            temp={"Driven Gear"}
            fontSize={"1.3rem"}
            value={`${props.drivenGear}`}
            bg={300}
          />
        </Box>
      </Box>
      <SwitchExample
        role={props.role}
        user={props.user}
        switchValue={props.switchValue}
        slope={props.gradient}
        signal={props.signal}
        gps={props.gps}
      />
    </Box>
  );
};

export default SwitchTemp;
