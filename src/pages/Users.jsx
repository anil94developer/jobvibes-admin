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
  Avatar,
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
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd,
  Business,
  People,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { userApi } from "../api";
import { colors, cardConfigs } from "../theme";

// Hardcoded fallback data (moved outside component to avoid dependency issues)
const fallbackUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Candidate",
    status: "Active",
    joinDate: "2024-01-15",
    phone: "+1 (555) 123-4567",
    position: "Frontend Developer",
    experience: "3 years",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "HR Manager",
    status: "Active",
    joinDate: "2024-01-10",
    phone: "+1 (555) 234-5678",
    position: "HR Manager",
    experience: "5 years",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Candidate",
    status: "Inactive",
    joinDate: "2023-12-20",
    phone: "+1 (555) 345-6789",
    position: "Backend Developer",
    experience: "4 years",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Recruiter",
    status: "Active",
    joinDate: "2024-02-01",
    phone: "+1 (555) 456-7890",
    position: "Senior Recruiter",
    experience: "6 years",
  },
];

const Users = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAll();
        const rows = response?.data || [];
        setUsers(rows.length ? rows : fallbackUsers);
      } catch (error) {
        console.log("API not available, using fallback data:", error);
        // Use fallback data when API is not available
        setUsers(fallbackUsers);
        showSnackbar("Using demo data - API not connected", "info");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Utility functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewUser = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUser(user);
        setViewDialogOpen(true);
      } else {
        // Try to fetch from API
        const response = await userApi.getById(userId);
        setSelectedUser(response?.data || null);
        setViewDialogOpen(true);
      }
    } catch (error) {
      console.log("Failed to fetch user details:", error);
      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUser(user);
        setViewDialogOpen(true);
      } else {
        showSnackbar("Failed to load user details", "error");
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "HR Manager":
        return "primary";
      case "Recruiter":
        return "secondary";
      case "Candidate":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
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
          User Management
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Manage candidates, HR managers, and recruiters
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {users.filter((u) => u.role === "Candidate").length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Candidates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {users.filter((u) => u.role === "HR Manager").length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    HR Managers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              background: cardConfigs.user.recruiter.gradient,
              color: "white",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {users.filter((u) => u.role === "Recruiter").length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Recruiters
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
              gap: 2,
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1 }}
            >
              <TextField
                placeholder="Search users..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(colors.solid.primary, 0.05) }}>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Join Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "No users found matching your search"
                        : "No users available"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(colors.solid.primary, 0.02),
                      },
                      borderBottom:
                        index === users.length - 1 ? "none" : undefined,
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2.5 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            background:
                              user.role === "Candidate"
                                ? cardConfigs.user.candidate.gradient
                                : user.role === "HR Manager"
                                ? cardConfigs.user.hrManager.gradient
                                : cardConfigs.user.recruiter.gradient,
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.joinDate}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleViewUser(user.id)}
                          sx={{
                            color: colors.solid.cyan,
                            "&:hover": {
                              backgroundColor: alpha(colors.solid.cyan, 0.1),
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* User View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">User Details</Typography>
          <IconButton onClick={() => setViewDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    fontSize: "2rem",
                    background:
                      selectedUser.role === "Candidate"
                        ? cardConfigs.user.candidate.gradient
                        : selectedUser.role === "HR Manager"
                        ? cardConfigs.user.hrManager.gradient
                        : cardConfigs.user.recruiter.gradient,
                  }}
                >
                  {selectedUser.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedUser.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {selectedUser.email}
                  </Typography>
                  <Chip
                    label={selectedUser.role}
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.phone || "Not provided"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.position || "Not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.experience || "Not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedUser.status}
                    color={getStatusColor(selectedUser.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Join Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.joinDate}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default Users;
