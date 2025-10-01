import { Outlet } from "react-router-dom";
import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  alpha,
} from "@mui/material";
import { Settings, Logout, Person } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme";
import Sidebar from "./Sidebar";

const drawerWidth = 260;

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleClose();
    navigate(`/${action}`);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: alpha("#000", 0.08),
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                background: colors.text.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {user?.name || "Admin User"}
            </Typography>
          </Box>

          {/* User Menu */}
          <IconButton
            size="large"
            edge="end"
            onClick={handleClick}
            sx={{
              color: "text.primary",
              "&:hover": {
                backgroundColor: alpha("#1976d2", 0.1),
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: colors.gradients.primary,
              }}
            >
              {user?.name?.[0] || "A"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 8,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                mt: 1.5,
                borderRadius: 2,
                minWidth: 200,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => handleMenuAction("settings")}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("settings")}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 },
          minHeight: "100vh",
        }}
      >
        <Toolbar sx={{ mb: 2 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
