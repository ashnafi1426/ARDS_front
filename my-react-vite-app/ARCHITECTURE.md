# Frontend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)               │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           App.jsx (Router)                     │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │  Public Routes                          │ │ │  │
│  │  │  │  - Landing Page                         │ │ │  │
│  │  │  │  - Login / Register                     │ │ │  │
│  │  │  │  - About / Contact                      │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │  Protected Routes (ProtectedRoute)      │ │ │  │
│  │  │  │  ┌────────────────────────────────────┐ │ │ │  │
│  │  │  │  │  Student Routes                    │ │ │ │  │
│  │  │  │  │  - Dashboard                       │ │ │ │  │
│  │  │  │  │  - Profile                         │ │ │ │  │
│  │  │  │  │  - Self-Check                      │ │ │ │  │
│  │  │  │  └────────────────────────────────────┘ │ │ │  │
│  │  │  │  ┌────────────────────────────────────┐ │ │ │  │
│  │  │  │  │  Advisor Routes                    │ │ │ │  │
│  │  │  │  │  - Dashboard                       │ │ │ │  │
│  │  │  │  │  - Students                        │ │ │ │  │
│  │  │  │  │  - Interventions                   │ │ │ │  │
│  │  │  │  └────────────────────────────────────┘ │ │ │  │
│  │  │  │  ┌────────────────────────────────────┐ │ │ │  │
│  │  │  │  │  Admin Routes                      │ │ │ │  │
│  │  │  │  │  - Dashboard                       │ │ │ │  │
│  │  │  │  │  - Control Panel                   │ │ │ │  │
│  │  │  │  └────────────────────────────────────┘ │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           State Management                     │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │  useAuth Hook                           │ │ │  │
│  │  │  │  - User state                           │ │ │  │
│  │  │  │  - Authentication logic                 │ │ │  │
│  │  │  │  - Token management                     │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           API Layer                           │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │  Axios Client (api.js)                  │ │ │  │
│  │  │  │  - Request interceptors                 │ │ │  │
│  │  │  │  - Response interceptors                │ │ │  │
│  │  │  │  - Token injection                      │ │ │  │
│  │  │  │  - Error handling                       │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │  API Endpoints                          │ │ │  │
│  │  │  │  - authAPI                              │ │ │  │
│  │  │  │  - studentAPI                           │ │ │  │
│  │  │  │  - advisorAPI                           │ │ │  │
│  │  │  │  - adminAPI                             │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           UI Components                       │ │  │
│  │  │  - Pages (20+ pages)                         │ │  │
│  │  │  - Components (admin, advisor, student)      │ │  │
│  │  │  - Layouts                                   │ │  │
│  │  │  - Shared components                         │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │           Styling                             │ │  │
│  │  │  - Tailwind CSS                              │ │  │
│  │  │  - Custom CSS (Auth.css)                     │ │  │
│  │  │  - Responsive design                         │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Local Storage                             │  │
│  │  - user (JSON)                                      │  │
│  │  - token (JWT)                                      │  │
│  │  - theme                                            │  │
│  │  - language                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                       │
│                  (Node.js / Express)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           API Routes                                │  │
│  │  - /api/auth/*                                      │  │
│  │  - /api/student/*                                   │  │
│  │  - /api/advisor/*                                   │  │
│  │  - /api/admin/*                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Database                                  │  │
│  │  - Users                                            │  │
│  │  - Students                                         │  │
│  │  - Advisors                                         │  │
│  │  - Risk Assessments                                 │  │
│  │  - Interventions                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Input (Login)
    ↓
Login Component
    ↓
useAuth.login()
    ↓
API: POST /auth/login
    ↓
Backend validates credentials
    ↓
Returns: { user, token }
    ↓
Store in localStorage
    ↓
Set axios default header
    ↓
Redirect to /redirect
    ↓
RoleBasedRedirect component
    ↓
Redirect to role-specific dashboard
```

### Protected Route Flow
```
User navigates to /student/dashboard
    ↓
ProtectedRoute component checks
    ↓
Is user authenticated?
    ├─ NO → Redirect to /login
    └─ YES → Check user role
        ├─ Role matches? 
        │   ├─ YES → Render component
        │   └─ NO → Redirect to /unauthorized
        └─ Render protected component
```

### API Request Flow
```
Component calls API
    ↓
useAuth or direct API call
    ↓
Axios interceptor
    ↓
Add Authorization header with token
    ↓
Send request to backend
    ↓
Backend validates token
    ├─ Invalid/Expired?
    │   └─ Return 401
    └─ Valid?
        └─ Process request
            ↓
            Return response
    ↓
Axios response interceptor
    ↓
401 error?
    ├─ YES → Clear localStorage, redirect to /login
    └─ NO → Return response to component
    ↓
Component updates state/UI
```

## Component Hierarchy

```
App (Router)
├── Public Routes
│   ├── LandingPage
│   │   └── LandingHeader
│   ├── Login
│   │   └── LandingHeader
│   ├── Register
│   ├── ForgotPassword
│   ├── ResetPassword
│   ├── AboutPage
│   └── ContactPage
│
├── ProtectedRoute (Student)
│   ├── StudentDashboard
│   ├── StudentPortal
│   ├── StudentProfile
│   ├── StudentCalendarPage
│   ├── StudentResourcesPage
│   ├── StudentHelpPage
│   ├── SelfCheckForm
│   └── NotificationsPage
│
├── ProtectedRoute (Advisor)
│   ├── AdvisorDashboard
│   ├── AdvisorStudentsPage
│   ├── AdvisorInterventionsPage
│   ├── AdvisorReportsPage
│   ├── AdvisorProfilePage
│   ├── AdvisorHelpPage
│   └── NotificationsPage
│
└── ProtectedRoute (Admin)
    ├── AdminDashboard
    └── AdminPanel
```

## State Management

### Global State (useAuth)
```javascript
{
  user: {
    id: string,
    email: string,
    name: string,
    role: 'student' | 'advisor' | 'admin',
    ...
  },
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

### Local Storage
```javascript
{
  user: JSON.stringify(user),
  token: JWT_TOKEN,
  theme: 'light' | 'dark',
  language: 'en' | 'es' | ...
}
```

## API Endpoints Structure

```
/api/auth
├── POST /login
├── POST /register
├── POST /logout
├── POST /forgot-password
└── POST /reset-password

/api/student
├── GET /dashboard
├── GET /profile
├── PUT /profile
├── GET /risk-status
├── POST /self-assessment
├── GET /notifications
└── PUT /notifications/:id/read

/api/advisor
├── GET /dashboard
├── GET /students
├── GET /students/:id
├── POST /interventions
├── GET /interventions
├── PUT /interventions/:id
├── GET /reports
├── GET /profile
└── PUT /profile

/api/admin
├── GET /dashboard
├── GET /users
├── POST /users
├── PUT /users/:id
├── DELETE /users/:id
├── GET /system-stats
├── GET /audit-logs
└── PUT /configuration
```

## Technology Stack

```
Frontend
├── React 18.2.0
├── React Router DOM 6.20.0
├── Vite 5.0.0
├── Tailwind CSS 3.3.0
├── Axios 1.6.0
└── PostCSS 8.4.31

Build Tools
├── Vite (bundler)
├── PostCSS (CSS processing)
└── Autoprefixer (vendor prefixes)

Styling
├── Tailwind CSS (utility-first)
├── Custom CSS (Auth.css)
└── Responsive design

State Management
└── React Hooks (useState, useEffect, useContext)

HTTP Client
└── Axios with interceptors
```

## Security Considerations

1. **JWT Token Storage**
   - Stored in localStorage (accessible to XSS)
   - Consider moving to httpOnly cookies for production

2. **CORS**
   - Backend must enable CORS for frontend domain
   - Credentials included in requests

3. **Token Expiration**
   - Backend should implement token expiration
   - Frontend should handle 401 responses

4. **Protected Routes**
   - Role-based access control on frontend
   - Backend must also validate permissions

5. **Environment Variables**
   - API URL in .env file
   - Never commit sensitive data

## Performance Optimization

1. **Code Splitting**
   - Vite automatically handles code splitting
   - Route-based lazy loading ready

2. **Caching**
   - Browser caching for static assets
   - API response caching possible

3. **Bundling**
   - Vite optimizes bundle size
   - Tree-shaking removes unused code

4. **Lazy Loading**
   - Components can be lazy loaded
   - Images can be optimized

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Docker container
- Traditional web server (nginx, Apache)

---

This architecture provides a scalable, maintainable, and secure foundation for the ARDS frontend application.
