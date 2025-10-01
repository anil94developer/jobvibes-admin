import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Article,
  Notifications,
  Add,
  Visibility,
  CheckCircle,
  Schedule,
  Assignment,
  Work,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { colors, componentTokens } from "../theme";
import { userApi, jobApi, applicationApi, notificationApi } from "../api";

// Fallback data
const fallbackStats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: <People sx={{ fontSize: 32 }} />,
    change: "+12%",
    isPositive: true,
    path: "/users",
  },
  {
    title: "Job Posts",
    value: "156",
    icon: <Article sx={{ fontSize: 32 }} />,
    change: "+8%",
    isPositive: true,
    path: "/posts",
  },
  {
    title: "Active Matches",
    value: "89",
    icon: <TrendingUp sx={{ fontSize: 32 }} />,
    change: "+15%",
    isPositive: true,
    path: "/matches",
  },
  {
    title: "Notifications",
    value: "23",
    icon: <Notifications sx={{ fontSize: 32 }} />,
    change: "+5%",
    isPositive: true,
    path: "/notifications",
  },
];

const fallbackActivities = [
  {
    id: 1,
    title: "New user registration",
    time: "2 minutes ago",
    type: "user",
    status: "new",
  },
  {
    id: 2,
    title: "Job post published",
    time: "15 minutes ago",
    type: "job",
    status: "active",
  },
  {
    id: 3,
    title: "Application received",
    time: "1 hour ago",
    type: "application",
    status: "pending",
  },
  {
    id: 4,
    title: "Interview scheduled",
    time: "2 hours ago",
    type: "interview",
    status: "scheduled",
  },
  {
    id: 5,
    title: "Resume updated",
    time: "3 hours ago",
    type: "resume",
    status: "updated",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // State management
  const [stats, setStats] = useState(fallbackStats);
  const [recentActivities, setRecentActivities] = useState(fallbackActivities);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard statistics
        const [
          usersResponse,
          jobsResponse,
          applicationsResponse,
          notificationsResponse,
        ] = await Promise.allSettled([
          userApi.getAll(),
          jobApi.getAll(),
          applicationApi.getAll(),
          notificationApi.getAll(),
        ]);

        // Process stats data
        const newStats = [...fallbackStats];

        if (usersResponse.status === "fulfilled" && usersResponse.value?.data) {
          const usersData = usersResponse.value.data;
          newStats[0].value = usersData.length?.toString() || newStats[0].value;
        }

        if (jobsResponse.status === "fulfilled" && jobsResponse.value?.data) {
          const jobsData =
            jobsResponse.value.data?.results || jobsResponse.value.data;
          newStats[1].value = jobsData.length?.toString() || newStats[1].value;
        }

        if (
          applicationsResponse.status === "fulfilled" &&
          applicationsResponse.value?.data
        ) {
          const applicationsData = applicationsResponse.value.data;
          newStats[2].value =
            applicationsData.length?.toString() || newStats[2].value;
        }

        if (
          notificationsResponse.status === "fulfilled" &&
          notificationsResponse.value?.data
        ) {
          const notificationsData =
            notificationsResponse.value.data?.notifications ||
            notificationsResponse.value.data;
          newStats[3].value =
            notificationsData.length?.toString() || newStats[3].value;
        }

        setStats(newStats);

        // Fetch recent activities (combine all recent data)
        const combinedActivities = [...fallbackActivities];
        setRecentActivities(combinedActivities);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setSnackbar({
          open: true,
          message: "Using offline data - some information may not be current",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const quickActions = [
    {
      title: "Create Job Post",
      icon: <Add />,
      color: colors.solid.secondary,
      path: "/posts",
    },
    {
      title: "View Resumes",
      icon: <Visibility />,
      color: colors.solid.cyan,
      path: "/resumes",
    },
    {
      title: "Manage Settings",
      icon: <CheckCircle />,
      color: colors.solid.orange,
      path: "/settings",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: colors.text.primary,
            mb: 0.5,
          }}
        >
          Dashboard
          {loading && (
            <CircularProgress
              size={20}
              sx={{ ml: 2, color: colors.solid.primary }}
            />
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here&apos;s your overview for today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              onClick={() => handleCardClick(stat.path)}
              sx={{
                p: 3,
                border: `1px solid ${alpha(colors.solid.primary, 0.1)}`,
                borderRadius: 2,
                height: "100%",
                cursor: "pointer",
                "&:hover": {
                  borderColor: alpha(colors.solid.primary, 0.3),
                  boxShadow: componentTokens.shadows.card,
                  transform: "translateY(-2px)",
                },
                transition: componentTokens.transitions.fast,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: alpha(colors.solid.primary, 0.1),
                    color: colors.solid.primary,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    backgroundColor: alpha(
                      stat.isPositive
                        ? colors.status.success
                        : colors.status.error,
                      0.1
                    ),
                    color: stat.isPositive
                      ? colors.status.success
                      : colors.status.error,
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: colors.text.primary, mb: 0.5 }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${alpha(colors.solid.primary, 0.1)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Activity
              </Typography>

              <List sx={{ p: 0 }}>
                {recentActivities.slice(0, 5).map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(colors.solid.primary, 0.1),
                          color: colors.solid.primary,
                          width: 36,
                          height: 36,
                        }}
                      >
                        {activity.type === "user" ? (
                          <People fontSize="small" />
                        ) : activity.type === "job" ? (
                          <Article fontSize="small" />
                        ) : activity.type === "application" ? (
                          <Visibility fontSize="small" />
                        ) : activity.type === "resume" ? (
                          <Assignment fontSize="small" />
                        ) : activity.type === "interview" ? (
                          <Schedule fontSize="small" />
                        ) : (
                          <Work fontSize="small" />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                    <Chip
                      label={activity.status}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                        backgroundColor: alpha(
                          activity.status === "new" ||
                            activity.status === "active"
                            ? colors.status.success
                            : activity.status === "pending"
                            ? colors.status.warning
                            : colors.solid.primary,
                          0.1
                        ),
                        color:
                          activity.status === "new" ||
                          activity.status === "active"
                            ? colors.status.success
                            : activity.status === "pending"
                            ? colors.status.warning
                            : colors.solid.primary,
                        border: "none",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${alpha(colors.solid.primary, 0.1)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => handleCardClick(action.path)}
                    sx={{
                      py: 1.5,
                      justifyContent: "flex-start",
                      borderColor: alpha(colors.solid.primary, 0.2),
                      color: colors.text.primary,
                      "&:hover": {
                        backgroundColor: alpha(colors.solid.primary, 0.05),
                        borderColor: colors.solid.primary,
                      },
                    }}
                  >
                    {action.title}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default Dashboard;
