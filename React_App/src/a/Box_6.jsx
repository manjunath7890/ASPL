import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import SemiCircleRadialGauge from "./SemiCircle";
import Temp from "./Temperature";
import MovingIcon from "@mui/icons-material/Moving";

const Box_2 = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const styleTemperature = {
    p: "0.5rem",
    fontSize: "2.5rem",
    color: colors.palette[110],

  };

  return (
    <Box>
      <h4 style={{ marginTop: "1rem", marginLeft: "1rem" }}>Vehicle Insights</h4>
      <Box

        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop="2rem"
      >
        <SemiCircleRadialGauge
          val={props.soc / 10}
          value={props.soc}
          label={`battery`}
          colorBlue={colors.palette[800]}
          colorGrey={colors.palette[100]}
          colorGreen={colors.palette[1700]}
          endAngle={110}
          height={260}
          heading={"SOC"}
        />
      </Box>

      <Box m={"2rem 0"}>
        <Box display={"flex"} mt={"0.3rem"} justifyContent={"space-evenly"}>
          <Temp
            unit={"km"}
            fontSize={"2.3rem"}
            hFont="0.6rem"
            value={props.odo}
            bg={500}
            height="6rem"
            icon={<MovingIcon sx={styleTemperature} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Box_2;
