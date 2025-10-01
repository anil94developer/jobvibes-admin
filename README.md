# React Admin Dashboard

A comprehensive admin dashboard built wit ├── Dashboard.jsx # Main dashboard with stats
├── Users.jsx # User management
├── Posts.jsx # Job posts management
├── Resumes.jsx # Resume/profile management
├── Matches.jsx # Job matching tracker
├── Notifications.jsx # Notification center
└── Settings.jsx # User settings Material-UI v5, and React Router v6.

## Features

- **Authentication System**: Login, Register, and Forgot Password pages
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI Components**: Built with Material-UI v5
- **Navigation**: React Router v6 with sidebar navigation
- **Dashboard Pages**:
  - Dashboard: Overview with statistics and activity
  - Users: Manage candidates & HR profiles
  - Posts: Job posts with video upload capability
  - Resumes: Candidate profiles (video + text format)
  - Matches: Track job applications and matching
  - Notifications: System alerts and updates
  - Settings: Profile, security, and preferences
  - Logout: Secure logout functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:

   ```bash
   cd dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar and header
│   └── Sidebar.jsx         # Navigation sidebar
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   └── ForgotPassword.jsx # Password reset page
│   ├── Dashboard.jsx       # Main dashboard with stats
│   ├── Users.jsx          # User management
│   ├── Posts.jsx          # Job posts management
│   ├── Resumes.jsx        # Resume/profile management
│   ├── Matches.jsx        # Job matching tracker
│   ├── Notifications.jsx  # Notification center
│   ├── Settings.jsx       # User settings
│   └── Logout.jsx         # Logout page
├── App.jsx                # Main app component with routing
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## Technology Stack

- **React 18** - UI framework
- **Material-UI v5** - Component library
- **React Router v6** - Routing
- **Vite** - Build tool
- **ESLint** - Code linting

## Navigation

The dashboard includes a permanent sidebar with the following menu items:

- **Dashboard** - Overview of portal activity
- **Users** - Manage candidates & HR profiles
- **Posts** - Upload job & resume as video
- **Resumes / Profiles** - Candidate resumes (video + text format)
- **Matches** - Track candidate applications for jobs
- **Notifications** - Alerts about new jobs, applications, or interview calls
- **Settings** - Profile, password, preferences
- **Logout** - Direct logout functionality in sidebar

## Authentication

The application includes three authentication pages:

1. **Login** (`/login`) - Email and password authentication
2. **Register** (`/register`) - New user registration with name, email, and password
3. **Forgot Password** (`/forgot-password`) - Password reset functionality

## Customization

The dashboard is built with placeholders and can be easily customized:

1. **Styling**: Modify the Material-UI theme in `App.jsx`
2. **Data**: Replace mock data with real API calls
3. **Features**: Add new pages by creating components and updating routes
4. **Authentication**: Integrate with your preferred authentication service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the linter: `npm run lint`
5. Submit a pull request

## License

This project is open source and available under the MIT License.
