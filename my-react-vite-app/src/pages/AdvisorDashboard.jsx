import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AtRiskStudentList from '../components/advisor/AtRiskStudentList';
import RiskTrendViewer from '../components/advisor/RiskTrendViewer';
import InterventionPlanning from '../components/advisor/InterventionPlanning';
import MeetingScheduler from '../components/advisor/MeetingScheduler';
import AdvisorNotificationsPanel from '../components/advisor/AdvisorNotificationsPanel';
import AdvisorLayout from '../components/layouts/AdvisorLayout';
import '../styles/AdvisorDashboard.css';

const AdvisorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    criticalRiskCount: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    averageGPA: 0,
    averageAttendance: 0
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all students
      const studentsResponse = await api.get('/students', {
        params: { limit: 100 }
      });

      let studentsData = [];
      if (studentsResponse.data.status === 'success' && studentsResponse.data.data) {
        studentsData = studentsResponse.data.data.students || [];
      } else if (studentsResponse.data.students) {
        studentsData = studentsResponse.data.students;
      }

      setStudents(studentsData);

      // Calculate statistics
      const criticalRisk = studentsData.filter(s =>
        s.currentRiskLevel === 'critical'
      ).length;
      const highRisk = studentsData.filter(s =>
        s.currentRiskLevel === 'high'
      ).length;
      const mediumRisk = studentsData.filter(s =>
        s.currentRiskLevel === 'medium'
      ).length;
      const lowRisk = studentsData.filter(s =>
        s.currentRiskLevel === 'low'
      ).length;

      const totalGPA = studentsData.reduce((sum, s) => sum + (s.gpa || 0), 0);
      const avgGPA = studentsData.length > 0 ? totalGPA / studentsData.length : 0;

      setStats({
        totalStudents: studentsData.length,
        criticalRiskCount: criticalRisk,
        highRiskCount: highRisk,
        mediumRiskCount: mediumRisk,
        lowRiskCount: lowRisk,
        averageGPA: avgGPA,
        averageAttendance: 85 // Mock data
      });

      // Fetch notifications
      try {
        console.log('🔔 Fetching advisor notifications');
        const notifResponse = await api.get('/notifications');
        console.log('📡 Notifications response:', notifResponse.data);

        let notifList = [];
        if (notifResponse.data.status === 'success' && notifResponse.data.data) {
          notifList = notifResponse.data.data.notifications || [];
          console.log('✅ Extracted from data.data.notifications:', notifList.length);
        } else if (Array.isArray(notifResponse.data)) {
          notifList = notifResponse.data;
          console.log('✅ Extracted from array:', notifList.length);
        } else if (notifResponse.data.notifications) {
          notifList = notifResponse.data.notifications;
          console.log('✅ Extracted from notifications:', notifList.length);
        }

        console.log('📋 Setting notifications state with', notifList.length, 'items');
        console.log('📋 First notification:', notifList[0]);
        setNotifications(notifList.slice(0, 10));
        console.log('✅ Loaded', notifList.length, 'notifications for dashboard panel');
      } catch (err) {
        console.log('⚠️ No notifications found:', err);
        console.error('❌ Full error:', err);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handlePlanIntervention = (student) => {
    setSelectedStudent(student);
    setShowInterventionModal(true);
  };

  const handleScheduleMeeting = (student) => {
    setSelectedStudent(student);
    setShowMeetingModal(true);
  };

  const handleInterventionSubmit = async (interventionData) => {
    try {
      await api.post('/interventions', {
        studentId: selectedStudent.id,
        ...interventionData
      });
      setShowInterventionModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error creating intervention:', err);
    }
  };

  const handleMeetingSubmit = async (meetingData) => {
    try {
      // Create meeting/intervention
      await api.post('/interventions', {
        studentId: selectedStudent.id,
        type: 'meeting',
        ...meetingData
      });
      setShowMeetingModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error scheduling meeting:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdvisorLayout>
      <div className="min-h-screen bg-[#1e1b4b] p-4 lg:p-8">
        {error && <ErrorMessage message={error} />}

        {/* Dynamic Header Overlay */}
        <div className="mb-10 relative">
          <div className="absolute -left-8 top-0 w-1 h-12 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]" />
          <h1 className="text-4xl font-black text-white tracking-tighter">
            System Interface: Welcome, {user?.firstName || 'Advisor'}
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-bold uppercase tracking-[0.2em] text-xs">Real-time Academic Risk Intelligence Overview</p>
        </div>

        {/* Statistics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Students" value={stats.totalStudents} color="blue" icon={<UsersIcon />} />
          <StatCard title="Critical" value={stats.criticalRiskCount} color="red" icon={<RiskIcon />} isRisk />
          <StatCard title="High" value={stats.highRiskCount} color="orange" icon={<AlertIcon />} isRisk />
          <StatCard title="Medium" value={stats.mediumRiskCount} color="yellow" icon={<WarningIcon />} isRisk />
          <StatCard title="Low" value={stats.lowRiskCount} color="green" icon={<CheckIcon />} isRisk />
          <StatCard title="Avg GPA" value={stats.averageGPA.toFixed(2)} color="purple" icon={<GPAIcon />} />
          <StatCard title="Attendance" value={`${stats.averageAttendance}%`} color="indigo" icon={<CalendarIcon />} />

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 border border-white/10 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all cursor-pointer group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">Manual Sync</div>
              <div className="text-indigo-100 font-bold text-[10px] uppercase tracking-widest opacity-70">Initialize System Procedures</div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          </div>
        </div>

        {/* Primary Data Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <GlassCard title="Entity Stream" subTitle="Prioritized Student Monitoring" action={<Link to="/advisor/students" className="px-4 py-2 bg-white/5 hover:bg-indigo-600 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all border border-white/5">View Cluster →</Link>}>
              <AtRiskStudentList
                students={students}
                onStudentSelect={handleStudentSelect}
                onPlanIntervention={handlePlanIntervention}
                onScheduleMeeting={handleScheduleMeeting}
              />
            </GlassCard>

            {selectedStudent && (
              <GlassCard
                title={`Telemetry Analysis: ${selectedStudent.user?.firstName} ${selectedStudent.user?.lastName}`}
                subTitle={`Protocol ID: ${selectedStudent.id || selectedStudent.studentId}`}
                closeAction={() => setSelectedStudent(null)}
              >
                <div className="p-4 bg-slate-950/50 rounded-[32px] border border-white/5">
                  <RiskTrendViewer student={selectedStudent} />
                </div>
              </GlassCard>
            )}
          </div>

          <div className="space-y-10">
            <GlassCard title="System Alerts" subTitle="Intelligence Feed">
              <AdvisorNotificationsPanel
                notifications={notifications.slice(0, 5)}
                onRefresh={fetchDashboardData}
                compact={true}
              />
            </GlassCard>

            <GlassCard title="Procedure Node">
              <div className="space-y-4">
                <ActionButton
                  onClick={() => setShowInterventionModal(true)}
                  disabled={!selectedStudent}
                  icon="📝"
                  label="Initialize Intervention"
                  color="purple"
                />
                <ActionButton
                  onClick={() => setShowMeetingModal(true)}
                  icon="📅"
                  label="Authorize Meeting"
                  color="green"
                />
                <Link to="/advisor/reports" className="block">
                  <ActionButton icon="📊" label="Generate Logic Report" color="blue" />
                </Link>
              </div>
            </GlassCard>

            <GlassCard title="Temporal Grid">
              <div className="text-center py-12 bg-slate-950/30 rounded-[32px] border border-white/5 backdrop-blur-sm">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-4">Zero active sessions</p>
                <button
                  onClick={() => setShowMeetingModal(true)}
                  className="px-6 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-indigo-500/20 transition-all shadow-lg"
                >
                  Book Session Node
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Modals */}
        {showInterventionModal && (
          <Modal title="Plan Intervention" onClose={() => setShowInterventionModal(false)}>
            <InterventionPlanning
              student={selectedStudent}
              onSubmit={handleInterventionSubmit}
              onCancel={() => setShowInterventionModal(false)}
            />
          </Modal>
        )}

        {showMeetingModal && (
          <Modal title="Schedule Meeting" onClose={() => setShowMeetingModal(false)}>
            <MeetingScheduler
              student={selectedStudent}
              students={students}
              onSubmit={handleMeetingSubmit}
              onCancel={() => setShowMeetingModal(false)}
            />
          </Modal>
        )}
      </div>
    </AdvisorLayout>
  );
};

// Helper Components
const StatCard = ({ title, value, color, icon, isRisk }) => {
  const borderColors = {
    blue: 'border-blue-500/50',
    red: 'border-red-500/50',
    orange: 'border-orange-500/50',
    yellow: 'border-yellow-500/50',
    green: 'border-green-500/50',
    purple: 'border-purple-500/50',
    indigo: 'border-indigo-500/50'
  };

  const iconBgs = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className={`bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-6 border ${borderColors[color] || 'border-white/10'} hover:bg-slate-800/80 hover:scale-[1.05] transition-all duration-500 shadow-2xl relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgs[color]} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
        {isRisk && <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Priority Seg</span>}
      </div>
      <div className="text-4xl font-black text-white mb-1 tabular-nums tracking-tighter">{value}</div>
      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</div>

      {/* Subtle Glow Accent */}
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-3xl opacity-20 ${iconBgs[color]}`} />
    </div>
  );
};

const GlassCard = ({ title, subTitle, children, action, closeAction }) => (
  <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
    <div className="flex justify-between items-center mb-10 relative z-10">
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h3>
        {subTitle && <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-70">{subTitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {action}
        {closeAction && (
          <button onClick={closeAction} className="text-slate-600 hover:text-white text-3xl transition-colors">×</button>
        )}
      </div>
    </div>
    <div className="relative z-10">
      {children}
    </div>

    {/* Ambient Mesh Gradient Accent */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-0 pointer-events-none" />
  </div>
);

const ActionButton = ({ icon, label, color, onClick, disabled }) => {
  const bgs = {
    purple: 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30',
    green: 'bg-green-500/20 text-green-200 hover:bg-green-500/30',
    blue: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30',
    gray: 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${disabled ? bgs.gray : bgs[color] || bgs.purple}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-bold">{label}</span>
    </button>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 100, marginLeft: '256px' }}>
    <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in fade-in zoom-in duration-300">
      <div className="p-8 border-b border-white/10 sticky top-0 bg-slate-900/95 backdrop-blur-md flex justify-between items-center z-10">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white text-4xl transition-colors">×</button>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  </div>
);

// Icons
const UsersIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const RiskIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GPAIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default AdvisorDashboard;
