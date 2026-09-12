import { useState, useEffect } from "react";

import {

  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const PartsTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const currentDate = new Date();
  const todayString = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  const formatDateField = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      return value.includes("T") ? value.split("T")[0] : value;
    }
    return new Date(value).toISOString().split("T")[0];
  };

  const handleDeleteClick = (part) => {
    setDeleteData(part);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/delete/vehicleparts/${chassisNumber}/${deleteData.partId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((part) => part.partId !== deleteData.partId)
        );
        setSnackbarMessage("Part deleted successfully");
      } else {
        const result = await response.json();
        setSnackbarMessage(result.message || "Failed to delete the part");
      }
    } catch (error) {
      setSnackbarMessage("Error deleting the part");
      console.error("Error:", error);
    }

    setSnackbarOpen(true);
    setDeleteData(null);
  };

  const handleDeleteCancel = () => {
    setDeleteData(null);
  };

  const handleEditClick = (part) => {
    setEditData(part);
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
      const response = await fetch(
        `${colors.palette[50]}/edit/vehicleparts/${chassisNumber}/${editData.partId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );
      console.log(editData);

      if (!response.ok) {
        throw new Error("Failed to update part");
      }
      await response.json();

      const refreshResponse = await fetch(
        `${colors.palette[50]}/get/vehicleparts/${props.chassisNumber}`
      );
      const refreshResult = await refreshResponse.json();
      if (refreshResponse.ok && refreshResult) {
        const formattedParts = refreshResult.parts.map((part) => ({
          ...part,
          dateInstalled: formatDateField(part.dateInstalled),
          previousUsageDates: formatDateField(part.previousUsageDates),
        }));
        setData(formattedParts);
      }
      setSnackbarMessage("Part updated successfully");
      setSnackbarOpen(true);
      setEditData(null);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setEditData(null);
  };

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleNavigate = () => {
    navigate(`/vehicle-table`);
  };

  const sendData = async (parts) => {
    try {
      const response = await fetch(`${colors.palette[50]}/put/vehicleparts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parts),
      });

      if (response.ok) {
        setSnackbarMessage("parts list saved");
      } else {
        setSnackbarMessage("failed to add parts to the list");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleReplacedClick = (partId) => {
    navigate(`/replaced/materials/form`, {
      state: { partId: partId, chassisNumber: chassisNumber },
    });
    props.onPartIdClick(partId, chassisNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${colors.palette[50]}/get/vehicleparts/${props.chassisNumber}`
      );
      const result = await response.json();

      if (response.ok && result) {
        const formattedParts = result.parts.map((part) => ({
          ...part,
          dateInstalled: formatDateField(part.dateInstalled),
          previousUsageDates: formatDateField(part.previousUsageDates),
        }));
        // setData(formattedParts);
        setData(formattedParts);
        setChassisNumber(result.chassisNumber);
        setVehicleNumber(result.vehicleNumber);
      } else {
        setData([]);
        setChassisNumber("");
        setSnackbarOpen(true);
        setSnackbarMessage(
          "No vehicle found with the provided chassis number."
        );
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    partId: Yup.string().required("Required"),
    partName: Yup.string().required("Required"),
    quantityUsed: Yup.number().required("Required").positive().integer(),
    dateInstalled: Yup.date().required("Required"),
    mileageAtInstallation: Yup.number().required("Required").integer(),
    supplier: Yup.string().required("Required"),
    costPerUnit: Yup.number().required("Required").positive(),
    // totalCost: Yup.number().required("Required").positive(),
    // installationLocation: Yup.string().required("Required"),
    replacementCount: Yup.number().required("Required").integer(),
    previousUsageDates: Yup.string().required("Required"),
    previousMileages: Yup.string().required("Required"),
    notes: Yup.string(),
  });

  // import { Button, Tooltip } from "@mui/material";

  const columns = [
    { field: "partId", headerName: "Part ID", flex: 0.7 },
    { field: "partName", headerName: "Part Name", flex: 1 },
    { field: "quantityUsed", headerName: "Quantity Used", flex: 0.7 },
    { field: "dateInstalled", headerName: "Date Installed", flex: 1 },
    {
      field: "mileageAtInstallation",
      headerName: "Mileage at Installation",
      flex: 0.6,
    },
    { field: "costPerUnit", headerName: "Cost per Unit", flex: 0.6 },
    { field: "replacementCount", headerName: "Replacement Count", flex: 1 },
    {
      field: "previousUsageDates",
      headerName: "Previous Usage Dates",
      flex: 1,
    },
    { field: "previousMileages", headerName: "Previous Mileages", flex: 0.6 },
    { field: "notes", headerName: "Notes", flex: 2 },
  ];

  // Insert "Supplier" if admin
  if (props.role === "admin") {
    columns.splice(6, 0, {
      field: "supplier",
      headerName: "Supplier",
      flex: 1,
    });
  }

  // Add actions if not customer
  if (props.role !== "customer") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        (props.role === "admin" || props.role === "service") && (
          <Box sx={{ display: "flex", gap: 1, py: 0.5, flexWrap: "wrap", mt: 1 }}>
            <Tooltip title="Edit">
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "0.3rem",
                  borderColor: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.16)",
                  color: colors.palette[100],
                }}
                variant="outlined"
                size="small"
                onClick={() => handleEditClick(params.row)}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "0.3rem",
                  background: isDark ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.92)",
                  boxShadow: "none",
                  "&:hover": {
                    background: isDark ? "rgba(238, 238, 238, 0.98)" : "rgba(34, 34, 34, 0.96)",
                  },
                  color: colors.palette[110],
                }}
                variant="contained"
                size="small"
                onClick={() => handleDeleteClick(params.row)}
              >
                Delete
              </Button>
            </Tooltip>
            <Tooltip title="Replaced Parts">
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "0.3rem",
                  borderColor: `${colors.palette[100]}80`,
                  color: colors.palette[100],
                }}
                onClick={() => handleReplacedClick(params.row.partId)}
              >
                View
              </Button>
            </Tooltip>
          </Box>
        ),
    });
  }


  const handleSubmit = (values, { resetForm }) => {
    setData([...data, values]);
    resetForm();
    handleAddDialogClose();
  };

  const formInitialValues = {
    partId: "ID-",
    partName: "",
    quantityUsed: 1,
    dateInstalled: todayString,
    mileageAtInstallation: 0,
    supplier: "",
    costPerUnit: 0,
    // totalCost: 0,
    // installationLocation: "",
    replacementCount: 0,
    previousUsageDates: todayString,
    previousMileages: 0,
    notes: "",
  };

  const generateJSON = () => {
    const partsList = {
      vehicleNumber: props.vehicleNumber,
      chassisNumber: props.chassisNumber,
      parts: data.map((part) => {
        return {
          partId: part.partId,
          partName: part.partName,
          quantityUsed: part.quantityUsed,
          dateInstalled: part.dateInstalled,
          mileageAtInstallation: part.mileageAtInstallation,
          supplier: part.supplier,
          costPerUnit: part.costPerUnit,
          // totalCost: part.totalCost,
          // installationLocation: part.installationLocation,
          replacementCount: part.replacementCount,
          previousUsageDates: part.previousUsageDates,
          previousMileages: part.previousMileages,
          notes: part.notes,
        };
      }),
    };
    sendData(partsList);
    setSnackbarOpen(true);
  };

  const dialogPaperSx = {
    borderRadius: "0.9rem",
    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0, 0, 0, 0.25)",
    background: isDark ? "rgba(66, 69, 71, 0.9)" : "rgba(255, 255, 255, 0.98)",
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
            <Box display="flex" alignItems="center" gap={0.8}>
              <Button
                onClick={handleNavigate}
                startIcon={<ArrowBackIosIcon />}
                sx={{
                  minWidth: "1.8rem",
                  p: 0,
                  color: colors.palette[100],
                }}
              />
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
                Vehicle Parts Information
              </Typography>
            </Box>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Track installed components and replacement history
            </Typography>
            <Box sx={{ mt: 1.1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#d7f8ec" : "#134e3b",
                  background: isDark ? "rgba(2,179,132,0.16)" : "rgba(2,179,132,0.12)",
                  border: `1px solid ${isDark ? "rgba(2,179,132,0.34)" : "rgba(2,179,132,0.2)"}`,
                }}
              >
                Chassis No: {props.chassisNumber}
              </Box>
              <Box
                sx={{
                  px: 1.1,
                  py: 0.45,
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: isDark ? "#dce6ff" : "#1e3a8a",
                  background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.12)",
                  border: `1px solid ${isDark ? "rgba(13,110,253,0.35)" : "rgba(13,110,253,0.2)"}`,
                }}
              >
                Vehicle No: {props.vehicleNumber}
              </Box>
            </Box>
          </Box>

          {props.role === "admin" || props.role === "service" ? (
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
                sx={{
                  minWidth: "10rem",
                  height: "2.55rem",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "0.75rem",
                  borderColor: `${colors.palette[500]}88`,
                  color: colors.palette[100],
                }}
              >
                Add Part
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  minWidth: "8rem",
                  height: "2.55rem",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "0.75rem",
                  background: `linear-gradient(90deg, ${colors.palette[500]} 0%, ${colors.palette[550]} 100%)`,
                  boxShadow: isDark
                    ? "0 1px 10px rgba(0, 227, 150, 0.25)"
                    : "0 1px 10px rgba(2, 179, 132, 0.22)",
                  "&:hover": {
                    background: `linear-gradient(90deg, ${colors.palette[550]} 0%, ${colors.palette[500]} 100%)`,
                  },
                }}
                onClick={generateJSON}
              >
                Save
              </Button>
            </Box>
          ) : null}
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
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row._id || row.partId}
          />
        </Box>
      </Box>
      <Dialog
        open={isAddDialogOpen}
        onClose={handleAddDialogClose}
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle>Add Part</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form id="add-part-form">
                <Field
                  as={TextField}
                  name="partId"
                  label="Part ID"
                  fullWidth
                  margin="dense"
                />
                {errors.partId && touched.partId ? (
                  <div>{errors.partId}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="partName"
                  label="Part Name"
                  fullWidth
                  margin="dense"
                />
                {errors.partName && touched.partName ? (
                  <div>{errors.partName}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="quantityUsed"
                  label="Quantity Used"
                  type="number"
                  fullWidth
                  margin="dense"
                />
                {errors.quantityUsed && touched.quantityUsed ? (
                  <div>{errors.quantityUsed}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="dateInstalled"
                  label="Date Installed"
                  type="date"
                  fullWidth
                  margin="dense"
                />
                {errors.dateInstalled && touched.dateInstalled ? (
                  <div>{errors.dateInstalled}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="mileageAtInstallation"
                  label="Mileage at Installation"
                  type="number"
                  fullWidth
                  margin="dense"
                />
                {errors.mileageAtInstallation &&
                touched.mileageAtInstallation ? (
                  <div>{errors.mileageAtInstallation}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="supplier"
                  label="Supplier"
                  fullWidth
                  margin="dense"
                />
                {errors.supplier && touched.supplier ? (
                  <div>{errors.supplier}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="costPerUnit"
                  label="Cost per Unit"
                  type="number"
                  fullWidth
                  margin="dense"
                />
                {errors.costPerUnit && touched.costPerUnit ? (
                  <div>{errors.costPerUnit}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="replacementCount"
                  label="Replacement Count"
                  type="number"
                  fullWidth
                  margin="dense"
                />
                {errors.replacementCount && touched.replacementCount ? (
                  <div>{errors.replacementCount}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="previousUsageDates"
                  label="Previous Usage Dates"
                  type="date"
                  fullWidth
                  margin="dense"
                />
                {errors.previousUsageDates && touched.previousUsageDates ? (
                  <div>{errors.previousUsageDates}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="previousMileages"
                  label="Previous Mileages"
                  fullWidth
                  margin="dense"
                />
                {errors.previousMileages && touched.previousMileages ? (
                  <div>{errors.previousMileages}</div>
                ) : null}
                <Field
                  as={TextField}
                  name="notes"
                  label="Notes"
                  fullWidth
                  margin="dense"
                />
                {errors.notes && touched.notes ? (
                  <div>{errors.notes}</div>
                ) : null}
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions style={{ marginRight: "1.5rem", marginBottom: "1rem" }}>
          <Button
            variant="outlined"
            onClick={handleAddDialogClose}
            startIcon={<CancelIcon />}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            form="add-part-form"
            type="submit"
            startIcon={<SaveIcon />}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!editData} onClose={handleCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Edit Part</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                margin="dense"
                label="Part ID"
                type="text"
                fullWidth
                name="partId"
                disabled={true}
                value={editData.partId}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Part Name"
                type="text"
                fullWidth
                name="partName"
                value={editData.partName}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Quantity Used"
                type="number"
                fullWidth
                name="quantityUsed"
                value={editData.quantityUsed}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Date Installed"
                type="date"
                fullWidth
                name="dateInstalled"
                value={editData.dateInstalled}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Mileage at Installation"
                type="number"
                fullWidth
                name="mileageAtInstallation"
                value={editData.mileageAtInstallation}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Supplier"
                type="text"
                fullWidth
                name="supplier"
                value={editData.supplier}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Costper Unit"
                type="number"
                fullWidth
                name="costPerUnit"
                value={editData.costPerUnit}
                onChange={handleEditChange}
              />
              {/* <TextField
                margin="dense"
                label="Total Cost"
                type="number"
                fullWidth
                name="totalCost"
                value={editData.totalCost}
                onChange={handleEditChange}
              /> */}
              {/* <TextField
                margin="dense"
                label="Installation Location"
                type="text"
                fullWidth
                name="installationLocation"
                value={editData.installationLocation}
                onChange={handleEditChange}
              /> */}
              <TextField
                margin="dense"
                label="Replacement Count"
                type="number"
                fullWidth
                name="replacementCount"
                value={editData.replacementCount}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Previous Usage Dates"
                type="date"
                fullWidth
                name="previousUsageDates"
                value={editData.previousUsageDates}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Previous Mileages"
                type="text"
                fullWidth
                name="previousMileages"
                value={editData.previousMileages}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Notes"
                type="text"
                fullWidth
                name="notes"
                value={editData.notes}
                onChange={handleEditChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions style={{ marginRight: "1.5rem", marginBottom: "1rem" }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteData} onClose={handleDeleteCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete the part with Part ID{" "}
            <strong>{deleteData?.partId}</strong>?
          </p>
        </DialogContent>
        <DialogActions style={{ marginRight: "1rem", marginBottom: "1rem" }}>
          <Button
            variant="outlined"
            onClick={handleDeleteCancel}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            startIcon={<DeleteIcon />}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default PartsTable;
