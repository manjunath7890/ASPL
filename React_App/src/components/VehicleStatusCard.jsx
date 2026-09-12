import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import SwitchExample from "./Switch";
import { useEffect, useState } from "react";

const BATTERY_FAULT_MAP = {
  1: "Cell voltage too high",
  2: "Cell voltage too low",
  3: "Battery pack voltage too high",
  4: "Battery pack voltage too low",
  5: "Charging temperature too high",
  6: "Charging temperature too low",
  7: "Discharging temperature too high",
  8: "Discharging temperature too low",
  9: "Charging current too high",
  10: "Discharging current too high",
  11: "Short circuit detected",
  12: "Battery monitoring chip error",
  13: "Battery output locked by system",
};

const CONTROLLER_FAULT_MAP = {
  1: "Controller current too high",
  4: "Controller voltage too high",
  7: "Drive protection is active",
  8: "Motor tuning failed",
  9: "Drive overloaded",
  10: "Motor overloaded",
  11: "U-phase Hall sensor fault",
  12: "Motor output shorted to ground",
  13: "Abnormal gear shift at high speed",
  14: "U-phase motor output missing",
  16: "Drive temperature too high",
  17: "Motor temperature too high",
  18: "Drive temperature sensor disconnected",
  19: "Resolver signal abnormal",
  20: "Low-voltage supply too high (12V/24V)",
  21: "Low-voltage supply too low (12V/24V)",
  22: "High-voltage interlock fault",
  23: "Upper limit and resolver conflict",
  24: "Speed direction and gear signal mismatch",
  29: "Drive parameter read/write error",
  37: "Hardware overvoltage baseline incorrect",
  38: "Driver board power overrun fault",
  39: "Motor stall detected",
  40: "Analog input out of range",
  41: "DC bus voltage too low",
  43: "Speed deviation too high (speed mode)",
  46: "CAN communication fault",
  47: "Motor overspeed fault",
  48: "Motor temperature sensor disconnected",
  49: "Hardware overcurrent fault",
  50: "Hardware overvoltage fault",
  51: "Drive power undervoltage",
  52: "Resolver connector loose/disconnected",
  53: "Controller drive fault",
  54: "Drive board power supply fault",
  55: "Low-voltage supply undervoltage",
  56: "U-phase Hall sensor disconnected",
  57: "V-phase Hall sensor disconnected",
  58: "W-phase Hall sensor disconnected",
  59: "V-phase Hall sensor abnormal",
  60: "W-phase Hall sensor abnormal",
};

const normalizeFaultCode = (value) => {
  if (value === null || value === undefined) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  if (/^0x[0-9a-f]+$/i.test(raw)) {
    return Number.parseInt(raw, 16);
  }

  if (/^\d+$/.test(raw)) {
    return Number.parseInt(raw, 10);
  }

  return null;
};

const VehicleStatusCard = ({
  model,
  number,
  controllerHealth,
  batteryCondition,
  vehicleStatus,
  gps = 0,
  online = 0,
  role,
  user,
  gradient,
  auto = 0,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const surfaceBorder =
    theme.palette.mode === "dark"
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid rgba(0, 0, 0, 0.25)";
  const surfaceShadow =
    theme.palette.mode === "dark"
      ? "0 10px 22px rgba(0,0,0,0.28)"
      : "0 2px 12px rgba(14, 21, 29, 0.1)";
  const [initialOffline, setInitialOffline] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInitialOffline(false);
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, []);

  const normalizedBatteryFaultCode = normalizeFaultCode(batteryCondition);
  const batteryFaultDescription = BATTERY_FAULT_MAP[normalizedBatteryFaultCode] ?? batteryCondition;
  const batteryFaultActive = normalizedBatteryFaultCode !== null && normalizedBatteryFaultCode !== 0;
  const normalizedControllerFaultCode = normalizeFaultCode(controllerHealth);
  const controllerFaultDescription =
    CONTROLLER_FAULT_MAP[normalizedControllerFaultCode] ?? controllerHealth;
  const controllerFaultActive = normalizedControllerFaultCode !== null && normalizedControllerFaultCode !== 0;

  const effectiveOnline = initialOffline ? 0 : online;
  const effectiveVehicleStatus = initialOffline ? "Vehicle Offline" : vehicleStatus;

  const pillStyle = (active) => ({
    padding: "0.2rem 0.8rem",
    borderRadius: "999px",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: active ? colors.palette[500] : colors.palette[150],
    border: `1px solid ${active ? colors.palette[500] : colors.palette[700]}`,
    background: active ? colors.palette[1150] : colors.palette[300],
  });

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <Box width="100%">
        <Box display="flex" alignItems="center" gap={1}>
          <Box fontSize="1.4rem" fontWeight={800} color={colors.palette[100]}>
            {model}
          </Box>
          <Box fontSize="0.85rem" fontWeight={600} color={colors.palette[150]}>
            {number}
          </Box>
        </Box>

        <Box mt="0.6rem" display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <Box sx={pillStyle(gps === 1 && effectiveOnline === 1)}>GPS</Box>
            <Box sx={pillStyle(effectiveOnline === 1)}>
              {effectiveOnline === 1 ? "ONLINE" : "OFFLINE"}
            </Box>
          </Box>
          <SwitchExample role={role} user={user} slope={gradient} signal={effectiveOnline} gps={gps} />
        </Box>

        <Box mt="1.2rem" display="flex" alignItems="center" gap={2}>
          <Box
            padding="0.3rem 1rem"
            borderRadius="0.7rem"
            border={`1px solid ${colors.palette[100]}`}
            sx={{ background: colors.palette[100] }}
            width="fit-content"
          >
            <Box
              fontSize="1.5rem"
              fontWeight={700}
              color={colors.palette[110]}
              sx={{ wordSpacing: "0.1em", letterSpacing: "0.03em" }}
            >
              {effectiveVehicleStatus}
            </Box>
          </Box>
        </Box>

        <Box mt="0.8rem" display="flex" flexDirection="column" gap={1.5} width="100%">
          <Box
            padding="0.6rem 0.8rem"
            borderRadius="0.75rem"
            border={surfaceBorder}
            boxShadow={surfaceShadow}
            sx={{ background: controllerFaultActive ? colors.palette[1450] : "transparent" }}
            width="100%"
          >
            <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
              CONTROLLER FAULT
            </Box>
            <Box fontSize="1rem" fontWeight={700} color={colors.palette[100]}>
              {controllerFaultDescription}
            </Box>
          </Box>
          <Box
            padding="0.6rem 0.8rem"
            borderRadius="0.75rem"
            border={surfaceBorder}
            boxShadow={surfaceShadow}
            sx={{ background: batteryFaultActive ? colors.palette[1450] : "transparent" }}
            width="100%"
          >
            <Box fontSize="0.6rem" letterSpacing="0.08em" color={colors.palette[150]} fontWeight={700}>
              BATTERY FAULT
            </Box>
            <Box fontSize="1rem" fontWeight={700} color={colors.palette[100]}>
              {batteryFaultDescription}
            </Box>
          </Box>
        </Box>
      </Box>

      
    </Box>
  );
};

export default VehicleStatusCard;
