import { Box, useTheme } from "@mui/material";
import Battery0BarOutlinedIcon from "@mui/icons-material/Battery5Bar";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import { tokens } from "../theme";
import GroupWorkRoundedIcon from "@mui/icons-material/GroupWorkRounded";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import Temp from "./Temperature";
import CellPack from "./CellPack";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Circle from "./CircularGauge";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";

const BatteryMain = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    p: "0.15rem",
    fontSize: "1.1rem",
    borderRadius: "0.5rem",
    color: colors.palette[500],
  };

  return (
    <Box>
      <Box
        mt={"0rem"}
        pt={"0rem"}
        display="flex"
        borderRadius={"1rem"}
        alignItems={"flex-end"}
      >
        <Box
          ml={"0.2rem"}
          mt={"1.3rem"}
          border={`1px solid ${colors.palette[900]}`}
          boxShadow={colors.palette[210]}
          padding={"0.8rem"}
          borderRadius={"0.5rem"}
          width={"10rem"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          fontSize={"0.7rem"}
        >
          Battery SOC
          <Box fontSize={"3rem"} fontWeight={"500"} m={"-0.5rem 0"}>
            {" "}
            {props.soc} <span style={{ fontSize: "1.5rem" }}> %</span>
          </Box>
        </Box>

        <Box
          sx={{
            // pr: "2rem",
            ml: "1.5rem",
            mt: "0.2rem",
          }}
        >
          <Box
            fontSize={"2rem"}
            display={"flex"}
            alignItems={"center"}
            fontWeight={"500"}
            sx={{
              color: colors.palette[100],
              marginBottom: "0rem",
              mt: "1rem",
            }}
          >
            <BrightnessAutoIcon
              style={{
                color: colors.palette[110],
                fontSize: "1.8rem",
                background: colors.palette[500],
                padding: "0.2rem",
                borderRadius: "0.5rem",
              }}
            />
            {"\u00A0"}{"\u00A0"}
            {Math.floor(props.current) < 0
              ? Math.ceil(props.current)
              : Math.floor(props.current)}
            .{(props.current % 1).toFixed(1).toString().split(".")[1]}
            <Box fontSize={"1.3rem"} pt={"0.3em"}>
              {" "}
              {"\u00A0"}A{" "}
              <span style={{ fontWeight: 300, fontSize: "1rem" }}>
                {"\u00A0"}
                {"\u00A0"}
                {"\u00A0"}
                {"\u00A0"}
                {props.acCurrent} A
              </span>
            </Box>
          </Box>

          <Box
            fontSize={"1.2rem"}
            display={"flex"}
            alignItems={"center"}
            sx={{
              color: colors.palette[100],
            }}
          >
            <CellPack cell={props.data} />
            {"\u00A0"}
            {"\u00A0"}
            {"\u00A0"}{"\u00A0"}
            {props.voltage} V
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        mt={"0.5rem"}
        justifyContent={"space-evenly"}
        minWidth={"16rem"}
      >
        <Temp
          temp={"Total Capacity"}
          unit={"AH"}
          value={props.totalCapacity}
          bbg={500}
          bg={300}
          fontWeight={400}
          fontSize="1rem"
          icon={<BatteryFullIcon sx={style} />}
        />
        <Temp
          temp={"Remaining Capacity"}
          unit={"AH"}
          bbg={500}
          fontWeight={400}
          fontSize="1rem"
          bg={300}
          value={props.capacity}
          icon={<Battery0BarOutlinedIcon sx={style} />}
        />
        <Temp
          temp={"Remaining Watt-Hour"}
          unit={"WHr"}
          value={props.whr}
          bbg={500}
          fontWeight={400}
          fontSize="1rem"
          bg={300}
          icon={<LeaderboardIcon sx={style} />}
        />
      </Box>
      <Box
        display={"flex"}
        mt={"0.3rem"}
        justifyContent={"space-evenly"}
        minWidth={"16rem"}
      >
        <Temp
          temp={"Power"}
          unit={"w"}
          bbg={500}
          fontWeight={300}
          bg={300}
          value={props.power}
          icon={<GroupWorkRoundedIcon sx={style} />}
        />
        <Temp
          temp={"Battery-condition"}
          unit={""}
          bbg={1400}
          bg={1400}
          fontWeight={300}
          value={props.berror === 0 ? "good" : `bx${props.berror}`}
          icon={
            <HealthAndSafetyIcon
              sx={{
                p: "0.15rem",
                fontSize: "1.1rem",
                borderRadius: "0.5rem",
                color: colors.palette[110],
              }}
            />
          }
        />
        <Temp
          temp={"Battery Cycles"}
          value={props.chargingCycle}
          bbg={1300}
          fontWeight={300}
          bg={1300}
          icon={
            <ElectricalServicesIcon
              sx={{
                p: "0.15rem",
                fontSize: "1.1rem",
                borderRadius: "0.5rem",
                color: colors.palette[110],
              }}
            />
          }
        />
      </Box>

      <Box
        display={"flex"}
        mt={"0.3rem"}
        justifyContent={"space-evenly"}
        minWidth={"16rem"}
      >
        <Temp
          temp={"Low-cell voltage"}
          unit={"v"}
          bbg={500}
          fontWeight={300}
          bg={300}
          value={props.low}
          icon={<ElectricBoltIcon sx={style} />}
        />
        <Temp
          temp={"High-cell voltage"}
          unit={"v"}
          bbg={500}
          fontWeight={300}
          bg={300}
          value={props.high}
          icon={<ElectricBoltIcon sx={style} />}
        />
        <Temp
          temp={"Avg-cell voltage"}
          unit={"v"}
          bbg={500}
          fontWeight={300}
          bg={300}
          value={((props.high + props.low) / 2).toFixed(3)}
          icon={<ElectricBoltIcon sx={style} />}
        />
      </Box>

      <Box
        display={"flex"}
        mt={"0.3rem"}
        justifyContent={"space-evenly"}
        minWidth={"16rem"}
      >
        <Temp
          temp={"Charger Temperature"}
          bbg={500}
          bg={300}
          fontWeight={300}
          unit={"°C"}
          // value={`0.${
          //   (props.high - props.low).toFixed(3).toString().split(".")[1]
          // }`}
          value={props.ct}
          icon={<ThermostatIcon sx={style} />}
        />
        <Temp
          temp={"MOS-temperature"}
          unit={"°C"}
          value={props.mt}
          bbg={500}
          fontWeight={300}
          bg={300}
          icon={<ThermostatIcon sx={style} />}
        />
        <Temp
          temp={"temperature - 1"}
          unit={"°C"}
          value={props.t1}
          bbg={500}
          fontWeight={300}
          bg={300}
          icon={<ThermostatIcon sx={style} />}
        />
      </Box>

      <Box
        display={"flex"}
        mt={"0.3rem"}
        justifyContent={"space-evenly"}
        minWidth={"16rem"}
      >
        <Temp
          temp={"temperature - 2"}
          unit={"°C"}
          value={props.t2}
          bbg={500}
          fontWeight={300}
          bg={300}
          icon={<ThermostatIcon sx={style} />}
        />
        <Temp
          temp={"temperature - 3"}
          unit={"°C"}
          value={props.t3}
          bbg={500}
          fontWeight={300}
          bg={300}
          icon={<ThermostatIcon sx={style} />}
        />
        <Temp
          temp={"temperature - 4"}
          unit={"°C"}
          value={props.t4}
          bbg={500}
          fontWeight={300}
          bg={300}
          icon={<ThermostatIcon sx={style} />}
        />
      </Box>
    </Box>
  );
};

export default BatteryMain;
