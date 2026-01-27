import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';

// Import all admin components
import UserManagement from '../components/admin/UserManagement';
import StudentManagement from '../components/admin/StudentManagement';
import AdvisorManagement from '../components/admin/AdvisorManagement';
import SystemOversight from '../components/admin/SystemOversight';
import RiskMonitoring from '../components/admin/RiskMonitoring';
import ConfigurationManagement from '../components/admin/ConfigurationManagement';
import NotificationsManagement from '../components/admin/NotificationsManagement';
import SecurityCompliance from '../components/admin/SecurityCompliance';
import Maintenance from '../components/admin/Maintenance';
import Troubleshooting from '../components/admin/Troubleshooting';
import TestingDeployment from '../components/admin/TestingDeployment';
import RoleAssignmentInterface from '../components/admin/RoleAssignmentInterface';
import RiskAlgorithmConfig from '../components/admin/RiskAlgorithmConfig';
import SystemHealthMonitoring from '../components/admin/SystemHealthMonitoring';
import SystemReportsDashboard from '../components/admin/SystemReportsDashboard';
import AdminLayout from '../components/layouts/AdminLayout';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  // Search Logic for Students Table
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const applySearch = () => setSearchQuery(searchInput.trim());
  const clearSearch = () => { setSearchInput(''); setSearchQuery(''); };

  const [formData, setFormData] = useState({
    studentId: '',
    program: '',
    year: 1,
    gpa: 0,
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const studentsRes = await api.get('/students?limit=100');

      let studentsList = [];
      if (studentsRes.data.status === 'success' && studentsRes.data.data) {
        studentsList = studentsRes.data.data.students || [];
      } else if (studentsRes.data.students) {
        studentsList = studentsRes.data.students;
      } else if (Array.isArray(studentsRes.data)) {
        studentsList = studentsRes.data;
      }

      setStudents(studentsList);

      const stats = {
        totalStudents: studentsList.length,
        averageGPA: studentsList.length > 0
          ? studentsList.reduce((sum, s) => sum + (s.gpa || 0), 0) / studentsList.length
          : 0,
      };

      setReports(stats);

      try {
        const reportsRes = await api.get('/reports/comprehensive');
        if (reportsRes.data.data) {
          setReports({ ...stats, ...reportsRes.data.data });
        }
      } catch (reportError) {
        // Ignore report error
      }

    } catch (error) {
      setError('Failed to load dashboard data. ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/students', formData);
      setSuccess('Student created successfully!');
      setShowAddForm(false);
      fetchData();
      setFormData({
        studentId: '', program: '', year: 1, gpa: 0,
        email: '', password: '', firstName: '', lastName: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error adding student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchData();
    } catch (error) {
      alert('Error deleting student: ' + error.response?.data?.message);
    }
  };

  const getRiskColor = (level) => {
    const colors = { low: 'bg-green-600', medium: 'bg-orange-600', high: 'bg-red-600', critical: 'bg-purple-700' };
    return colors[level] || 'bg-gray-700';
  };

  const getTabLabel = (id) => {
    const labels = {
      overview: 'Global Overview',
      users: 'Identity Management',
      roles: 'Access Protocols',
      students: 'Institutional Registry',
      advisors: 'Advisor Cluster',
      algorithm: 'Strategic Engine',
      system: 'Systems Oversight',
      risk: 'Risk Forensics',
      reports: 'Analytical Intelligence',
      notifications: 'Relay Notifications',
      security: 'Security & Compliance',
      maintenance: 'System Maintenance',
      health: 'Performance Telemetry',
      support: 'Diagnostic Support',
      testing: 'Deployment Matrix',
      config: 'Core Configuration'
    };
    return labels[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {showAddForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Register New System Entity</h2>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required placeholder="First Name" className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2" />
            <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required placeholder="Last Name" className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2" />
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="Email Address" className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2" />
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="Access Gateway Pin" className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2" />
            <div className="md:col-span-4 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Deploy Identity</button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Population</div>
          <div className="text-4xl font-black text-white">{students.length}</div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Mean Performance</div>
          <div className="text-4xl font-black text-emerald-400">{reports?.averageGPA?.toFixed(2) || '4.00'}</div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">System Latency</div>
          <div className="text-4xl font-black text-blue-400">12ms</div>
        </div>
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-xl">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Risk Incidence</div>
          <div className="text-4xl font-black text-red-500">{students.filter(s => ['high', 'critical'].includes(s.currentRiskLevel)).length}</div>
        </div>
      </div>

      {/* Main Database View */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Institutional Registry</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              + Create Entity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-10 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</div>
              <input
                type="search"
                placeholder="Query system by name, ID, or program..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
              />
              {searchInput && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">✕</button>
              )}
            </div>
            <div className="md:col-span-2">
              <button onClick={applySearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all py-3 shadow-lg">
                Recall
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-black/40">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Student ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Full Identity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Program Core</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Risk Profile</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {students
                .filter(s => !searchQuery ||
                  (s.user?.firstName + ' ' + s.user?.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.program?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-blue-400 font-mono font-bold">{student.studentId || 'ID_ERR'}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">{student.user?.firstName} {student.user?.lastName}</div>
                      <div className="text-xs text-gray-500">{student.user?.email}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-medium">{student.program} (Yr {student.year})</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`${getRiskColor(student.currentRiskLevel)} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm`}>
                        {student.currentRiskLevel || 'STABLE'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <button onClick={() => handleDeleteStudent(student.id)} className="text-red-500 hover:text-red-400 font-black uppercase text-[10px] tracking-widest opacity-40 group-hover:opacity-100 transition-all border border-red-900/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10">Purge</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return <UserManagement setSuccess={setSuccess} setError={setError} />;
      case 'roles': return <RoleAssignmentInterface onRefresh={fetchData} />;
      case 'students': return <StudentManagement setSuccess={setSuccess} setError={setError} />;
      case 'advisors': return <AdvisorManagement setSuccess={setSuccess} setError={setError} />;
      case 'algorithm': return <RiskAlgorithmConfig onRefresh={fetchData} />;
      case 'system': return <SystemOversight setSuccess={setSuccess} setError={setError} />;
      case 'risk': return <RiskMonitoring setSuccess={setSuccess} setError={setError} />;
      case 'reports': return <SystemReportsDashboard />;
      case 'config': return <ConfigurationManagement setSuccess={setSuccess} setError={setError} />;
      case 'notifications': return <NotificationsManagement setSuccess={setSuccess} setError={setError} />;
      case 'security': return <SecurityCompliance setSuccess={setSuccess} setError={setError} />;
      case 'maintenance': return <Maintenance setSuccess={setSuccess} setError={setError} />;
      case 'health': return <SystemHealthMonitoring />;
      case 'support': return <Troubleshooting setSuccess={setSuccess} setError={setError} />;
      case 'testing': return <TestingDeployment setSuccess={setSuccess} setError={setError} />;
      default: return renderOverview();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-blue-400 font-black uppercase tracking-[0.5em] animate-pulse">Initializing Administrative Matrix...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeOverride={activeTab} onTabChange={setActiveTab}>
      <div className="p-4 lg:p-10 space-y-8 min-h-screen bg-[#0f172a]/50">
        {/* Alerts Cluster */}
        <div className="fixed bottom-10 right-10 z-50 space-y-4">
          {success && (
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase text-xs tracking-widest animate-bounce">
              Protocol: Access Granted - {success}
            </div>
          )}
          {error && (
            <div className="bg-rose-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase text-xs tracking-widest animate-pulse">
              Protocol: Access Denied - {error}
            </div>
          )}
        </div>

        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
              Sector: <span className="text-blue-500">{getTabLabel(activeTab)}</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Live Telemetry Stream: Operational</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Node</div>
              <div className="text-sm font-bold text-white uppercase">{user?.firstName} {user?.lastName}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg border border-blue-400/50">
              👤
            </div>
          </div>
        </header>

        <div key={activeTab} className="relative z-10 transition-all duration-500">
          {renderTabContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
