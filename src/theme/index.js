import { createTheme, alpha } from "@mui/material/styles";

// Color Palette
export const colors = {
  // Primary gradients
  gradients: {
    primary: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    primaryDark: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
    secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cyan: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    green: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    auth: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    logout: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },

  // Solid colors derived from gradients
  solid: {
    primary: "#1976d2",
    primaryLight: "#42a5f5",
    primaryDark: "#1565c0",
    secondary: "#f093fb",
    secondaryDark: "#f5576c",
    purple: "#667eea",
    purpleDark: "#764ba2",
    cyan: "#4facfe",
    cyanLight: "#00f2fe",
    orange: "#fa709a",
    orangeLight: "#fee140",
    green: "#a8edea",
    greenLight: "#fed6e3",
  },

  // Status colors
  status: {
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",
  },

  // Background variations
  backgrounds: {
    default: "#f8fafc",
    paper: "#ffffff",
    sidebar: "#ffffff",
    sidebarHover: "#f8fafc",
    header: "rgba(255, 255, 255, 0.95)",
    glass: "rgba(255, 255, 255, 0.95)",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Text colors
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    disabled: "#94a3b8",
    white: "#ffffff",
    gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
  },
};

// Component theme tokens
export const componentTokens = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },

  shadows: {
    card: "0 4px 20px rgba(0, 0, 0, 0.08)",
    hover: "0 12px 40px rgba(0, 0, 0, 0.15)",
    header: "4px 0 20px rgba(0,0,0,0.1)",
    glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
    sidebar: "0 4px 12px rgba(0, 0, 0, 0.05)",
    minimal: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  transitions: {
    fast: "all 0.2s ease-in-out",
    normal: "all 0.3s ease-in-out",
    slow: "all 0.5s ease-in-out",
  },
};

// Card configurations for different roles/types
export const cardConfigs = {
  user: {
    candidate: {
      gradient: colors.gradients.purple,
      color: colors.solid.purple,
      alpha: alpha(colors.solid.purple, 0.1),
    },
    hrManager: {
      gradient: colors.gradients.secondary,
      color: colors.solid.secondary,
      alpha: alpha(colors.solid.secondary, 0.1),
    },
    recruiter: {
      gradient: colors.gradients.cyan,
      color: colors.solid.cyan,
      alpha: alpha(colors.solid.cyan, 0.1),
    },
  },

  stats: {
    users: {
      gradient: colors.gradients.purple,
      icon: colors.solid.purple,
    },
    posts: {
      gradient: colors.gradients.secondary,
      icon: colors.solid.secondary,
    },
    matches: {
      gradient: colors.gradients.cyan,
      icon: colors.solid.cyan,
    },
    notifications: {
      gradient: colors.gradients.orange,
      icon: colors.solid.orange,
    },
  },
};

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.solid.primary,
      light: colors.solid.primaryLight,
      dark: colors.solid.primaryDark,
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.solid.secondary,
      light: "#f5b3ff",
      dark: "#c162c7",
      contrastText: "#000000",
    },
    background: {
      default: colors.backgrounds.default,
      paper: colors.backgrounds.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    info: {
      main: colors.status.info,
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: componentTokens.borderRadius.medium,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: componentTokens.borderRadius.small,
          padding: "10px 24px",
          fontSize: "0.95rem",
          fontWeight: 600,
          boxShadow: "none",
          transition: componentTokens.transitions.normal,
          "&:hover": {
            boxShadow: componentTokens.shadows.hover,
          },
        },
        contained: {
          background: colors.gradients.primary,
          "&:hover": {
            background: colors.gradients.primaryDark,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: componentTokens.borderRadius.large,
          boxShadow: componentTokens.shadows.card,
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: componentTokens.borderRadius.small,
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 0, 0, 0.25)",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 2,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: componentTokens.borderRadius.small,
          fontWeight: 600,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: componentTokens.borderRadius.medium,
        },
      },
    },
  },
});

export default theme;
