import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Camera as CameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { userApi } from "../api";

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    company: "Admin Portal Inc.",
    position: "System Administrator",
    bio: "Experienced system administrator with expertise in dashboard management.",
    website: "https://example.com",
    location: "New York, NY",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    theme: "light",
    language: "english",
    timezone: "UTC-5",
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
    activeSessions: 3,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setLoading(true);
        const response = await userApi.getCurrentUser();
        if (response?.data) {
          setProfile((prev) => ({
            ...prev,
            firstName: response.data.firstName || prev.firstName,
            lastName: response.data.lastName || prev.lastName,
            email: response.data.email || prev.email,
            phone: response.data.phone || prev.phone,
          }));
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
        setSnackbar({
          open: true,
          message: "Using offline settings - some changes may not be saved",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field, value) => {
    if (value !== undefined) {
      // For select inputs
      setPreferences((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      // For switch inputs
      setPreferences((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await userApi.updateProfile(profile);
      console.log("Saving profile:", profile);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile. Changes saved locally.",
        severity: "warning",
      });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: "Password must be at least 8 characters long",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      // Simulate password change
      await userApi.changePassword(passwordData);
      console.log("Changing password");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSecurity((prev) => ({
        ...prev,
        lastPasswordChange: new Date().toISOString().split("T")[0],
      }));
      setSnackbar({
        open: true,
        message: "Password changed successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setSnackbar({
        open: true,
        message: "Failed to change password. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await userApi.updatePreferences(preferences);
      setSnackbar({
        open: true,
        message: "Preferences updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSnackbar({
        open: true,
        message: "Failed to update preferences. Changes saved locally.",
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorDialog(true);
  };

  const handleConfirm2FA = () => {
    setSecurity((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
    setTwoFactorDialog(false);
    setSnackbar({
      open: true,
      message: `Two-factor authentication ${
        security.twoFactorEnabled ? "disabled" : "enabled"
      }!`,
      severity: "success",
    });
  };

  const handleCloseDialog = () => {
    setTwoFactorDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile, password, preferences
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Preferences" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 2,
                      fontSize: "2rem",
                    }}
                  >
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: -8,
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                    size="small"
                  >
                    <CameraIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.position}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Profile Information</Typography>
                  <Box>
                    {isEditing ? (
                      <>
                        <Button
                          startIcon={<SaveIcon />}
                          onClick={handleSaveProfile}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={() => setIsEditing(false)}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={profile.company}
                      onChange={(e) =>
                        handleProfileChange("company", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={profile.position}
                      onChange={(e) =>
                        handleProfileChange("position", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Configure your account security preferences.
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Two-factor authentication:{" "}
                    <strong>
                      {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </strong>
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    onClick={handleToggle2FA}
                    color={security.twoFactorEnabled ? "error" : "primary"}
                  >
                    {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Last password change:{" "}
                    <strong>{security.lastPasswordChange}</strong>
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Active sessions: <strong>{security.activeSessions}</strong>
                  </Typography>
                  <Button variant="outlined" size="small" color="warning">
                    View Sessions
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={() =>
                          handlePreferenceChange("emailNotifications")
                        }
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.smsNotifications}
                        onChange={() =>
                          handlePreferenceChange("smsNotifications")
                        }
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.pushNotifications}
                        onChange={() =>
                          handlePreferenceChange("pushNotifications")
                        }
                      />
                    }
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.weeklyReports}
                        onChange={() => handlePreferenceChange("weeklyReports")}
                      />
                    }
                    label="Weekly Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.marketingEmails}
                        onChange={() =>
                          handlePreferenceChange("marketingEmails")
                        }
                      />
                    }
                    label="Marketing Emails"
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleSavePreferences}
                    disabled={loading}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Display Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Customize your dashboard appearance.
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={preferences.theme}
                      label="Theme"
                      onChange={(e) =>
                        handlePreferenceChange("theme", e.target.value)
                      }
                    >
                      <MenuItem value="light">Light Mode</MenuItem>
                      <MenuItem value="dark">Dark Mode</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={preferences.language}
                      label="Language"
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                    >
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="spanish">Spanish</MenuItem>
                      <MenuItem value="french">French</MenuItem>
                      <MenuItem value="german">German</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={preferences.timezone}
                      label="Timezone"
                      onChange={(e) =>
                        handlePreferenceChange("timezone", e.target.value)
                      }
                    >
                      <MenuItem value="UTC-5">UTC-5 (Eastern Time)</MenuItem>
                      <MenuItem value="UTC-6">UTC-6 (Central Time)</MenuItem>
                      <MenuItem value="UTC-7">UTC-7 (Mountain Time)</MenuItem>
                      <MenuItem value="UTC-8">UTC-8 (Pacific Time)</MenuItem>
                      <MenuItem value="UTC+0">UTC+0 (GMT)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Two-Factor Authentication Dialog */}
      <Dialog
        open={twoFactorDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {security.twoFactorEnabled ? "Disable" : "Enable"} Two-Factor
            Authentication
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {security.twoFactorEnabled
              ? "Are you sure you want to disable two-factor authentication? This will make your account less secure."
              : "Two-factor authentication adds an extra layer of security to your account. You will need to enter a code from your authenticator app when signing in."}
          </Typography>
          {!security.twoFactorEnabled && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <VpnKeyIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                After enabling, you&apos;ll receive setup instructions via
                email.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirm2FA}
            color={security.twoFactorEnabled ? "error" : "primary"}
            variant="contained"
          >
            {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default Settings;
