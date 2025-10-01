import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Chip,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Work as WorkIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Announcement as AnnouncementIcon,
  Delete as DeleteIcon,
  MarkAsUnread as UnreadIcon,
  Circle as CircleIcon,
  MarkEmailRead as ReadIcon,
  ClearAll as ClearAllIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { notificationApi } from "../api";

// Fallback data for notifications
const fallbackNotifications = [
  {
    id: 1,
    type: "job_application",
    title: "New Job Application",
    message: "Alice Johnson applied for Senior React Developer position",
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "interview",
    title: "Interview Reminder",
    message: "Interview with Bob Wilson scheduled for tomorrow at 2:00 PM",
    timestamp: "15 minutes ago",
    read: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "new_job",
    title: "New Job Posted",
    message: "Full Stack Developer position has been published",
    timestamp: "1 hour ago",
    read: true,
    priority: "low",
  },
  {
    id: 4,
    type: "user_registration",
    title: "New User Registration",
    message: "Carol Martinez has registered as a candidate",
    timestamp: "2 hours ago",
    read: true,
    priority: "medium",
  },
  {
    id: 5,
    type: "interview",
    title: "Interview Completed",
    message: "Interview with David Brown has been completed",
    timestamp: "3 hours ago",
    read: true,
    priority: "low",
  },
  {
    id: 6,
    type: "job_application",
    title: "Application Status Update",
    message: "Eva Davis has been shortlisted for UX Designer position",
    timestamp: "5 hours ago",
    read: false,
    priority: "high",
  },
  {
    id: 7,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM",
    timestamp: "1 day ago",
    read: true,
    priority: "medium",
  },
  {
    id: 8,
    type: "job_application",
    title: "New Application Received",
    message: "Frank Miller applied for DevOps Engineer position",
    timestamp: "3 hours ago",
    read: false,
    priority: "high",
  },
];

const Notifications = () => {
  // State management
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState(
    fallbackNotifications
  );
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Unread, 2: Read
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationApi.getAll();
        const list = response?.data?.notifications || response?.data || [];
        if (list) {
          const notificationData = list.map((notification, index) => ({
            ...fallbackNotifications[index % fallbackNotifications.length],
            id: notification.id || notification._id || index + 1,
            title:
              notification.title ||
              fallbackNotifications[index % fallbackNotifications.length].title,
            message:
              notification.message ||
              notification.body ||
              fallbackNotifications[index % fallbackNotifications.length]
                .message,
            read:
              notification.read !== undefined
                ? notification.read
                : fallbackNotifications[index % fallbackNotifications.length]
                    .read,
          }));
          setNotifications(notificationData);
          setFilteredNotifications(notificationData);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        setSnackbar({
          open: true,
          message: "Using offline data - some notifications may not be current",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Filter notifications based on tab selection
  useEffect(() => {
    let filtered = notifications;

    switch (tabValue) {
      case 1: // Unread
        filtered = notifications.filter((n) => !n.read);
        break;
      case 2: // Read
        filtered = notifications.filter((n) => n.read);
        break;
      default: // All
        filtered = notifications;
        break;
    }

    setFilteredNotifications(filtered);
  }, [notifications, tabValue]);

  const getIcon = (type) => {
    switch (type) {
      case "job_application":
        return <WorkIcon />;
      case "interview":
        return <ScheduleIcon />;
      case "new_job":
        return <AnnouncementIcon />;
      case "user_registration":
        return <PersonIcon />;
      case "system":
        return <AnnouncementIcon />;
      default:
        return <CircleIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getIconColor = (type, read) => {
    if (!read) return "primary";
    return "action";
  };

  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    setSnackbar({
      open: true,
      message: "Notification marked as read",
      severity: "success",
    });
  };

  const handleMarkAsUnread = (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: false }
        : notification
    );
    setNotifications(updatedNotifications);
    setSnackbar({
      open: true,
      message: "Notification marked as unread",
      severity: "info",
    });
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    setSnackbar({
      open: true,
      message: "Notification deleted",
      severity: "success",
    });
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    setSnackbar({
      open: true,
      message: "All notifications marked as read",
      severity: "success",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    setSnackbar({
      open: true,
      message: "All notifications cleared",
      severity: "success",
    });
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailDialogOpen(true);

    // Mark as read when viewing details
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedNotification(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Notifications
              {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Alerts about new jobs, applications, or interview calls -{" "}
              {filteredNotifications.length} notifications
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<ReadIcon />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              size="small"
            >
              Mark All Read
            </Button>
            <Button
              startIcon={<ClearAllIcon />}
              onClick={handleClearAll}
              color="error"
              disabled={notifications.length === 0}
              size="small"
            >
              Clear All
            </Button>
          </Box>
        </Box>

        {/* Tabs for filtering */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`All (${notifications.length})`} />
            <Tab
              label={
                <Badge badgeContent={unreadCount} color="primary">
                  Unread
                </Badge>
              }
            />
            <Tab
              label={`Read (${notifications.filter((n) => n.read).length})`}
            />
          </Tabs>
        </Box>
      </Box>

      <Paper>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {filteredNotifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
                sx={{ textAlign: "center" }}
              />
            </ListItem>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={notification.priority}
                        color={getPriorityColor(notification.priority)}
                        size="small"
                      />
                      {notification.read ? (
                        <IconButton
                          edge="end"
                          size="small"
                          color="primary"
                          onClick={() => handleMarkAsUnread(notification.id)}
                        >
                          <UnreadIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          size="small"
                          color="primary"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <ReadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    bgcolor: notification.read ? "transparent" : "action.hover",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <ListItemButton
                    sx={{ padding: 0, paddingRight: "200px" }}
                    onClick={() => handleViewDetails(notification)}
                  >
                    <ListItemIcon
                      sx={{
                        color: getIconColor(
                          notification.type,
                          notification.read
                        ),
                      }}
                    >
                      {getIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? "normal" : "bold",
                              color: notification.read
                                ? "text.primary"
                                : "primary.main",
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <CircleIcon
                              sx={{ fontSize: 8, color: "primary.main" }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 0.5 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {notification.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < filteredNotifications.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Box>
            ))
          )}
        </List>
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
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
            Notification Details
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box sx={{ py: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                {getIcon(selectedNotification.type)}
                <Box>
                  <Typography variant="h6">
                    {selectedNotification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedNotification.timestamp}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedNotification.message}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Chip
                  label={`Priority: ${selectedNotification.priority}`}
                  color={getPriorityColor(selectedNotification.priority)}
                  size="small"
                />
                <Chip
                  label={selectedNotification.read ? "Read" : "Unread"}
                  color={selectedNotification.read ? "success" : "primary"}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedNotification && !selectedNotification.read && (
            <Button
              onClick={() => handleMarkAsRead(selectedNotification.id)}
              startIcon={<ReadIcon />}
            >
              Mark as Read
            </Button>
          )}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
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

export default Notifications;
