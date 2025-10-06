import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
} from "@mui/material";
import { People, Article, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { colors, componentTokens } from "../theme";
import { adminApi } from "../api"; // ✅ uses adminApi

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch Dashboard Stats
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const response = await adminApi.getDashboardStats();

        // ✅ Match your actual API response shape
        if (response?.data) {
          const { users, jobs, matches } = response.data;

          const newStats = [
            {
              title: "Total Users",
              value: users?.toString() || "0",
              icon: <People sx={{ fontSize: 32 }} />,

              isPositive: true,
              path: "/users",
            },
            {
              title: "Job Posts",
              value: jobs?.toString() || "0",
              icon: <Article sx={{ fontSize: 32 }} />,

              isPositive: true,
              path: "/posts",
            },
            {
              title: "Matches",
              value: matches?.toString() || "0",
              icon: <Assignment sx={{ fontSize: 32 }} />,

              isPositive: true,
              path: "/matches",
            },
          ];

          setStats(newStats);
        } else {
          throw new Error("Invalid dashboard response format");
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        setSnackbar({
          open: true,
          message: "Using offline data — some information may not be current.",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCardClick = (path) => navigate(path);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
          Welcome back! Here’s your overview for today.
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

      {/* Snackbar */}
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
