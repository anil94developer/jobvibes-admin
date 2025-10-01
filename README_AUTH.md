# Authentication System

## Demo Credentials

To test the authentication system, use these credentials:

- **Email:** admin@dashboard.com
- **Password:** password123

## Features

### Login Page

- Modern gradient background design
- Animated loading states
- Password visibility toggle
- Demo credentials display
- Responsive design
- Form validation with error messages

### Protected Routes

- Automatic redirect to login for unauthenticated users
- Beautiful loading screen with animations
- Persistent authentication using localStorage

### Logout Page

- Animated logout process
- Gradient background design
- Option to skip waiting period

### Authentication Flow

1. **On app start:** Shows login page
2. **After login:** Redirects to dashboard (or intended page)
3. **Protected routes:** Automatically redirect to login if not authenticated
4. **Session persistence:** Maintains login state across browser sessions

## Technical Implementation

- **Context API** for state management
- **localStorage** for session persistence
- **React Router** for protected routes
- **Material-UI** for modern UI components
- **Custom animations** and gradient backgrounds
