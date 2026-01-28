import { Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';

// Pages
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/UserManagement';
import StudentManagement from '../pages/StudentManagement';
import AdvisorManagement from '../pages/AdvisorManagement';
import CourseManagement from '../pages/CourseManagement';
import SemesterManagement from '../pages/SemesterManagement';
import ReportsPage from '../pages/ReportsPage';
import SystemMonitoring from '../pages/SystemMonitoring';
import NotificationsPage from '../pages/NotificationsPage';
import SettingsPage from '../pages/SettingsPage';
import SecurityPage from '../pages/SecurityPage';
import MaintenancePage from '../pages/MaintenancePage';
import TroubleshootingPage from '../pages/TroubleshootingPage';

const adminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin/dashboard"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-users"
    path="/admin/users"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-students"
    path="/admin/students"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <StudentManagement />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-advisors"
    path="/admin/advisors"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <AdvisorManagement />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-courses"
    path="/admin/courses"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <CourseManagement />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-semesters"
    path="/admin/semesters"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <SemesterManagement />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-reports"
    path="/admin/reports"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <ReportsPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-monitoring"
    path="/admin/monitoring"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <SystemMonitoring />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-notifications"
    path="/admin/notifications"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <NotificationsPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-settings"
    path="/admin/settings"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <SettingsPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-security"
    path="/admin/security"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <SecurityPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-maintenance"
    path="/admin/maintenance"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <MaintenancePage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-troubleshooting"
    path="/admin/troubleshooting"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <TroubleshootingPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
];

export default adminRoutes;
