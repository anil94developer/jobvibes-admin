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
  TablePagination,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Business,
  People,
  Close as CloseIcon,
  PersonAdd,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { userApi } from "../api";
import { colors, cardConfigs } from "../theme";

const Users = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalCandidates: 0, totalEmployers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...,", page, searchTerm, rowsPerPage);

        setLoading(true);
        const response = await userApi.getAll({
          search: searchTerm,
          page,
          limit: rowsPerPage,
        });
        setUsers(response?.data || []);
        setStats(response?.stats || { totalCandidates: 0, totalEmployers: 0 });
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
        setStats({ totalCandidates: 0, totalEmployers: 0 });
        showSnackbar("Failed to load users from API", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm, page, rowsPerPage]);

  // Utility functions
  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleViewUser = async (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setViewDialogOpen(true);
    } else {
      try {
        const response = await userApi.getById(userId);
        setSelectedUser(response?.data || null);
        setViewDialogOpen(true);
      } catch (error) {
        showSnackbar("Failed to load user details", "error");
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when searching
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "employer":
        return "primary";
      case "candidate":
        return "default";
      case "admin":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) =>
    status === "active" ? "success" : "error";

  // Format experience array into a string
  const formatExperience = (experience) => {
    if (!experience || experience.length === 0) return "None";
    return experience
      .map(
        (exp) =>
          `${exp.company_name} (${exp.duration || "Duration not specified"})`
      )
      .join(", ");
  };

  // Get display name (prefer `name` if available, fallback to `user_name`)
  const getDisplayName = (user) => user.name || user.user_name || "Unknown";

  // Format qualifications for display
  const formatQualifications = (qualifications) => {
    if (!qualifications || qualifications.length === 0) return "None";
    return qualifications
      .map(
        (qual) => `${qual.school_university_name} (${qual.percentage_grade}%)`
      )
      .join(", ");
  };

  // Format skills for display
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return "None";
    return skills.join(", ");
  };

  // Determine position based on role
  const getPosition = (user) => {
    if (user.role === "candidate") {
      return user.job_type && user.job_type.length > 0
        ? user.job_type.join(", ")
        : "Not specified";
    }
    return user.position || user.representative_role || "Not specified";
  };

  // Get avatar background based on role
  const getAvatarBackground = (role) => {
    switch (role) {
      case "candidate":
        return cardConfigs.user.candidate.gradient;
      case "employer":
        return cardConfigs.user.hrManager.gradient;
      case "admin":
        return (
          cardConfigs.user.admin?.gradient ||
          "linear-gradient(to right, #9c27b0, #f06292)"
        ); // Fallback gradient
      default:
        return "grey"; // Fallback for unknown roles
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
          User Management
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Manage candidates and employers
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
                    {stats.totalUsers}
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
                    {stats.totalEmployers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Employers
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
                    {stats.totalEmployers}
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
              gap: 3,
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center", flex: 2 }}
            >
              <TextField
                placeholder="Search users..."
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
              ) : users.length === 0 ? (
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
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(colors.solid.primary, 0.02),
                      },
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
                            background: getAvatarBackground(user.role),
                          }}
                          src={user.profile_image}
                        >
                          {getDisplayName(user).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {getDisplayName(user)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email || "Not provided"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role
                            ? user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)
                            : "Unknown"
                        }
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.status
                            ? user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)
                            : "Unknown"
                        }
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Not provided"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewUser(user._id)}
                        sx={{
                          color: colors.solid.cyan,
                          "&:hover": {
                            backgroundColor: alpha(colors.solid.cyan, 0.1),
                          },
                        }}
                      >
                        <ViewIcon fontSize="small" />
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
                    background: getAvatarBackground(selectedUser.role),
                  }}
                  src={selectedUser.profile_image}
                >
                  {getDisplayName(selectedUser).charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {getDisplayName(selectedUser)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {selectedUser.email || "Not provided"}
                  </Typography>
                  <Chip
                    label={
                      selectedUser.role
                        ? selectedUser.role.charAt(0).toUpperCase() +
                          selectedUser.role.slice(1)
                        : "Unknown"
                    }
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.name || "Not provided"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={
                      selectedUser.status
                        ? selectedUser.status.charAt(0).toUpperCase() +
                          selectedUser.status.slice(1)
                        : "Unknown"
                    }
                    color={getStatusColor(selectedUser.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.phone_number || "Not provided"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1">
                    {getPosition(selectedUser)}
                  </Typography>
                </Grid>
                {selectedUser.role === "candidate" && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {formatExperience(selectedUser.experience)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Skills
                      </Typography>
                      <Typography variant="body1">
                        {formatSkills(selectedUser.skills)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Qualifications
                      </Typography>
                      <Typography variant="body1">
                        {formatQualifications(selectedUser.qualifications)}
                      </Typography>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Join Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "Not provided"}
                  </Typography>
                </Grid>
                {selectedUser.role === "employer" && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.company_name || "Not provided"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
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

export default Users;
