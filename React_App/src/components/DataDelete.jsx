import { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
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
  useTheme
} from "@mui/material";
import { tokens } from "../theme";

export default function DataDelete(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const currentDate = new Date();
  const [start, setStart] = useState(dayjs(currentDate));
  const [end, setEnd] = useState(dayjs(currentDate));
  const [userId, setUserId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const startDate = start.format("YYYY-MM-DD");
  const endDate = end.format("YYYY-MM-DD");


  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const Delete = async () => {
    try {

      const apiUrl = `${colors.palette[50]}/delete/data?user=${userId}&start=${startDate}&end=${endDate}`;
  
      const response = await fetch(apiUrl, {
        method: "DELETE", // Use the DELETE method
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data deleted successfully:", data);
        alert("Data deleted successfully!"); // Optional feedback for the user
      } else {
        console.error("Failed to delete data. Status:", response.status);
        alert("Failed to delete data. Please try again.");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ borderRadius: "0.7rem", boxShadow: "0 0 0 0", height: "2.25rem", width: "100%" }}>
        Delete
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete data</DialogTitle>
        <DialogContent style={{ padding: "1rem" }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-id-label">Vehicle Number</InputLabel>
              <Select
                labelId="vehicle-id-label"
                id="vehicle-id"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                label="Vehicle Number"
              >
                {props.vehicle.map((vehicle) => (
                  <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.vehicleNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <MobileDatePicker
                  label="Start Date"
                  value={start}
                  onChange={(newDate) => setStart(newDate)}
                  sx={{ width: "100%" }}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <MobileDatePicker
                  label="End Date"
                  value={end}
                  onChange={(newDate) => setEnd(newDate)}
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
          <Button variant="contained" onClick={Delete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
