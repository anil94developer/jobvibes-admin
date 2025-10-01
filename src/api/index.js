/**
 * API Module Index
 *
 * Central export point for all API related functionality
 */

// Export API endpoints configuration
export {
  default as API_ENDPOINTS,
  HTTP_METHODS,
  STATUS_CODES,
  API_CONFIG,
} from "./endpoints";

// Export API service utilities
export {
  default as apiService,
  authApi,
  userApi,
  jobApi,
  resumeApi,
  applicationApi,
  notificationApi,
  analyticsApi,
  settingsApi,
} from "./apiService";

/**
 * Usage examples:
 *
 * // Import specific services
 * import { authApi, userApi } from '../api';
 *
 * // Use in components
 * const handleLogin = async (email, password) => {
 *   try {
 *     const result = await authApi.login(email, password);
 *     console.log('Login successful:', result);
 *   } catch (error) {
 *     console.error('Login failed:', error.message);
 *   }
 * };
 *
 * // Get all users
 * const users = await userApi.getAll();
 *
 * // Create a new job post
 * const newJob = await jobApi.create(jobData);
 */
