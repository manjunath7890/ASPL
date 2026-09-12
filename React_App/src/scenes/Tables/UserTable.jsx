import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tokens } from "../../theme";

const getRoleLabel = (role) => {
  if (role === "service") return "dealer";
  if (role === "admin") return "organization";
  if (role === "customer") return "fleet/customer";
  return role || "--";
};

const withSerialNumbers = (users) =>
  users.map((user, index) => ({
    ...user,
    serialNumber: index + 1,
  }));

const UserTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";
  const apiBase = colors.palette[50];

  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    role: "",
    contact: "",
    accessToken: "",
    financeToken: "",
    dealerToken: props.role === "service" ? props.dealerToken : "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (props.role === "admin") {
          const response = await fetch(`${apiBase}/users`);
          const result = await response.json();

          const filteredUsers = result.filter(
            (user) => user.role !== "customer" && user.role !== "financer"
          );

          const sortedUsers = filteredUsers.sort((a, b) => {
            if (a.role === "admin" && b.role !== "admin") return -1;
            if (a.role !== "admin" && b.role === "admin") return 1;
            return 0;
          });

          setData(withSerialNumbers(sortedUsers));
        } else {
          const response = await fetch(
            `${apiBase}/dealer/users?dealerToken=${encodeURIComponent(
              props.dealerToken || ""
            )}`
          );
          const result = await response.json();
          setData(withSerialNumbers(result));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [apiBase, props.dealerToken, props.role]);

  const handleArrowClick = (user, dealerToken) => {
    navigate(`/moredetails`, { state: { userName: user, dealerToken } });
    props.onDealerClick(user, dealerToken);
  };

  const handleDeleteClick = (user) => setDeleteData(user);
  const handleDeleteCancel = () => setDeleteData(null);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/user/delete/${deleteData._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (response.ok) {
        const nextData = data.filter((user) => user._id !== deleteData._id);
        setData(withSerialNumbers(nextData));
      } else {
        console.error(result.message || "Failed to delete the user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setDeleteData(null);
  };

  const handleEditClick = (user) => setEditData(user);
  const handleCancel = () => setEditData(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${colors.palette[50]}/user/update/${editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const nextData = data.map((user) =>
          user._id === editData._id ? { ...user, ...editData } : user
        );
        setData(withSerialNumbers(nextData));
      } else {
        console.error(result.message || "Failed to update the user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setEditData(null);
  };

  const handleAddClick = () => setIsAddDialogOpen(true);
  const handleAddCancel = () => setIsAddDialogOpen(false);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSave = async () => {
    if (
      newUser.email.trim() === "" ||
      newUser.password.trim() === "" ||
      newUser.role.trim() === ""
    ) {
      console.error("No data to add.");
      return;
    }

    try {
      const response = await fetch(`${colors.palette[50]}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (response.ok) {
        if (result && result._id) {
          const nextData = [...data, result];
          setData(withSerialNumbers(nextData));
        } else {
          const tempUser = { ...newUser, _id: Date.now().toString() };
          const nextData = [...data, tempUser];
          setData(withSerialNumbers(nextData));
        }
      } else {
        console.error(result.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }

    setIsAddDialogOpen(false);
  };

  const columns = [
    { field: "serialNumber", headerName: "Sl no.", flex: 0.35 },
    { field: "userName", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.1 },
  ];

  if (props.role !== "service") {
    columns.push({
      field: "role",
      headerName: "Role",
      flex: 0.9,
      valueGetter: (_, row) => getRoleLabel(row.role),
    });
  }

  columns.push({ field: "contact", headerName: "Contact", flex: 0.95 });

  if (props.role !== "service") {
    columns.push({ field: "dealerToken", headerName: "Dealer ID", flex: 1 });
  }

  if (props.role === "service") {
    columns.push(
      { field: "accessToken", headerName: "Fleet/Customer ID", flex: 1.05 },
      { field: "financeToken", headerName: "Financer ID", flex: 1.05 }
    );
  }

  columns.push({
    field: "actions",
    headerName: "Actions",
    flex: 1.7,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" gap={1.4} flexWrap="wrap" py={0.5} mt={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditClick(params.row)}
          sx={{ textTransform: "none", borderRadius: "0.3rem" }}
        >
          Edit
        </Button>
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
        {params.row.role === "service" && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleArrowClick(params.row.userName, params.row.dealerToken)}
            sx={{ textTransform: "none", borderRadius: "0.3rem" }}
          >
            Details
          </Button>
        )}
      </Box>
    ),
  });

  const adminCount = data.filter((u) => u.role === "admin").length;
  const dealerCount = data.filter((u) => u.role === "service").length;
  const customerCount = data.filter((u) => u.role === "customer").length;
  const financerCount = data.filter((u) => u.role === "financer").length;

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
              User Table
            </Typography>
            <Typography
              sx={{
                margin: 0,
                marginTop: "0.2rem",
                color: colors.palette[150],
                fontSize: "0.85rem",
              }}
            >
              Manage users, roles, and access permissions
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mt={1.1}>
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
                Total: {data.length}
              </Box>
              {props.role === "admin" ? (
                <>
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.45,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: isDark ? "#d6f5ff" : "#0b4f6c",
                      background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.11)",
                      border: `1px solid ${isDark ? "rgba(13,110,253,0.34)" : "rgba(13,110,253,0.22)"}`,
                    }}
                  >
                    Organizations: {adminCount}
                  </Box>
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.45,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: isDark ? "#f1e7ff" : "#4f2f8e",
                      background: isDark ? "rgba(119,93,208,0.17)" : "rgba(119,93,208,0.12)",
                      border: `1px solid ${isDark ? "rgba(119,93,208,0.34)" : "rgba(119,93,208,0.22)"}`,
                    }}
                  >
                    Dealers: {dealerCount}
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.45,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: isDark ? "#d6f5ff" : "#0b4f6c",
                      background: isDark ? "rgba(13,110,253,0.16)" : "rgba(13,110,253,0.11)",
                      border: `1px solid ${isDark ? "rgba(13,110,253,0.34)" : "rgba(13,110,253,0.22)"}`,
                    }}
                  >
                    Fleet/Customers: {customerCount}
                  </Box>
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.45,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: isDark ? "#ffe9d7" : "#7f3d1e",
                      background: isDark ? "rgba(254,176,25,0.18)" : "rgba(254,176,25,0.13)",
                      border: `1px solid ${isDark ? "rgba(254,176,25,0.34)" : "rgba(254,176,25,0.22)"}`,
                    }}
                  >
                    Financers: {financerCount}
                  </Box>
                </>
              )}
            </Box>
          </Box>

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
            Add User
          </Button>
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
            getRowId={(row) => row._id || row.id || row.email || row.serialNumber}
          />
        </Box>
      </Box>

      <Dialog open={!!editData} onClose={handleCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                name="userName"
                value={editData.userName}
                onChange={handleEditChange}
              />

              {props.role === "admin" ? (
                <>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="edit-role-label">Role</InputLabel>
                    <Select
                      labelId="edit-role-label"
                      id="edit-role"
                      name="role"
                      value={editData.role}
                      onChange={handleEditChange}
                      label="Role"
                    >
                      <MenuItem value="admin">Organization</MenuItem>
                      <MenuItem value="service">Dealer</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    margin="dense"
                    label="Dealer ID"
                    type="text"
                    fullWidth
                    name="dealerToken"
                    value={editData.dealerToken || ""}
                    onChange={handleEditChange}
                    disabled={editData.role === "admin"}
                  />
                </>
              ) : (
                <>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="edit-role-label">Role</InputLabel>
                    <Select
                      labelId="edit-role-label"
                      id="edit-role"
                      name="role"
                      value={editData.role}
                      onChange={handleEditChange}
                      label="Role"
                    >
                      <MenuItem value="customer">Fleet/Customer</MenuItem>
                      <MenuItem value="financer">Financer</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    margin="dense"
                    label="Fleet ID"
                    type="text"
                    fullWidth
                    name="accessToken"
                    value={editData.accessToken || ""}
                    onChange={handleEditChange}
                    disabled={editData.role !== "customer"}
                  />
                  <TextField
                    margin="dense"
                    label="Financer ID"
                    type="text"
                    fullWidth
                    name="financeToken"
                    value={editData.financeToken || ""}
                    onChange={handleEditChange}
                    disabled={editData.role !== "financer"}
                  />
                </>
              )}

              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                label="Contact"
                type="number"
                fullWidth
                name="contact"
                value={editData.contact}
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

      <Dialog open={isAddDialogOpen} onClose={handleAddCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="userName"
            value={newUser.userName}
            onChange={handleAddChange}
          />

          {props.role === "admin" ? (
            <>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="add-role-label">Role</InputLabel>
                <Select
                  labelId="add-role-label"
                  value={newUser.role}
                  name="role"
                  onChange={handleAddChange}
                  label="Role"
                >
                  <MenuItem value="admin">Organization</MenuItem>
                  <MenuItem value="service">Dealer</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Dealer ID"
                type="text"
                fullWidth
                name="dealerToken"
                value={newUser.dealerToken}
                onChange={handleAddChange}
                disabled={newUser.role !== "service"}
              />
            </>
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="add-role-label">Role</InputLabel>
                <Select
                  labelId="add-role-label"
                  value={newUser.role}
                  name="role"
                  onChange={handleAddChange}
                  label="Role"
                >
                  <MenuItem value="customer">Fleet/Customer</MenuItem>
                  <MenuItem value="financer">Financer</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Dealer ID"
                type="text"
                fullWidth
                name="dealerToken"
                value={props.dealerToken}
                disabled
              />
              <TextField
                margin="dense"
                label="Fleet ID"
                type="text"
                fullWidth
                name="accessToken"
                value={newUser.accessToken}
                onChange={handleAddChange}
                disabled={newUser.role !== "customer"}
              />
              <TextField
                margin="dense"
                label="Financer ID"
                type="text"
                fullWidth
                name="financeToken"
                value={newUser.financeToken || ""}
                onChange={handleAddChange}
                disabled={newUser.role !== "financer"}
              />
            </>
          )}

          <TextField
            margin="dense"
            label="Contact"
            type="number"
            fullWidth
            name="contact"
            value={newUser.contact}
            onChange={handleAddChange}
          />

          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={newUser.email}
            onChange={handleAddChange}
          />

          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={newUser.password}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions sx={{ mr: 1.2, mb: 1.2 }}>
          <Button variant="outlined" onClick={handleAddCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleAddSave} startIcon={<SaveIcon />} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteData} onClose={handleDeleteCancel} PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {deleteData?.userName}
            </Box>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mr: 1.2, mb: 1.2 }}>
          <Button variant="outlined" onClick={handleDeleteCancel} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            startIcon={<DeleteIcon />}
            variant="contained"
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
    </Box>
  );
};

export default UserTable;
