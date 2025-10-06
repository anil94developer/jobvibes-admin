import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
  TablePagination,
  MenuItem,
  Select,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { stateCityApi } from "../api";
import { colors, cardConfigs } from "../theme";

const StateCityManagement = () => {
  // State management
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "addState", "editState", "addCity", "editCity"
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", state: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch states and cities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stateResponse, cityResponse] = await Promise.all([
          stateCityApi.getStates({
            search: searchTerm,
            page,
            limit: rowsPerPage,
          }),
          stateCityApi.getCities({
            search: searchTerm,
            page,
            limit: rowsPerPage,
          }),
        ]);
        setStates(stateResponse?.data || []);
        setCities(cityResponse?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showSnackbar("Failed to load states and cities", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, page, rowsPerPage]);

  // Utility functions
  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setFormData({
      name: item ? item.name : "",
      state: item && type.includes("City") ? item.state?._id || item.state : "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setFormData({ name: "", state: "" });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      if (dialogType === "addState") {
        await stateCityApi.createState({ name: formData.name });
        showSnackbar("State added successfully", "success");
      } else if (dialogType === "editState") {
        await stateCityApi.updateState(selectedItem._id, {
          name: formData.name,
        });
        showSnackbar("State updated successfully", "success");
      } else if (dialogType === "addCity") {
        await stateCityApi.createCity({
          name: formData.name,
          state: formData.state,
        });
        showSnackbar("City added successfully", "success");
      } else if (dialogType === "editCity") {
        await stateCityApi.updateCity(selectedItem._id, {
          name: formData.name,
          state: formData.state,
        });
        showSnackbar("City updated successfully", "success");
      }

      // Refresh data
      const [stateResponse, cityResponse] = await Promise.all([
        stateCityApi.getStates({
          search: searchTerm,
          page,
          limit: rowsPerPage,
        }),
        stateCityApi.getCities({
          search: searchTerm,
          page,
          limit: rowsPerPage,
        }),
      ]);
      setStates(stateResponse?.data || []);
      setCities(cityResponse?.data || []);
      handleCloseDialog();
    } catch (error) {
      showSnackbar(
        `Failed to ${dialogType.includes("add") ? "add" : "update"} ${
          dialogType.includes("State") ? "state" : "city"
        }`,
        "error"
      );
    }
  };

  // Delete handlers
  const handleDeleteState = async (id) => {
    try {
      await stateCityApi.deleteState(id);
      setStates(states.filter((state) => state._id !== id));
      setCities(cities.filter((city) => city.state !== id));
      showSnackbar("State deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete state", "error");
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      await stateCityApi.deleteCity(id);
      setCities(cities.filter((city) => city._id !== id));
      showSnackbar("City deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete city", "error");
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: colors.text.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          State & City Management
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Manage states and cities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              background: cardConfigs.user.candidate.gradient,
              color: "white",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                  <AddIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {states.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total States
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              background: cardConfigs.user.hrManager.gradient,
              color: "white",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                  <AddIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {cities.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Cities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center", flex: 2 }}
            >
              <TextField
                placeholder="Search states or cities..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("addState")}
              >
                Add State
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("addCity")}
              >
                Add City
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* States and Cities Table */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(colors.solid.primary, 0.05) }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  State (for Cities)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Loading data...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : states.length === 0 && cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "No states or cities found matching your search"
                        : "No states or cities available"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                [...states, ...cities].map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(colors.solid.primary, 0.02),
                      },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.state ? "City" : "State"}
                        color={item.state ? "default" : "primary"}
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.state
                          ? states.find((s) => s._id === item.state)?.name ||
                            "Unknown"
                          : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenDialog(
                            item.state ? "editCity" : "editState",
                            item
                          )
                        }
                        sx={{
                          color: colors.solid.cyan,
                          "&:hover": {
                            backgroundColor: alpha(colors.solid.cyan, 0.1),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          item.state
                            ? handleDeleteCity(item._id)
                            : handleDeleteState(item._id)
                        }
                        sx={{
                          color: colors.solid.red,
                          "&:hover": {
                            backgroundColor: alpha(colors.solid.red, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={states.length + cities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType.includes("add")
            ? `Add ${dialogType.includes("State") ? "State" : "City"}`
            : `Edit ${dialogType.includes("State") ? "State" : "City"}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 3 }}
            />
            {dialogType.includes("City") && (
              <Select
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              >
                {states.map((state) => (
                  <MenuItem key={state._id} value={state._id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {dialogType.includes("add") ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StateCityManagement;
