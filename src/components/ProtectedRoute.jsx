import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box, Typography, Paper, Fade } from "@mui/material";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={12}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <DashboardIcon
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 3,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                  "50%": {
                    transform: "scale(1.1)",
                    opacity: 0.7,
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Loading Dashboard...
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Paper>
        </Fade>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
