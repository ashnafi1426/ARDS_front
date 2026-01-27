# Academic Risk Detection System (ARDS) - Frontend

A modern React + Vite application for detecting and managing academic risk in students. This frontend provides interfaces for students, advisors, and administrators to collaborate on early intervention and academic success.

## 🎯 Features

### For Students
- **Personal Dashboard** - View academic performance and risk status
- **Self-Assessment** - Weekly check-ins on stress, workload, and engagement
- **Risk Monitoring** - Real-time alerts about academic risk
- **Calendar Integration** - Track assignments, exams, and meetings
- **Notifications** - Receive timely alerts from advisors
- **Profile Management** - Update personal and academic information

### For Advisors
- **Student Monitoring** - Track at-risk students in real-time
- **Risk Analytics** - View trends and patterns in student performance
- **Intervention Planning** - Create and track intervention strategies
- **Meeting Scheduler** - Schedule and manage student meetings
- **Report Generation** - Generate comprehensive reports on student progress
- **Notification System** - Send targeted alerts to students

### For Administrators
- **System Dashboard** - Monitor overall system health and usage
- **User Management** - Create and manage user accounts
- **Student Management** - Manage student records and data
- **Advisor Management** - Manage advisor assignments and workload
- **Risk Configuration** - Configure risk detection algorithms
- **System Oversight** - Monitor system performance and security
- **Audit Logs** - Track all system activities

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Backend API running on `http://localhost:5000/api`
### Installation

1. **Clone the repository**
   ```bash
   cd ARDS_front/my-react-vite-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL if your backend is on a different URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── UserManagement.jsx
│   │   ├── StudentManagement.jsx
│   │   ├── AdvisorManagement.jsx
│   │   ├── RiskMonitoring.jsx
│   │   ├── SystemOversight.jsx
│   │   ├── ConfigurationManagement.jsx
│   │   ├── NotificationsManagement.jsx
│   │   ├── SecurityCompliance.jsx
│   │   └── Maintenance.jsx
│   ├── advisor/                  # Advisor-specific components
│   │   ├── AtRiskStudentList.jsx
│   │   ├── RiskTrendViewer.jsx
│   │   ├── InterventionPlanning.jsx
│   │   ├── MeetingScheduler.jsx
│   │   └── AdvisorNotificationsPanel.jsx
│   ├── student/                  # Student-specific components
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentProfile.jsx
│   │   ├── RiskStatus.jsx
│   │   ├── SelfAssessment.jsx
│   │   ├── GPATrendChart.jsx
│   │   ├── AttendanceTrendChart.jsx
│   │   ├── AssignmentTracker.jsx
│   │   └── NotificationsPanel.jsx
│   ├── layouts/                  # Layout components
│   │   ├── StudentLayout.jsx
│   │   ├── AdvisorLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── StudentProfileLayout.jsx
│   ├── ProtectedRoute.jsx        # Route protection
│   ├── LoadingSpinner.jsx        # Loading indicator
│   ├── ErrorMessage.jsx          # Error display
│   ├── Navbar.jsx                # Navigation
│   └── LandingHeader.jsx         # Landing header
├── pages/
│   ├── LandingPage.jsx           # Public landing
│   ├── Login.jsx                 # Login page
│   ├── Register.jsx              # Registration
│   ├── ForgotPassword.jsx        # Password recovery
│   ├── ResetPassword.jsx         # Password reset
│   ├── StudentDashboard.jsx      # Student main page
│   ├── AdvisorDashboard.jsx      # Advisor main page
│   ├── AdminDashboard.jsx        # Admin main page
│   ├── AdminPanel.jsx            # Admin control panel
│   ├── StudentPortal.jsx         # Student portal
│   ├── StudentProfile.jsx        # Student profile
│   ├── StudentCalendarPage.jsx   # Calendar
│   ├── StudentResourcesPage.jsx  # Resources
│   ├── StudentHelpPage.jsx       # Help
│   ├── SelfCheckForm.jsx         # Self-check
│   ├── NotificationsPage.jsx     # Notifications
│   ├── AdvisorStudentsPage.jsx   # Advisor students
│   ├── AdvisorInterventionsPage.jsx
│   ├── AdvisorReportsPage.jsx    # Reports
│   ├── AdvisorProfilePage.jsx    # Profile
│   ├── AdvisorHelpPage.jsx       # Help
│   ├── AboutPage.jsx             # About
│   ├── ContactPage.jsx           # Contact
│   └── RoleBasedRedirect.jsx     # Role redirect
├── hooks/
│   └── useAuth.js                # Authentication hook
├── config/
│   └── api.js                    # API client
├── constants/
│   └── index.js                  # App constants
├── styles/
│   ├── app.css                   # Global styles
│   └── Auth.css                  # Auth styles
├── App.jsx                       # Main app
└── main.jsx                      # Entry point
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Login** - User enters credentials
2. **Token Storage** - JWT token stored in localStorage
3. **Auto-Injection** - Token automatically added to API requests
4. **Session Persistence** - User session persists across page refreshes
5. **Auto-Logout** - User redirected to login on token expiration

### useAuth Hook

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.firstName}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

## 🛣️ Routing

### Public Routes
- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/forgot-password` - Password recoverrventions` - Interventions
- `/advisor/reports` - Reports
- `/advisor/profile` - Profile
- `/advisor/help` - Help
- `/advisor/notifications` - Notifications

### Protected Routes (Admin)
- `/admin/dashboard` - Dashboard
- `/admin/panel` - Control panel

## 🎨 Styling

The project uses **Tailwind CSS** for styling:

- Utility-first approach
- Responsive design
- Dark mode ready
- Custom components
- Smooth animations

### Global Styles
- `src/styles/app.css` - Tailwind directives
- `src/styles/Auth.css` - Authentication styles

## 🔌 API Integration

The application communicates with the backend API using axios:

```javascript
import api from '../config/api';

// GET
const data = await api.get('/endpoint');

// POST
const result = await api.post('/endpoint', payload);

// PUT
const updated = await api.put('/endpoint/id', payload);

// DELETE
await api.delete('/endpoint/id');
```

### API Features
- Automatic token injection
- Request/response interceptors
- Error handling
- 401 redirect to login
- Centralized configuration

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment
The `dist` folder contains the production build. Deploy it to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 🧪 Testing

To add tests, install testing libraries:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Then create test files with `.test.jsx` extension.

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### API Connection Issues
1. Check backend is running
2. Verify `VITE_API_URL` in `.env`
3. Check browser console for errors
4. Verify CORS is enabled on backend

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Module Not Found
```bash
# Ensure all dependencies are installed
npm install
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [FRONTEND_UPDATES.md](./FRONTEND_UPDATES.md) - Recent updates
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Axios Docs](https://axios-http.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check the browser console for errors
4. Verify backend API is running
5. Contact the development team

## 🎓 Academic Risk Detection System

This frontend is part of the Academic Risk Detection System (ARDS), designed to help educational institutions identify and support at-risk students through early intervention and data-driven insights.

---

**Last Updated:** January 2026
**Version:** 1.0.0
