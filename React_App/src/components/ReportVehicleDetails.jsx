import { useState } from "react";
import { Box, useTheme, Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import { tokens } from "../theme";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RepoVehicleDetails = ({
  vehicleName,
  vehicleNo,
  driveSessionMinutes,
  driveSessionRangeDetails,
  gearPercentages,
  modePercentages,
  gearMappings,
  modeMappings,
  modeColors,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openTimeDialog, setOpenTimeDialog] = useState(false);

  const style = {
    color: colors.palette[110],
    p: "0.2rem",
    fontSize: "2.5rem",
    marginBottom: "0.2rem",
    marginTop: "0.2rem",
  };

  const timeIconStyle = {
    color: colors.palette[110],
    fontSize: "1.5rem",
    p: "0.1rem",
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        mt={"0.2rem"}
        pb={"0.25rem"}
        height={"100%"}
      >
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"flex-start"} px={"0.5rem"} py={"0.5rem"}>
          <Box display={"flex"}>
            <Button
            onClick={() => setOpenTimeDialog(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "1rem",
              paddingX: "0.5rem",
              paddingY: "0.1rem",
              backgroundColor: colors.palette[500],
              color: colors.palette[110],
              fontSize: "0.72rem",
              fontWeight: "600",
              textTransform: "none",
              minWidth: "auto",
              "&:hover": {
                backgroundColor: colors.palette[510],
              },
            }}
          >
            <AccessTimeIcon sx={style} />
          </Button>
            <Box
              pl={"1rem"}
              // mt={"0.5rem"}
              color={colors.palette[100]}
            >
              <h4 style={{ fontWeight: "700", marginTop: "0.2rem", marginBottom: "0rem", fontSize: "1.1rem" }}>{vehicleName ? vehicleName : "-----"}</h4>
              <h7 style={{ marginTop: "-0.5rem", color: colors.palette[500], fontWeight: "600" }}>
                {" "}{vehicleNo ? vehicleNo : "-----"}
              </h7>
            </Box>
          </Box>
          
        </Box>
        <Box
          mt={"0.35rem"}
          px={"0.5rem"}
          pt={"0.3rem"}
          borderTop={`1px solid ${colors.palette[900]}`}
        >
          <Box fontSize={"0.68rem"} color={colors.palette[100]} fontWeight={400} mb={"0.2rem"}>
            GEARS
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap={"0.25rem"}>
            {Object.entries(gearPercentages || {}).map(([value, percentage]) => (
              <Box
                key={`gear-${value}`}
                border={`1px solid ${colors.palette[900]}`}
                borderRadius={"0.25rem"}
                px={"0.35rem"}
                py={"0.2rem"}
                minHeight={"2rem"}
              >
                <Box fontSize={"0.58rem"} color={colors.palette[700]}>
                  {(gearMappings && gearMappings[value]) || `Gear ${value}`}
                </Box>
                <Box fontSize={"0.8rem"} fontWeight={700} color={colors.palette[100]}>
                  {Number(percentage).toFixed(1)}%
                </Box>
              </Box>
            ))}
          </Box>

          <Box fontSize={"0.68rem"} color={colors.palette[100]} fontWeight={400} mt={"0.5rem"} mb={"0.2rem"}>
            DRIVE MODES
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap={"0.25rem"}>
            {Object.entries(modePercentages || {}).map(([value, percentage]) => (
              <Box
                key={`mode-${value}`}
                border={`1px solid ${colors.palette[900]}`}
                borderRadius={"0.25rem"}
                px={"0.35rem"}
                py={"0.2rem"}
                minHeight={"2rem"}
              >
                <Box fontSize={"0.58rem"} color={colors.palette[700]}>
                  {(modeMappings && modeMappings[value]) || `Mode ${value}`}
                </Box>
                <Box
                  fontSize={"0.8rem"}
                  fontWeight={700}
                  color={(modeColors && modeColors[value]) || colors.palette[100]}
                >
                  {Number(percentage).toFixed(1)}%
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openTimeDialog}
        onClose={() => setOpenTimeDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            backgroundColor: colors.palette[110],
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Drive Time Segments
          <div
                style={{
                  marginTop: "0.1rem",
                  fontSize: "0.72rem",
                  color: colors.palette[700],
                  fontWeight: "500",
                }}
              >
                Drive Session Time: {driveSessionMinutes || 0} mins
              </div>
        </DialogTitle>
        <DialogContent>
          {(driveSessionRangeDetails && driveSessionRangeDetails.length > 0) ? (
            driveSessionRangeDetails.map((segment, index) => (
              <Box
                key={`segment-${index}`}
                border={`1px solid ${colors.palette[900]}`}
                borderRadius={"0.4rem"}
                px={"0.6rem"}
                py={"0.45rem"}
                mb={"0.45rem"}
              >
                <Typography fontSize={"0.82rem"} color={colors.palette[100]} fontWeight={600}>
                  {segment.start} - {segment.end}
                </Typography>
                <Typography fontSize={"0.72rem"} color={colors.palette[700]}>
                  {segment.durationHHMMSS} ({segment.minutes} mins)
                </Typography>
              </Box>
            ))
          ) : (
            <Typography fontSize={"0.82rem"} color={colors.palette[700]}>
              00:00:00 - 00:00:00 (0 mins)
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepoVehicleDetails;
