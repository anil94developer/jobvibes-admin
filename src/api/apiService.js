/**
 * API Service Utility
 *
 * This file provides utility functions for making API calls
 * to the backend services.
 */

import {
  API_ENDPOINTS,
  HTTP_METHODS,
  API_CONFIG,
  STATUS_CODES,
} from "./endpoints";

/**
 * Base API client with common functionality
 */
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS.AUTH.LOGIN.replace("/auth/login", "");
    this.defaultHeaders = {
      ...API_CONFIG.headers,
    };
  }

  /**
   * Get authorization token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  /**
   * Set authorization header
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return token
      ? { ...this.defaultHeaders, Authorization: `Bearer ${token}` }
      : this.defaultHeaders;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    // Handle empty responses (204 No Content)
    if (response.status === STATUS_CODES.NO_CONTENT) {
      return null;
    }

    return response.json();
  }

  /**
   * Make API request
   */
  async request(url, options = {}) {
    const config = {
      method: HTTP_METHODS.GET,
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.GET });
  }

  /**
   * POST request
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.DELETE });
  }

  /**
   * Upload file
   */
  async uploadFile(url, file, options = {}) {
    const formData = new FormData();
    formData.append("file", file);

    const headers = { ...this.getAuthHeaders() };
    delete headers["Content-Type"]; // Let browser set multipart/form-data

    return this.request(url, {
      ...options,
      method: HTTP_METHODS.POST,
      headers,
      body: formData,
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

/**
 * Specific API service functions
 */

// Authentication services
export const authApi = {
  login: (email, password) =>
    apiService.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }),

  logout: () => apiService.post(API_ENDPOINTS.AUTH.LOGOUT),

  register: (userData) =>
    apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData),

  forgotPassword: (email) =>
    apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token, password) =>
    apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
};

// User services (View Only)
export const userApi = {
  getAll: () => apiService.get(API_ENDPOINTS.USERS.GET_ALL),

  getById: (id) => apiService.get(API_ENDPOINTS.USERS.GET_BY_ID(id)),

  getProfile: () => apiService.get(API_ENDPOINTS.USERS.GET_PROFILE),

  updateProfile: (profileData) =>
    apiService.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData),

  uploadAvatar: (file) =>
    apiService.uploadFile(API_ENDPOINTS.USERS.UPLOAD_AVATAR, file),
};

// Job services
export const jobApi = {
  getAll: () => apiService.get(API_ENDPOINTS.JOBS.GET_ALL),

  getById: (id) => apiService.get(API_ENDPOINTS.JOBS.GET_BY_ID(id)),

  create: (jobData) => apiService.post(API_ENDPOINTS.JOBS.CREATE, jobData),

  update: (id, jobData) =>
    apiService.put(API_ENDPOINTS.JOBS.UPDATE(id), jobData),

  delete: (id) => apiService.delete(API_ENDPOINTS.JOBS.DELETE(id)),

  publish: (id) => apiService.post(API_ENDPOINTS.JOBS.PUBLISH(id)),

  unpublish: (id) => apiService.post(API_ENDPOINTS.JOBS.UNPUBLISH(id)),

  uploadVideo: (id, file) =>
    apiService.uploadFile(API_ENDPOINTS.JOBS.UPLOAD_VIDEO(id), file),

  search: (query) =>
    apiService.get(
      `${API_ENDPOINTS.JOBS.SEARCH}?q=${encodeURIComponent(query)}`
    ),
};

// Resume services
export const resumeApi = {
  getAll: () => apiService.get(API_ENDPOINTS.RESUMES.GET_ALL),

  getById: (id) => apiService.get(API_ENDPOINTS.RESUMES.GET_BY_ID(id)),

  create: (resumeData) =>
    apiService.post(API_ENDPOINTS.RESUMES.CREATE, resumeData),

  update: (id, resumeData) =>
    apiService.put(API_ENDPOINTS.RESUMES.UPDATE(id), resumeData),

  delete: (id) => apiService.delete(API_ENDPOINTS.RESUMES.DELETE(id)),

  uploadVideo: (id, file) =>
    apiService.uploadFile(API_ENDPOINTS.RESUMES.UPLOAD_VIDEO(id), file),

  uploadDocument: (id, file) =>
    apiService.uploadFile(API_ENDPOINTS.RESUMES.UPLOAD_DOCUMENT(id), file),

  download: (id) => apiService.get(API_ENDPOINTS.RESUMES.DOWNLOAD(id)),

  search: (query) =>
    apiService.get(
      `${API_ENDPOINTS.RESUMES.SEARCH}?q=${encodeURIComponent(query)}`
    ),
};

// Application services
export const applicationApi = {
  getAll: () => apiService.get(API_ENDPOINTS.APPLICATIONS.GET_ALL),

  getById: (id) => apiService.get(API_ENDPOINTS.APPLICATIONS.GET_BY_ID(id)),

  create: (applicationData) =>
    apiService.post(API_ENDPOINTS.APPLICATIONS.CREATE, applicationData),

  updateStatus: (id, status) =>
    apiService.patch(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), { status }),

  getByJob: (jobId) =>
    apiService.get(API_ENDPOINTS.APPLICATIONS.GET_BY_JOB(jobId)),

  getByUser: (userId) =>
    apiService.get(API_ENDPOINTS.APPLICATIONS.GET_BY_USER(userId)),

  scheduleInterview: (id, interviewData) =>
    apiService.post(
      API_ENDPOINTS.APPLICATIONS.SCHEDULE_INTERVIEW(id),
      interviewData
    ),

  getMatches: () => apiService.get(API_ENDPOINTS.APPLICATIONS.GET_MATCHES),
};

// Notification services
export const notificationApi = {
  getAll: () => apiService.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL),

  getUnread: () => apiService.get(API_ENDPOINTS.NOTIFICATIONS.GET_UNREAD),

  markAsRead: (id) =>
    apiService.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id)),

  markAllAsRead: () =>
    apiService.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ),

  delete: (id) => apiService.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id)),

  create: (notificationData) =>
    apiService.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData),
};

// Analytics services
export const analyticsApi = {
  getDashboardStats: () =>
    apiService.get(API_ENDPOINTS.ANALYTICS.GET_DASHBOARD_STATS),

  getUserStats: () => apiService.get(API_ENDPOINTS.ANALYTICS.GET_USER_STATS),

  getJobStats: () => apiService.get(API_ENDPOINTS.ANALYTICS.GET_JOB_STATS),

  getApplicationStats: () =>
    apiService.get(API_ENDPOINTS.ANALYTICS.GET_APPLICATION_STATS),

  getRecentActivities: () =>
    apiService.get(API_ENDPOINTS.ANALYTICS.GET_RECENT_ACTIVITIES),

  getSystemHealth: () =>
    apiService.get(API_ENDPOINTS.ANALYTICS.GET_SYSTEM_HEALTH),
};

// Settings services
export const settingsApi = {
  getPreferences: () =>
    apiService.get(API_ENDPOINTS.SETTINGS.GET_USER_PREFERENCES),

  updatePreferences: (preferences) =>
    apiService.put(API_ENDPOINTS.SETTINGS.UPDATE_USER_PREFERENCES, preferences),

  changePassword: (currentPassword, newPassword) =>
    apiService.post(API_ENDPOINTS.SETTINGS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    }),

  enable2FA: () => apiService.post(API_ENDPOINTS.SETTINGS.ENABLE_2FA),

  disable2FA: () => apiService.post(API_ENDPOINTS.SETTINGS.DISABLE_2FA),

  getSecurityLogs: () =>
    apiService.get(API_ENDPOINTS.SETTINGS.GET_SECURITY_LOGS),
};

export default apiService;
