import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoleBasedRedirect from './pages/RoleBasedRedirect';

// Student Pages
import StudentDashboard from './pages/StudentDashboardNew';
import StudentPortal from './pages/StudentPortal';
import StudentProfile from './pages/StudentProfile';
import StudentCalendarPage from './pages/StudentCalendarPage';
import StudentResourcesPage from './pages/StudentResourcesPage';
import StudentHelpPage from './pages/StudentHelpPage';
import SelfCheckForm from './pages/SelfCheckForm';
import NotificationsPage from './pages/NotificationsPage';
import StudentCoursesPage from './pages/StudentCoursesPage';

// Admin Routes
import adminRoutes from './admin/routes/adminRoutes';
import TestPage from './admin/pages/TestPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Role-Based Redirect */}
        <Route path="/redirect" element={<RoleBasedRedirect />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/portal"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/calendar"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/resources"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/help"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/self-check"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <SelfCheckForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCoursesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        {adminRoutes}

        {/* Test Route */}
        <Route path="/admin/test" element={<TestPage />} />

        {/* Catch-all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
