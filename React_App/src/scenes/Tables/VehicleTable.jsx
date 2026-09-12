import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { tokens } from "../../theme";

const VehicleTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const apiBase = colors.palette[50];

  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleId: "",
    dealerToken: "",
    financeToken: "",
    accessToken: "",
    name: "",
    vehicleNo: "",
    chassiNo: "",
    motorNo: "",
    batteryId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = `${apiBase}/vehicles`;
        if (props.role === "customer") {
          endpoint = `${apiBase}/fleet/vehicles?accessToken=${encodeURIComponent(
            props.accessToken || ""
          )}`;
        } else if (props.role === "service") {
          endpoint = `${apiBase}/dealer/vehicles?dealerToken=${encodeURIComponent(
            props.dealerToken || ""
          )}`;
        }

        const response = await fetch(endpoint);
        const result = await response.json();

        if (!response.ok) {
          setData([]);
          return;
        }

        if (!Array.isArray(result) || result.length === 0) {
          setData([]);
          return;
        }

        setData(result);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [apiBase, props.accessToken, props.dealerToken, props.role]);

  const handleNavigate = (chassisNo, vehicleNo) => {
    navigate(`/materials/form`, {
      state: { chassisNumber: chassisNo, vehicleNumber: vehicleNo },
    });
    props.onVehicleNumberClick(chassisNo, vehicleNo);
  };

  const handleDeleteClick = (vehicle) => {
    setDeleteData(vehicle);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/vehicle/delete/${deleteData.vehicleId}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((vehicle) => vehicle.vehicleId !== deleteData.vehicleId)
        );
      } else {
        console.error(result.message || "Failed to delete the vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
    setDeleteData(null);
  };

  const handleDeleteCancel = () => {
    setDeleteData(null);
  };

  const handleEditClick = (vehicle) => {
    setEditData(vehicle);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const id = editData.vehicleId;
      const response = await fetch(`${colors.palette[50]}/vehicle/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const result = await response.json();

      if (response.ok) {
        setData((prevData) =>
          prevData.map((vehicle) =>
            vehicle.vehicleId === editData.vehicleId ? editData : vehicle
          )
        );
      } else {
        console.error(result.message || "Failed to update the vehicle");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
    setEditData(null);
  };

  const handleCancel = () => {
    setEditData(null);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSave = async () => {
    if (!newVehicle.chassiNo?.trim() && !newVehicle.vehicleNo?.trim()) {
      console.error("No data to add.");
      return;
    }

    try {
      const response = await fetch(`${colors.palette[50]}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });
      const result = await response.json();

      if (response.ok) {
        const appendedVehicle =
          result && result.vehicleId
            ? result
            : { ...newVehicle, vehicleId: newVehicle.vehicleId || Date.now().toString() };
        setData((prevData) => [...prevData, appendedVehicle]);
      } else {
        console.error(result.message || "Failed to add the vehicle");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
    setIsAddDialogOpen(false);
  };

  const handleAddCancel = () => {
    setIsAddDialogOpen(false);
  };

  const columns = [
    ...(props.role !== "service" && props.role !== "customer"
      ? [
          { headerName: "Vehicle ID", field: "vehicleId", flex: 1 },
          { headerName: "Dealer ID", field: "dealerToken", flex: 1 },
        ]
      : []),
    ...(props.role !== "admin" && props.role !== "customer"
      ? [{ headerName: "Financer ID", field: "financeToken", flex: 1 }]
      : []),
    ...(props.role !== "customer"
      ? [{ headerName: "Fleet / Customer ID", field: "accessToken", flex: 1 }]
      : []),
    { headerName: "Vehicle Name", field: "name", flex: 1 },
    { headerName: "Vehicle Number", field: "vehicleNo", flex: 1 },
    { headerName: "Chassi Number", field: "chassiNo", flex: 1 },
    { headerName: "Motor Number", field: "motorNo", flex: 1 },
    { headerName: "Battery Number", field: "batteryId", flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.4} flexWrap="wrap" py={0.5} mt={1}>
          {(props.role === "admin" || props.role === "service") && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEditClick(params.row)}
              sx={{ textTransform: "none", borderRadius: "0.3rem" }}
            >
              Edit
            </Button>
          )}
          {props.role === "admin" && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                textTransform: "none",
                borderRadius: "0.3rem",
                backgroundColor: colors.palette[100],
                color: colors.palette[110],
                "&:hover": { backgroundColor: colors.palette[150] },
                boxShadow: "none",
              }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleNavigate(params.row.chassiNo, params.row.vehicleNo)}
            sx={{ textTransform: "none", borderRadius: "0.3rem" }}
          >
            View Parts
          </Button>
        </Box>
      ),
    },
  ];

  const dialogPaperSx = {
    borderRadius: "0.9rem",
    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
    background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(8px)",
    boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: colors.palette[130],
        "&::before": {
          content: "\"\"",
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "0.9rem", md: "1.4rem 1.6rem 2rem 1.6rem" },
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          p={{ xs: "1rem", md: "1.05rem 1.2rem" }}
          borderRadius="1rem"
          bgcolor={isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.82)"}
          sx={{
            backdropFilter: "blur(8px)",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
          }}
          boxShadow={isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)"}
          gap={2}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                margin: 0,
                fontSize: { xs: "1.35rem", md: "1.75rem" },
                color: colors.palette[100],
                letterSpacing: "0.02em",
              }}
            >
              Vehicle Table
            </Typography>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Register, update, and view vehicle records
            </Typography>
            <Box
              sx={{
                mt: 1.1,
                px: 1.1,
                py: 0.45,
                borderRadius: "999px",
                width: "fit-content",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: isDark ? "#d7f8ec" : "#134e3b",
                background: isDark ? "rgba(2,179,132,0.16)" : "rgba(2,179,132,0.12)",
                border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
              }}
            >
              Total Vehicles: {data.length}
            </Box>
          </Box>

          {props.role === "admin" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                minWidth: "10rem",
                height: "2.55rem",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "0.75rem",
                background: `linear-gradient(90deg, ${colors.palette[500]} 0%, ${colors.palette[550]} 100%)`,
                boxShadow: isDark
                ? "0 1px 10px rgba(0, 227, 150, 0.25)"
                : "0 1px 10px rgba(2, 179, 132, 0.22)",
                "&:hover": {
                  background: `linear-gradient(90deg, ${colors.palette[550]} 0%, ${colors.palette[500]} 100%)`,
                },
              }}
            >
              Add Vehicle
            </Button>
          )}
        </Box>

        <Box
          sx={{
            height: "75vh",
            marginTop: "1rem",
            borderRadius: "1rem",
            overflow: "hidden",
            border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
            background: isDark ? "rgba(66, 69, 71, 0.78)" : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(8px)",
            boxShadow: isDark ? "0 10px 22px rgba(0,0,0,0.28)" : "0 2px 12px rgba(14, 21, 29, 0.1)",
            "& .MuiDataGrid-root": { border: "none", background: "transparent" },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)",
              color: colors.palette[100],
              fontSize: "1rem",
            },
            "& .MuiDataGrid-columnSeparator": { color: "transparent" },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "0.95rem",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
            },
            "& .MuiDataGrid-row:hover": {
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(2,179,132,0.06)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(2,179,132,0.08)",
              minHeight: "46px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-root": {
              width: "100%",
              overflow: "hidden",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-toolbar": {
              minHeight: "46px",
              flexWrap: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              paddingLeft: "0.8rem",
              paddingRight: "0.8rem",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-actions": {
              marginLeft: "0.25rem",
              flexShrink: 0,
            },
            "& .MuiDataGrid-toolbarContainer": {
              p: 1,
              borderBottom: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.palette[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
            getRowId={(row) => row.vehicleId || row.chassiNo || row.vehicleNo || row.name}
          />
        </Box>
      </Box>

      <Dialog open={!!editData} onClose={handleCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                margin="dense"
                label="Vehicle Name"
                type="text"
                fullWidth
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Dealer ID"
                type="text"
                fullWidth
                name="dealerToken"
                disabled={props.role !== "admin"}
                value={editData.dealerToken || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Financer ID"
                type="text"
                fullWidth
                name="financeToken"
                disabled={props.role !== "service"}
                value={editData.financeToken || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Fleet ID"
                type="text"
                fullWidth
                name="accessToken"
                disabled={props.role !== "service"}
                value={editData.accessToken || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Vehicle Number"
                type="text"
                fullWidth
                name="vehicleNo"
                value={editData.vehicleNo || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Chassi Number"
                type="text"
                fullWidth
                name="chassiNo"
                disabled
                value={editData.chassiNo || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Motor Number"
                type="text"
                fullWidth
                name="motorNo"
                value={editData.motorNo || ""}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Battery Number"
                type="text"
                fullWidth
                name="batteryId"
                value={editData.batteryId || ""}
                onChange={handleEditChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ mr: 1.2, mb: 1.2 }}>
          <Button variant="outlined" onClick={handleCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteData} onClose={handleDeleteCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the vehicle{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {deleteData?.name}
            </Box>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mr: 1.2, mb: 1.2 }}>
          <Button variant="outlined" onClick={handleDeleteCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#1a1a1a" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddDialogOpen} onClose={handleAddCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Add Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Vehicle Name"
            type="text"
            fullWidth
            name="name"
            value={newVehicle.name}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Vehicle Id"
            type="text"
            fullWidth
            name="vehicleId"
            value={newVehicle.vehicleId}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Dealer ID"
            type="text"
            fullWidth
            name="dealerToken"
            value={newVehicle.dealerToken}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Fleet ID"
            type="text"
            fullWidth
            name="accessToken"
            value={newVehicle.accessToken}
            disabled={props.role !== "service"}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Vehicle Number"
            type="text"
            fullWidth
            name="vehicleNo"
            value={newVehicle.vehicleNo}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Chassi Number"
            type="text"
            fullWidth
            name="chassiNo"
            value={newVehicle.chassiNo}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Motor Number"
            type="text"
            fullWidth
            name="motorNo"
            value={newVehicle.motorNo}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            label="Battery Number"
            type="text"
            fullWidth
            name="batteryId"
            value={newVehicle.batteryId}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions sx={{ mr: 1.2, mb: 1.2 }}>
          <Button variant="outlined" onClick={handleAddCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddSave} startIcon={<SaveIcon />} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleTable;
