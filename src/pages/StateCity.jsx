import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import { stateCityApi } from "../api";

const StateCityManagement = () => {
  const [states, setStates] = useState([]);
  const [expandedStateIds, setExpandedStateIds] = useState([]);
  const [citiesByState, setCitiesByState] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({ name: "", state: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch states on load
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const res = await stateCityApi.getStates();
        // Backend returns { status: true, data: [...] } or direct array
        const stateData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data?.results || [];
        setStates(stateData);
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to load states", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Expand/collapse logic
  const toggleExpand = async (stateId) => {
    if (expandedStateIds.includes(stateId)) {
      setExpandedStateIds((prev) => prev.filter((id) => id !== stateId));
      return;
    }

    // Expand — fetch cities if not already loaded
    if (!citiesByState[stateId]) {
      try {
        setLoading(true);
        const res = await stateCityApi.getCities(stateId);
        const cityData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.results || res?.data?.data || [];
        setCitiesByState((prev) => ({ ...prev, [stateId]: cityData }));
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to load cities", "error");
      } finally {
        setLoading(false);
      }
    }
    setExpandedStateIds((prev) => [...prev, stateId]);
  };

  // Open add/edit dialog
  const handleOpenDialog = (stateId, city = null) => {
    setEditingCity(city);
    setFormData({
      name: city ? city.name : "",
      state: stateId,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Add/Edit city
  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        showSnackbar("City name is required", "error");
        return;
      }
      if (editingCity) {
        const res = await stateCityApi.updateCity(editingCity._id, {
          name: formData.name,
        });
        // Backend returns { status: true, data: {...}, message: "..." }
        if (res?.status) {
          showSnackbar(res?.message || "City updated successfully", "success");
        } else {
          showSnackbar(res?.message || "Failed to update city", "error");
          return;
        }
      } else {
        const res = await stateCityApi.createCity(formData.state, {
          name: formData.name,
        });
        // Backend returns { status: true, data: {...}, message: "..." }
        if (res?.status) {
          showSnackbar(res?.message || "City added successfully", "success");
        } else {
          showSnackbar(res?.message || "Failed to create city", "error");
          return;
        }
      }
      handleCloseDialog();
      // Refresh city list for that state
      const res = await stateCityApi.getCities(formData.state);
      // Backend returns { status: true, data: [...] } or direct array
      const cityData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.results || res?.data?.data || [];
      setCitiesByState((prev) => ({ ...prev, [formData.state]: cityData }));
    } catch (err) {
      console.error(err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Operation failed",
        "error"
      );
    }
  };

  // Delete city confirmation
  const handleDeleteClick = (stateId, cityId, cityName) => {
    setCityToDelete({ stateId, cityId, cityName });
    setDeleteConfirmOpen(true);
  };

  // Delete city
  const handleDeleteCity = async () => {
    if (!cityToDelete) return;

    try {
      const res = await stateCityApi.deleteCity(cityToDelete.cityId);
      // Backend returns { status: true, data: {...}, message: "..." }
      if (res?.status) {
        showSnackbar(res?.message || "City deleted successfully", "success");
        setCitiesByState((prev) => ({
          ...prev,
          [cityToDelete.stateId]: prev[cityToDelete.stateId].filter(
            (c) => c._id !== cityToDelete.cityId
          ),
        }));
      } else {
        showSnackbar(res?.message || "Failed to delete city", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Failed to delete city",
        "error"
      );
    } finally {
      setDeleteConfirmOpen(false);
      setCityToDelete(null);
    }
  };

  // Filter states
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        State & City Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        View states and manage cities within them
      </Typography>

      <TextField
        label="Search States"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStates.map((state) => (
              <React.Fragment key={state._id}>
                <TableRow hover>
                  <TableCell
                    onClick={() => toggleExpand(state._id)}
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    {state.name}
                    {expandedStateIds.includes(state._id) ? (
                      <ExpandLess sx={{ ml: 1 }} />
                    ) : (
                      <ExpandMore sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleOpenDialog(state._id)}
                      size="small"
                      variant="outlined"
                    >
                      Add City
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2} sx={{ p: 0 }}>
                    <Collapse
                      in={expandedStateIds.includes(state._id)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ m: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Cities in {state.name}
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>City Name</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {citiesByState[state._id]?.map((city) => (
                              <TableRow key={city._id}>
                                <TableCell>{city.name}</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenDialog(state._id, city)
                                    }
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteClick(
                                        state._id,
                                        city._id,
                                        city.name
                                      )
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!citiesByState[state._id]?.length && (
                              <TableRow>
                                <TableCell colSpan={2} align="center">
                                  No cities found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit City Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingCity ? "Edit City" : "Add City"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="City Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCity ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the city &quot;
            {cityToDelete?.cityName}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteCity} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StateCityManagement;
