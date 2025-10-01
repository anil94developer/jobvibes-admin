import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  ConnectWithoutContact as MatchesIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { colors, componentTokens } from "../theme";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 260;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Users",
    icon: <PeopleIcon />,
    path: "/users",
  },
  {
    text: "Posts",
    icon: <ArticleIcon />,
    path: "/posts",
  },
  {
    text: "Resumes",
    icon: <DescriptionIcon />,
    path: "/resumes",
  },
  {
    text: "Matches",
    icon: <MatchesIcon />,
    path: "/matches",
  },
  {
    text: "Notifications",
    icon: <NotificationsIcon />,
    path: "/notifications",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: colors.backgrounds.sidebar,
          borderRight: `1px solid ${alpha("#000", 0.08)}`,
          boxShadow: componentTokens.shadows.sidebar,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha("#000", 0.08)}` }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: "-0.5px",
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colors.text.secondary,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, pt: 2, display: "flex", flexDirection: "column" }}>
        <List sx={{ px: 2, "& .MuiListItem-root": { mb: 1 }, flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: componentTokens.borderRadius.small,
                  py: 1.25,
                  px: 1.5,
                  minHeight: 44,
                  "&.Mui-selected": {
                    backgroundColor: alpha(colors.solid.primary, 0.1),
                    color: colors.solid.primary,
                    "&:hover": {
                      backgroundColor: alpha(colors.solid.primary, 0.15),
                    },
                    "& .MuiListItemIcon-root": {
                      color: colors.solid.primary,
                    },
                  },
                  "&:hover": {
                    backgroundColor: colors.backgrounds.sidebarHover,
                  },
                  transition: componentTokens.transitions.fast,
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? colors.solid.primary
                        : colors.text.secondary,
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color:
                          location.pathname === item.path
                            ? colors.solid.primary
                            : colors.text.primary,
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <Box sx={{ px: 2, pb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: componentTokens.borderRadius.small,
                py: 1.25,
                px: 1.5,
                minHeight: 44,
                "&:hover": {
                  backgroundColor: alpha(colors.status.error, 0.1),
                  "& .MuiListItemIcon-root": {
                    color: colors.status.error,
                  },
                  "& .MuiListItemText-primary": {
                    color: colors.status.error,
                  },
                },
                transition: componentTokens.transitions.fast,
              }}
            >
              <ListItemIcon
                sx={{
                  color: colors.text.secondary,
                  minWidth: 36,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: colors.text.primary,
                    }}
                  >
                    Logout
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
