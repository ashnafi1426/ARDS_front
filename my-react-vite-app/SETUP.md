# Frontend Setup Guide

## Project Overview

This is a modern React + Vite application for the Academic Risk Detection System (ARDS). It provides a complete frontend for students, advisors, and administrators to manage academic risk detection and intervention.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:5000/api` (or configured in `.env`)

## Installation

### 1. Install Dependencies

```bash
cd ARDS_front/my-react-vite-app
npm install
```

### 2. Configure Environment

The `.env` file is already configured with default values:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Academic Risk Detection System
```

If your backend is running on a different URL, update `VITE_API_URL` accordingly.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   ├── advisor/            # Advisor-specific components
│   ├── student/            # Student-specific components
│   ├── layouts/            # Layout components
│   ├── ProtectedRoute.jsx   # Route protection wrapper
│   ├── LoadingSpinner.jsx   # Loading indicator
│   ├── ErrorMessage.jsx     # Error display
│   ├── Navbar.jsx           # Navigation bar
│   └── LandingHeader.jsx    # Landing page header
├── pages/
│   ├── LandingPage.jsx      # Public landing page
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   ├── StudentDashboard.jsx # Student main dashboard
│   ├── AdvisorDashboard.jsx # Advisor main dashboard
│   ├── AdminDashboard.jsx   # Admin main dashboard
│   └── ...                  # Other pages
├── hooks/
│   └── useAuth.js           # Authentication hook
├── config/
│   └── api.js               # API client configuration
├── constants/
│   └── index.js             # Application constants
├── styles/
│   ├── app.css              # Global styles
│   └── Auth.css             # Authentication styles
├── App.jsx                  # Main app component with routing
└── main.jsx                 # Entry point
```

## Key Features

### Authentication
- JWT-based authentication
- Automatic token management
- Session persistence via localStorage
- Secure logout functionality

### Authorization
- Role-based access control (RBAC)
- Three roles: student, advisor, admin
- Protected routes with role validation
- Automatic redirect for unauthorized access

### API Integration
- Centralized API client with axios
- Request/response interceptors
- Automatic token injection
- Error handling and logging
- Organized endpoint structure

### Styling
- Tailwind CSS for utility-first styling
- Responsive design
- Dark mode support ready
- Custom authentication styles
- Smooth transitions and animations

## Available Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset
- `/about` - About page
- `/contact` - Contact page

### Student Routes (Protected)
- `/student/dashboard` - Main dashboard
- `/student/portal` - Student portal
- `/student/profile` - Profile management
- `/student/calendar` - Academic calendar
- `/student/resources` - Learning resources
- `/student/help` - Help and support
- `/student/self-check` - Weekly self-assessment
- `/student/notifications` - Notifications

### Advisor Routes (Protected)
- `/advisor/dashboard` - Main dashboard
- `/advisor/students` - Student management
- `/advisor/interventions` - Intervention planning
- `/advisor/reports` - Report generation
- `/advisor/profile` - Profile management
- `/advisor/help` - Help and support
- `/advisor/notifications` - Notifications

### Admin Routes (Protected)
- `/admin/dashboard` - System dashboard
- `/admin/panel` - Admin control panel

## Development Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Academic Risk Detection System
```

## API Integration

The application uses axios for HTTP requests. The API client is configured in `src/config/api.js` and automatically:

1. Injects JWT tokens from localStorage
2. Handles 401 errors by redirecting to login
3. Provides a consistent interface for all API calls

### Making API Calls

```javascript
import api from '../config/api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', data);

// PUT request
const response = await api.put('/endpoint/id', data);

// DELETE request
const response = await api.delete('/endpoint/id');
```

## Authentication Flow

1. User enters credentials on login page
2. `useAuth` hook sends credentials to backend
3. Backend returns user data and JWT token
4. Token and user data stored in localStorage
5. Token automatically injected in all API requests
6. On 401 error, user redirected to login
7. On logout, token and user data cleared

## Protected Routes

Routes are protected using the `ProtectedRoute` component:

```javascript
<Route
  path="/student/dashboard"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling. All components use Tailwind utility classes for styling.

### Custom Styles

Additional custom styles can be added to:
- `src/styles/app.css` - Global styles
- `src/styles/Auth.css` - Authentication page styles
- Component-specific CSS files

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- --port 3001
```

### API Connection Issues
1. Ensure backend is running on the configured URL
2. Check `VITE_API_URL` in `.env`
3. Check browser console for error messages
4. Verify CORS is enabled on backend

### Build Issues
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf dist`
3. Check Node.js version: `node --version` (should be v16+)

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Image optimization
- CSS minification in production
- JavaScript minification in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

1. Ensure backend API is running
2. Test authentication flow
3. Verify role-based routing
4. Test protected routes with different user roles
5. Implement missing page components as needed
6. Add additional styling and customization
7. Set up CI/CD pipeline for deployment

## Support

For issues or questions:
- Check the FRONTEND_UPDATES.md file for recent changes
- Review the README.md for project overview
- Check backend API documentation
- Refer to React Router documentation: https://reactrouter.com
- Refer to Tailwind CSS documentation: https://tailwindcss.com
- Refer to Vite documentation: https://vitejs.dev

## License

MIT
