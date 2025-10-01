import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CardContent,
  Alert,
  Paper,
  Divider,
  Chip,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirect to the page they were trying to visit or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          transform: "rotate(45deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-30%",
          left: "-30%",
          width: "80%",
          height: "80%",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
        }}
      />

      <Container
        component="main"
        maxWidth="sm"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
          }}
        >
          <Fade in timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                width: "100%",
                maxWidth: 450,
                borderRadius: 4,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  color: "white",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <DashboardIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography component="h1" variant="h4" fontWeight="bold">
                  Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Sign in to access your dashboard
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                {/* Demo Credentials Info */}
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Use your admin email and password to sign in
                </Alert>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 4,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                        boxShadow: "0 6px 25px rgba(25, 118, 210, 0.6)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {loading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress size={20} color="inherit" />
                        Signing In...
                      </Box>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Chip label="OR" size="small" />
                  </Divider>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Link
                      to="/forgot-password"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                      >
                        Forgot your password?
                      </Typography>
                    </Link>

                    <Typography variant="body2" color="text.secondary">
                      Don&apos;t have an account?{" "}
                      <Link to="/register" style={{ textDecoration: "none" }}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary"
                          sx={{
                            fontWeight: "bold",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Sign Up
                        </Typography>
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
