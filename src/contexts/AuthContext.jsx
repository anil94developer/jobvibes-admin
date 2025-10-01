/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Static credentials for demo
      const VALID_EMAIL = "admin@dashboard.com";
      const VALID_PASSWORD = "password123";

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Check against static credentials
      if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
        throw new Error("Invalid email or password");
      }

      // Successful authentication
      const userData = {
        id: 1,
        email: email,
        name: "Admin User",
      };

      const token = "demo-jwt-token-" + Date.now();

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
