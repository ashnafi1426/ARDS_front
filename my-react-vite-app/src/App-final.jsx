import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const RoleBasedRedirect = React.lazy(() => import('./pages/RoleBasedRedirect'));

// Student Components
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboardNew'));
const StudentProfile = React.lazy(() => import('./pages/StudentProfile'));
const StudentCourses = React.lazy(() => import('./pages/StudentCoursesPage'));
const StudentCalendar = React.lazy(() => import('./pages/StudentCalendarPage'));
const StudentResources = React.lazy(() => import('./pages/StudentResourcesPage'));
const SelfCheckForm = React.lazy(() => import('./pages/SelfCheckForm'));
const Notifications = React.lazy(() => import('./pages/NotificationsPage'));

// Admin Components
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const UserManagement = React.lazy(() => import('./components/admin/UserManagement'));
const StudentManagement = React.lazy(() => import('./components/admin/StudentManagement'));
const AdvisorManagement = React.lazy(() => import('./components/admin/AdvisorManagement'));
const RiskMonitoring = React.lazy(() => import('./components/admin/RiskMonitoring'));
const SystemSettings = React.lazy(() => import('./components/admin/SystemOversight'));
const Reports = React.lazy(() => import('./components/admin/ConfigurationManagement'));

// Advisor Components
const AdvisorDashboard = React.lazy(() => import('./pages/AdvisorDashboard'));
const AdvisorCaseload = React.lazy(() => import('./pages/AdvisorStudentsPage'));
const AdvisorInterventions = React.lazy(() => import('./pages/AdvisorInterventionsPage'));
const AdvisorReports = React.lazy(() => import('./pages/AdvisorReportsPage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <Spin size="large" />
  </div>
);

// 404 Not Found Component
const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '60vh',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '72px', margin: 0, color: '#1890ff' }}>404</h1>
    <h2 style={{ fontSize: '24px', margin: '16px 0', color: '#262626' }}>Page Not Found</h2>
    <p style={{ fontSize: '16px', color: '#8c8c8c', marginBottom: '24px' }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
  </div>
);

const App = () => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('🚀 App component rendering', { isAuthenticated, loading, user });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Layout style={{ height: '100vh' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="redirect" element={<RoleBasedRedirect />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Student Routes */}
          <Route
            path="student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="calendar" element={<StudentCalendar />} />
                  <Route path="resources" element={<StudentResources />} />
                  <Route path="self-check" element={<SelfCheckForm />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="students" element={<StudentManagement />} />
                  <Route path="advisors" element={<AdvisorManagement />} />
                  <Route path="risk-monitoring" element={<RiskMonitoring />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<SystemSettings />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Advisor Routes */}
          <Route
            path="advisor/*"
            element={
              <ProtectedRoute allowedRoles={['advisor']}>
                <Routes>
                  <Route path="dashboard" element={<AdvisorDashboard />} />
                  <Route path="caseload" element={<AdvisorCaseload />} />
                  <Route path="interventions" element={<AdvisorInterventions />} />
                  <Route path="reports" element={<AdvisorReports />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Default redirect based on user role */}
          <Route
            path=""
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : user?.role === 'advisor' ? (
                  <Navigate to="/advisor/dashboard" replace />
                ) : (
                  <Navigate to="/student/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
