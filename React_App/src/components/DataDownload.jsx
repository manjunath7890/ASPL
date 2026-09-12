import { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import Xlsx from "./DownloadXlsx";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function DataDownload(props) {
  const currentDate = new Date();
  const [date, setDate] = useState(dayjs(currentDate));
  const [startTime, setStartTime] = useState(dayjs(currentDate));
  const [endTime, setEndTime] = useState(dayjs(currentDate));
  const [userId, setUserId] = useState(null); // Initialize as null
  const [mode, setMode] = useState(2); // Default mode: Charging
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedDate = date.format("YYYY-MM-DD");
  const formattedStartTime = startTime.format("HH:mm");
  const formattedEndTime = endTime.format("HH:mm");

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleModeChange = (event) => setMode(event.target.value);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={"100%"}
    >
      <Button variant="contained" color="secondary" onClick={handleDialogOpen} 
        style={{ boxShadow: "0 0 0 0", height: "2.25rem", color: "#fff", width: "100%", borderRadius: "0.7rem" }}
      >
        Download
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Download Data</DialogTitle>
        <DialogContent style={{ padding: "1rem" }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-id-label">Vehicle Number</InputLabel>
              <Select
                labelId="vehicle-id-label"
                id="vehicle-id"
                value={userId || ""}
                onChange={(event) => setUserId(event.target.value)}
                label="Vehicle Number"
              >
                {props.vehicle.map((vehicle) => (
                  <MenuItem key={vehicle.vehicleId} value={vehicle}>
                    {vehicle.vehicleNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="mode-label">Mode</InputLabel>
              <Select
                labelId="mode-label"
                value={mode}
                onChange={handleModeChange}
              >
                <MenuItem value={2}>Charging</MenuItem>
                <MenuItem value={3}>Drive</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <MobileDatePicker
                  label="Select Date"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <MobileTimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newStartTime) => setStartTime(newStartTime)}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <MobileTimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newEndTime) => setEndTime(newEndTime)}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Xlsx
            fileName={`${userId?.vehicleNo || "Unknown_Vehicle"
              }[${formattedDate}]`}
            user={userId?.vehicleId || ""}
            date={formattedDate}
            start={formattedStartTime}
            end={formattedEndTime}
            mode={mode}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
