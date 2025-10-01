/**
 * API Endpoints Configuration
 *
 * This file contains all the API endpoints that need to be implemented
 * for the dashboard application to work with a real backend.
 */

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// API endpoints object
export const API_ENDPOINTS = {
  // Authentication APIs
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  },

  // User Management APIs (View Only)
  USERS: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    GET_PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/users/avatar`,
    GET_CANDIDATES: `${API_BASE_URL}/users/candidates`,
    GET_HR_MANAGERS: `${API_BASE_URL}/users/hr-managers`,
    GET_RECRUITERS: `${API_BASE_URL}/users/recruiters`,
  },

  // Job Posts APIs
  JOBS: {
    GET_ALL: `${API_BASE_URL}/jobs`,
    GET_BY_ID: (id) => `${API_BASE_URL}/jobs/${id}`,
    CREATE: `${API_BASE_URL}/jobs`,
    UPDATE: (id) => `${API_BASE_URL}/jobs/${id}`,
    DELETE: (id) => `${API_BASE_URL}/jobs/${id}`,
    PUBLISH: (id) => `${API_BASE_URL}/jobs/${id}/publish`,
    UNPUBLISH: (id) => `${API_BASE_URL}/jobs/${id}/unpublish`,
    UPLOAD_VIDEO: (id) => `${API_BASE_URL}/jobs/${id}/video`,
    GET_ACTIVE: `${API_BASE_URL}/jobs/active`,
    GET_DRAFT: `${API_BASE_URL}/jobs/draft`,
    SEARCH: `${API_BASE_URL}/jobs/search`,
  },

  // Resumes/Profiles APIs
  RESUMES: {
    GET_ALL: `${API_BASE_URL}/resumes`,
    GET_BY_ID: (id) => `${API_BASE_URL}/resumes/${id}`,
    GET_BY_USER_ID: (userId) => `${API_BASE_URL}/resumes/user/${userId}`,
    CREATE: `${API_BASE_URL}/resumes`,
    UPDATE: (id) => `${API_BASE_URL}/resumes/${id}`,
    DELETE: (id) => `${API_BASE_URL}/resumes/${id}`,
    UPLOAD_VIDEO: (id) => `${API_BASE_URL}/resumes/${id}/video`,
    UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/resumes/${id}/document`,
    DOWNLOAD: (id) => `${API_BASE_URL}/resumes/${id}/download`,
    SEARCH: `${API_BASE_URL}/resumes/search`,
  },

  // Job Applications & Matches APIs
  APPLICATIONS: {
    GET_ALL: `${API_BASE_URL}/applications`,
    GET_BY_ID: (id) => `${API_BASE_URL}/applications/${id}`,
    CREATE: `${API_BASE_URL}/applications`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/applications/${id}/status`,
    GET_BY_JOB: (jobId) => `${API_BASE_URL}/applications/job/${jobId}`,
    GET_BY_USER: (userId) => `${API_BASE_URL}/applications/user/${userId}`,
    SCHEDULE_INTERVIEW: (id) => `${API_BASE_URL}/applications/${id}/interview`,
    GET_MATCHES: `${API_BASE_URL}/applications/matches`,
    CALCULATE_MATCH_SCORE: (applicationId) =>
      `${API_BASE_URL}/applications/${applicationId}/match-score`,
  },

  // Notifications APIs
  NOTIFICATIONS: {
    GET_ALL: `${API_BASE_URL}/notifications`,
    GET_UNREAD: `${API_BASE_URL}/notifications/unread`,
    MARK_AS_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_AS_READ: `${API_BASE_URL}/notifications/mark-all-read`,
    DELETE: (id) => `${API_BASE_URL}/notifications/${id}`,
    CREATE: `${API_BASE_URL}/notifications`,
    GET_PREFERENCES: `${API_BASE_URL}/notifications/preferences`,
    UPDATE_PREFERENCES: `${API_BASE_URL}/notifications/preferences`,
  },

  // Dashboard Analytics APIs
  ANALYTICS: {
    GET_DASHBOARD_STATS: `${API_BASE_URL}/analytics/dashboard`,
    GET_USER_STATS: `${API_BASE_URL}/analytics/users`,
    GET_JOB_STATS: `${API_BASE_URL}/analytics/jobs`,
    GET_APPLICATION_STATS: `${API_BASE_URL}/analytics/applications`,
    GET_RECENT_ACTIVITIES: `${API_BASE_URL}/analytics/activities`,
    GET_SYSTEM_HEALTH: `${API_BASE_URL}/analytics/system-health`,
  },

  // Settings APIs
  SETTINGS: {
    GET_USER_PREFERENCES: `${API_BASE_URL}/settings/preferences`,
    UPDATE_USER_PREFERENCES: `${API_BASE_URL}/settings/preferences`,
    CHANGE_PASSWORD: `${API_BASE_URL}/settings/password`,
    ENABLE_2FA: `${API_BASE_URL}/settings/2fa/enable`,
    DISABLE_2FA: `${API_BASE_URL}/settings/2fa/disable`,
    GET_SECURITY_LOGS: `${API_BASE_URL}/settings/security-logs`,
  },

  // File Upload APIs
  FILES: {
    UPLOAD_IMAGE: `${API_BASE_URL}/files/image`,
    UPLOAD_VIDEO: `${API_BASE_URL}/files/video`,
    UPLOAD_DOCUMENT: `${API_BASE_URL}/files/document`,
    DELETE_FILE: (fileId) => `${API_BASE_URL}/files/${fileId}`,
    GET_FILE_URL: (fileId) => `${API_BASE_URL}/files/${fileId}/url`,
  },

  // Communication APIs
  MESSAGES: {
    GET_CONVERSATIONS: `${API_BASE_URL}/messages/conversations`,
    GET_MESSAGES: (conversationId) =>
      `${API_BASE_URL}/messages/${conversationId}`,
    SEND_MESSAGE: `${API_BASE_URL}/messages/send`,
    MARK_AS_READ: (messageId) => `${API_BASE_URL}/messages/${messageId}/read`,
  },

  // Interview Management APIs
  INTERVIEWS: {
    GET_ALL: `${API_BASE_URL}/interviews`,
    GET_BY_ID: (id) => `${API_BASE_URL}/interviews/${id}`,
    SCHEDULE: `${API_BASE_URL}/interviews/schedule`,
    UPDATE: (id) => `${API_BASE_URL}/interviews/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/interviews/${id}/cancel`,
    COMPLETE: (id) => `${API_BASE_URL}/interviews/${id}/complete`,
    GET_BY_USER: (userId) => `${API_BASE_URL}/interviews/user/${userId}`,
  },

  // Reports APIs
  REPORTS: {
    GENERATE_USER_REPORT: `${API_BASE_URL}/reports/users`,
    GENERATE_JOB_REPORT: `${API_BASE_URL}/reports/jobs`,
    GENERATE_APPLICATION_REPORT: `${API_BASE_URL}/reports/applications`,
    EXPORT_DATA: (type) => `${API_BASE_URL}/reports/export/${type}`,
  },
};

// HTTP Methods for different operations
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// API request configuration defaults
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Example usage:
 *
 * // Login request
 * fetch(API_ENDPOINTS.AUTH.LOGIN, {
 *   method: HTTP_METHODS.POST,
 *   headers: API_CONFIG.headers,
 *   body: JSON.stringify({ email, password })
 * })
 *
 * // Get user by ID
 * fetch(API_ENDPOINTS.USERS.GET_BY_ID(123))
 *
 * // Get all jobs
 * fetch(API_ENDPOINTS.JOBS.GET_ALL)
 */

export default API_ENDPOINTS;
