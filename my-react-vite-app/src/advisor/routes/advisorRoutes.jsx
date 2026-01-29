import { Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdvisorLayout from '../components/layout/AdvisorLayout';
import AdvisorDashboard from '../pages/AdvisorDashboard';
import StudentsPage from '../pages/StudentsPage';
import StudentDetailsPage from '../pages/StudentDetailsPage';

const advisorRoutes = (
  <>
    {/* Advisor Dashboard */}
    <Route
      path="/advisor/dashboard"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <AdvisorDashboard />
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Students Management */}
    <Route
      path="/advisor/students"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <StudentsPage />
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Student Details */}
    <Route
      path="/advisor/students/:id"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <StudentDetailsPage />
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Alerts Page */}
    <Route
      path="/advisor/alerts"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Alerts & Notifications</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Alerts functionality coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Reports Page */}
    <Route
      path="/advisor/reports"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Reports functionality coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Communication Page */}
    <Route
      path="/advisor/communication"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Communication</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Communication tools coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Compliance Page */}
    <Route
      path="/advisor/compliance"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Assessment Compliance</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Compliance tracking coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Settings Page */}
    <Route
      path="/advisor/settings"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Settings functionality coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />

    {/* Profile Page */}
    <Route
      path="/advisor/profile"
      element={
        <ProtectedRoute allowedRoles={['advisor']}>
          <AdvisorLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Profile management coming soon...</p>
              </div>
            </div>
          </AdvisorLayout>
        </ProtectedRoute>
      }
    />
  </>
);

export default advisorRoutes;