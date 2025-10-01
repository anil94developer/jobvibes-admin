# 🚀 API Integration Guide

## Overview

This dashboard includes comprehensive API integration setup for connecting to a backend service. All API endpoints and service functions are organized and ready for implementation.

## 📁 File Structure

```
src/api/
├── endpoints.js      # API endpoint configurations
├── apiService.js     # Service utilities and functions
└── index.js         # Central exports
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

For production:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

## 📊 Available API Services

### 🔐 Authentication

- `authApi.login(email, password)` - User login
- `authApi.logout()` - User logout
- `authApi.register(userData)` - User registration
- `authApi.forgotPassword(email)` - Password reset request
- `authApi.resetPassword(token, password)` - Reset password

### 👥 User Management

- `userApi.getAll()` - Get all users
- `userApi.getById(id)` - Get user by ID
- `userApi.create(userData)` - Create new user
- `userApi.update(id, userData)` - Update user
- `userApi.delete(id)` - Delete user
- `userApi.getProfile()` - Get current user profile
- `userApi.updateProfile(profileData)` - Update profile
- `userApi.uploadAvatar(file)` - Upload avatar image

### 💼 Job Management

- `jobApi.getAll()` - Get all job posts
- `jobApi.getById(id)` - Get job by ID
- `jobApi.create(jobData)` - Create job post
- `jobApi.update(id, jobData)` - Update job post
- `jobApi.delete(id)` - Delete job post
- `jobApi.publish(id)` - Publish job
- `jobApi.unpublish(id)` - Unpublish job
- `jobApi.uploadVideo(id, file)` - Upload job video
- `jobApi.search(query)` - Search jobs

### 📄 Resume Management

- `resumeApi.getAll()` - Get all resumes
- `resumeApi.getById(id)` - Get resume by ID
- `resumeApi.create(resumeData)` - Create resume
- `resumeApi.update(id, resumeData)` - Update resume
- `resumeApi.delete(id)` - Delete resume
- `resumeApi.uploadVideo(id, file)` - Upload resume video
- `resumeApi.uploadDocument(id, file)` - Upload resume document
- `resumeApi.download(id)` - Download resume
- `resumeApi.search(query)` - Search resumes

### 🎯 Application & Matches

- `applicationApi.getAll()` - Get all applications
- `applicationApi.getById(id)` - Get application by ID
- `applicationApi.create(applicationData)` - Create application
- `applicationApi.updateStatus(id, status)` - Update application status
- `applicationApi.getByJob(jobId)` - Get applications for job
- `applicationApi.getByUser(userId)` - Get user's applications
- `applicationApi.scheduleInterview(id, data)` - Schedule interview
- `applicationApi.getMatches()` - Get job matches

### 🔔 Notifications

- `notificationApi.getAll()` - Get all notifications
- `notificationApi.getUnread()` - Get unread notifications
- `notificationApi.markAsRead(id)` - Mark notification as read
- `notificationApi.markAllAsRead()` - Mark all as read
- `notificationApi.delete(id)` - Delete notification
- `notificationApi.create(data)` - Create notification

### 📈 Analytics & Dashboard

- `analyticsApi.getDashboardStats()` - Get dashboard statistics
- `analyticsApi.getUserStats()` - Get user analytics
- `analyticsApi.getJobStats()` - Get job analytics
- `analyticsApi.getApplicationStats()` - Get application analytics
- `analyticsApi.getRecentActivities()` - Get recent activities
- `analyticsApi.getSystemHealth()` - Get system health metrics

### ⚙️ Settings

- `settingsApi.getPreferences()` - Get user preferences
- `settingsApi.updatePreferences(prefs)` - Update preferences
- `settingsApi.changePassword(current, new)` - Change password
- `settingsApi.enable2FA()` - Enable two-factor authentication
- `settingsApi.disable2FA()` - Disable two-factor authentication
- `settingsApi.getSecurityLogs()` - Get security logs

## 💡 Usage Examples

### Basic API Call

```javascript
import { userApi } from "../api";

// In a React component
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userApi.getAll();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render users */}</div>;
};
```

### Authentication Integration

```javascript
import { authApi } from "../api";

const handleLogin = async (email, password) => {
  try {
    setLoading(true);
    const result = await authApi.login(email, password);

    // Store token
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("userData", JSON.stringify(result.user));

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### File Upload

```javascript
import { resumeApi } from "../api";

const handleFileUpload = async (resumeId, file) => {
  try {
    const result = await resumeApi.uploadVideo(resumeId, file);
    console.log("Upload successful:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Error Handling

```javascript
import { jobApi } from "../api";

const createJob = async (jobData) => {
  try {
    const newJob = await jobApi.create(jobData);
    setJobs((prev) => [...prev, newJob]);
    setSuccess("Job created successfully!");
  } catch (error) {
    if (error.message.includes("401")) {
      // Token expired, redirect to login
      navigate("/login");
    } else if (error.message.includes("400")) {
      setError("Invalid job data. Please check your inputs.");
    } else {
      setError("Failed to create job. Please try again.");
    }
  }
};
```

## 🔒 Authentication & Authorization

The API service automatically handles:

- **Token Management**: Automatically adds Bearer token to requests
- **Token Storage**: Retrieves tokens from localStorage
- **Error Handling**: Handles common HTTP errors (401, 403, 404, 500)
- **Request/Response Formatting**: JSON serialization/deserialization

## 🛠️ Backend Requirements

Your backend API should implement the following:

### Authentication Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Reset password

### Standard CRUD Operations

All resources should support:

- `GET /api/{resource}` - List all
- `GET /api/{resource}/{id}` - Get by ID
- `POST /api/{resource}` - Create new
- `PUT /api/{resource}/{id}` - Update existing
- `DELETE /api/{resource}/{id}` - Delete

### Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🚀 Ready for Integration

1. **Setup your backend API** with the required endpoints
2. **Update the environment variable** with your API URL
3. **Replace mock data** in components with API calls
4. **Add error handling** and loading states
5. **Test the integration** with real data

The dashboard is now fully prepared for backend integration! 🎉
