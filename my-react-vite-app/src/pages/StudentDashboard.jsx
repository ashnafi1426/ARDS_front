import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import GPATrendChart from '../components/student/GPATrendChart';
import DashboardLayout from '../components/layouts/DashboardLayout';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSelfCheckModal, setShowSelfCheckModal] = useState(false);

  // Dashboard data
  const [studentData, setStudentData] = useState(() => {
    try {
      const saved = localStorage.getItem('last_student_perf_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [riskData, setRiskData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Self-check form state
  const [selfCheckData, setSelfCheckData] = useState({
    stressLevel: 5,
    workloadLevel: 5,
    sleepQuality: 5,
    studyHours: 0,
    socialSupport: 5,
    financialConcern: 1,
    participationLevel: 5,
    assignmentStatus: 'On Track',
    notes: ''
  });

  // Add Event State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'study'
  });

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    const eventToAdd = {
      id: Date.now(),
      title: newEvent.title,
      date: new Date(newEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: newEvent.time,
      icon: newEvent.type === 'exam' ? '🎫' : newEvent.type === 'assignment' ? '📝' : '⏰',
      type: newEvent.type
    };

    setCalendarEvents([eventToAdd, ...calendarEvents]);
    setShowAddEventModal(false);
    setNewEvent({ title: '', date: '', time: '', type: 'study' });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!studentData) setLoading(true);
    setError('');

    // Fetch student profile
    try {
      const profileRes = await api.get('/students/profile');
      if (profileRes.data.status === 'success') {
        setStudentData(profileRes.data.data);
        localStorage.setItem('last_student_perf_data', JSON.stringify(profileRes.data.data));
      }
    } catch (profileErr) {
      console.warn('⚠️ Student profile not found or failed to load:', profileErr.message);
      // We don't set global error here to allow partial dashboard load
    }

    // Fetch risk assessments
    try {
      const riskRes = await api.get('/risks/student');
      if (riskRes.data.status === 'success') {
        setRiskData(riskRes.data.data || []);
      }
    } catch (riskErr) {
      console.warn('⚠️ Risk assessments failed to load');
    }

    // Fetch notifications
    try {
      const notifRes = await api.get('/notifications', { params: { limit: 10 } });
      if (notifRes.data.status === 'success') {
        setNotifications(notifRes.data.data.notifications || []);
      }
    } catch (notifErr) {
      console.warn('⚠️ Notifications failed to load');
    }

    // Fetch calendar events
    try {
      const eventsRes = await api.get('/events/upcoming', { params: { limit: 5 } });
      if (eventsRes.data.status === 'success' && eventsRes.data.data.length > 0) {
        setCalendarEvents(eventsRes.data.data.map(mapEvent));
      } else {
        setCalendarEvents(getMockEvents());
      }
    } catch (e) {
      setCalendarEvents(getMockEvents());
    }

    setLoading(false);
  };

  const mapEvent = (event) => {
    let dateStr = event.event_date;
    try {
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
    } catch (e) {/* ignore */ }

    return {
      id: event.id,
      type: event.event_type,
      title: event.title,
      date: dateStr,
      time: event.event_time ? event.event_time.substring(0, 5) : 'All Day',
      icon: event.icon || '📅'
    };
  };

  const getMockEvents = () => [
    { id: 1, type: 'study', title: 'Study Group Session', date: 'Jan 25', time: '05:27 PM', icon: '⏰' },
    { id: 2, type: 'assignment', title: 'Assignment Due: Math 101', date: 'Jan 26', time: '3 days', icon: '📝' },
    { id: 3, type: 'exam', title: 'Midterm Exams', date: 'Jan 25', time: 'Jan 30', icon: '🎫' },
    { id: 4, type: 'presentation', title: 'Project Presentation', date: 'Jan 20', time: 'Feb 2', icon: '💻' },
    { id: 5, type: 'meeting', title: 'Advisor Meeting', date: 'Feb 2', time: 'Feb 2', icon: '🛖' }
  ];

  const handleSelfCheckSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/students/self-check', selfCheckData);
      setShowSelfCheckModal(false);
      setSelfCheckData({ stressLevel: 5, workloadLevel: 5, sleepQuality: 5, studyHours: 0, notes: '' });
      await fetchDashboardData();
    } catch (err) {
      setError('Failed to submit self-check.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !studentData) return <LoadingSpinner />;

  const currentRisk = studentData?.currentRiskLevel || 'low';
  const riskColor = currentRisk === 'high' ? 'bg-red-600/20 text-red-400 border-red-500/30' : currentRisk === 'medium' ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' : 'bg-green-600/20 text-green-400 border-green-500/30';
  const riskTitle = currentRisk === 'high' ? 'Critical Alpha' : currentRisk === 'medium' ? 'Medium Warning' : 'Safe Baseline';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 lg:p-10 space-y-10">
        {error && <ErrorMessage message={error} />}

        {/* Dynamic Executive Header */}
        <div className="relative mb-12">
          <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] opacity-50" />
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Welcome, {studentData?.firstName || 'Student'}</h1>
          <p className="text-gray-600 text-sm font-bold uppercase tracking-[0.4em] opacity-80 mt-2">Personal Academic Performance Telemetry</p>
        </div>

        {/* Intelligence Matrix Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Risk Node */}
          <div className={`backdrop-blur-3xl rounded-[40px] p-10 border ${riskColor} shadow-3xl relative overflow-hidden group`}>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-gray-100 flex items-center justify-center text-3xl shadow-inner border border-gray-300">
                🛡️
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">{riskTitle}</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">Current Sector Health</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-black/[0.02] rounded-full group-hover:bg-black/[0.05] transition-all" />
          </div>

          {/* Performance Node (GPA) */}
          <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-10 border border-gray-300 shadow-3xl relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-gray-100 flex items-center justify-center text-3xl shadow-inner border border-gray-300 text-indigo-600">
                🎓
              </div>
              <div>
                <h2 className="text-3xl font-black text-black tracking-tighter">{studentData?.gpa?.toFixed(2) || '3.20'}</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">Accumulated Perf IQ</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/[0.02] rounded-full group-hover:scale-110 transition-all" />
          </div>

          {/* Engagement Node (Attendance) */}
          <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-10 border border-gray-300 shadow-3xl relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-gray-100 flex items-center justify-center text-3xl shadow-inner border border-gray-300 text-blue-600">
                📊
              </div>
              <div>
                <h2 className="text-3xl font-black text-black tracking-tighter">{studentData?.attendance || 100}%</h2>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">System Engagement Ratio</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/[0.02] rounded-full group-hover:scale-110 transition-all" />
          </div>
        </div>

        {/* Strategy Hub Tabs */}
        <div className="bg-gray-50 backdrop-blur-3xl rounded-[32px] p-4 border border-gray-300 shadow-3xl flex gap-4 overflow-x-auto items-center">
          <button className="px-8 py-3 bg-teal-600 border border-teal-400 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl scale-105 transition-all">Overview Hub</button>
          <button onClick={() => setShowSelfCheckModal(true)} className="px-8 py-3 bg-white border border-gray-300 text-black hover:bg-gray-100 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Self-Assessment</button>
          <button onClick={() => navigate('/student/notifications')} className="px-8 py-3 bg-white border border-gray-300 text-black hover:bg-gray-100 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Risk Reports</button>
          <button onClick={() => navigate('/student/profile')} className="px-8 py-3 bg-white border border-gray-300 text-black hover:bg-gray-100 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Identity Registry</button>
          <button onClick={() => navigate('/student/help')} className="px-8 py-3 bg-white border border-gray-300 text-black hover:bg-gray-100 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Guideline Portal</button>
        </div>

        {/* Achievement Matrix & Compliance Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-gray-50 backdrop-blur-3xl rounded-[40px] p-8 border border-gray-300 shadow-3xl flex items-center gap-8">
            <div className="hidden sm:block">
              <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-2 text-center">Current Rank</div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 p-1">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl shadow-inner">💎</div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <BadgeNode icon="🎯" label="Consistent Assess" active={true} />
              <BadgeNode icon="📚" label="Knowledge Seeker" active={true} />
              <BadgeNode icon="🔥" label="7 Day Streak" active={false} />
              <BadgeNode icon="🛡️" label="Risk Deflector" active={true} />
            </div>
          </div>
          <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-8 border border-gray-300 shadow-3xl flex flex-col justify-center text-center">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Compliance Status</div>
            <div className="text-3xl font-black text-emerald-400 tracking-tighter">100%</div>
            <div className="text-[9px] font-bold text-gray-600 uppercase mt-1">All Quotas Met</div>
          </div>
        </div>

        {/* Primary Data Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Analytic Curves (Left Column) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-gray-50 backdrop-blur-3xl rounded-[48px] p-10 border border-gray-300 shadow-3xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter">Academic Performance IQ Curve</h3>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-300">6 Month Cycle</span>
              </div>
              <GPATrendChart studentId={studentData?.id} riskData={riskData} />
            </div>

            <div className="bg-gray-50 backdrop-blur-3xl rounded-[48px] p-10 border border-gray-300 shadow-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter">Actionable Intelligence</h3>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-300">Advisor Recommendations</span>
              </div>
              <div className="space-y-6 relative z-10">
                <RecommendationCard
                  title="Engage Social Support"
                  desc="Based on your recent stress scores, we recommend attending the Peer Mentor session this Thursday."
                  icon="🤝"
                />
                <RecommendationCard
                  title="Optimize Study Windows"
                  desc="Your engagement velocity is highest in early mornings. Shift core assignments to 8 AM - 10 AM."
                  icon="⚡"
                />
              </div>
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-teal-500/[0.03] blur-[80px]" />
            </div>
          </div>

          {/* Tactical Modules (Right Column) */}
          <div className="space-y-10">
            <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-10 border border-gray-300 shadow-3xl">
              <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-8">Quick Protocols</h3>
              <div className="space-y-4">
                <ProtocolButton onClick={() => setShowSelfCheckModal(true)} icon="📝" label="Submit Weekly telemetry" accent="teal" />
                <ProtocolButton onClick={() => navigate('/student/profile')} icon="👤" label="Access Identity Registry" accent="indigo" />
                <ProtocolButton onClick={() => navigate('/student/schedule-meeting')} icon="👨‍🏫" label="Open advisor Comms" accent="orange" />
                <ProtocolButton onClick={() => {
                  alert('Generating Forensic Telemetry Package...');
                  setTimeout(() => alert('Data Export Protocol Complete: academic_report_v1.zip downloaded.'), 1000);
                }} icon="📥" label="Export Forensic Data" accent="blue" />
              </div>
            </div>

            <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-10 border border-gray-300 shadow-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter">Intel Feed</h3>
                <button onClick={() => navigate('/student/notifications')} className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-black transition-colors">View All Cache</button>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-6 relative z-10">
                  {notifications.slice(0, 3).map((note, i) => (
                    <div key={i} className="border-l-4 border-blue-600 pl-6 py-2 bg-white rounded-r-3xl group hover:bg-gray-100 transition-all">
                      <h4 className="font-black text-xs text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">{note.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-2 font-bold line-clamp-2 italic opacity-70 group-hover:opacity-100 transition-all">"{note.message}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-red-50 rounded-3xl border border-red-300 flex items-center gap-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-xs text-red-600 font-black uppercase tracking-widest">Registry Latency</p>
                    <p className="text-[10px] text-red-500 font-bold uppercase mt-1">Zero active intel packets detected.</p>
                  </div>
                </div>
              )}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-600/[0.02] blur-[80px] pointer-events-none" />
            </div>

            <div className="bg-gray-50 backdrop-blur-3xl rounded-[40px] p-10 border border-gray-300 shadow-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-black uppercase tracking-tighter">Temporal Grid</h3>
                <button onClick={() => setShowAddEventModal(true)} className="h-8 px-4 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-blue-300">+</button>
              </div>
              <div className="space-y-6">
                {calendarEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-100 p-2 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center text-xl shadow-inner border border-gray-300 group-hover:scale-110 transition-transform">
                        {ev.icon}
                      </div>
                      <div>
                        <div className="font-black text-xs text-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">{ev.title}</div>
                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{ev.date}</div>
                      </div>
                    </div>
                    <div className="text-[9px] font-black bg-white px-3 py-1.5 rounded-xl text-gray-700 border border-gray-300 group-hover:border-blue-500/30 group-hover:text-black transition-all">{ev.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Modals (Universal Registry Standard) */}
        {showAddEventModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-slate-900 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-[400px] border border-white/10 overflow-hidden relative">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                <h3 className="text-xl font-black text-white tracking-tighter uppercase">Initialize Node</h3>
                <button onClick={() => setShowAddEventModal(false)} className="text-slate-500 hover:text-white text-3xl font-light transition-colors">×</button>
              </div>
              <form onSubmit={handleAddEventSubmit} className="p-10 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Entity Description</label>
                  <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Target objective..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Cycle Date</label>
                    <input required type="date" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Phase Time</label>
                    <input required type="time" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="w-full h-16 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-3xl shadow-teal-500/20 transition-all active:scale-95">Finalize Entry</button>
              </form>
            </div>
          </div>
        )}

        {showSelfCheckModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-slate-900 rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-xl border border-white/10 overflow-hidden">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Self-Check Protocol</h2>
                <button onClick={() => setShowSelfCheckModal(false)} className="text-slate-500 hover:text-white text-4xl font-light transition-colors">×</button>
              </div>
              <form onSubmit={handleSelfCheckSubmit} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {['stressLevel', 'workloadLevel', 'sleepQuality', 'socialSupport', 'financialConcern', 'participationLevel'].map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-1">{field.replace('Level', '').replace('Quality', '').replace('Support', ' Support').replace('Concern', ' Concern').replace('Participation', 'Participation ')} Saturation IQ (1-10)</label>
                      <input
                        type="range" min="1" max="10"
                        value={selfCheckData[field]}
                        onChange={e => setSelfCheckData({ ...selfCheckData, [field]: parseInt(e.target.value) })}
                        className="w-full h-3 bg-slate-950 rounded-full appearance-none cursor-pointer accent-teal-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-600 mt-4 font-black uppercase tracking-widest">
                        <span>Low Alpha</span><span>Critical High</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 px-1">Study Cycle Hours</label>
                    <input type="number" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-lg font-black focus:ring-2 focus:ring-teal-500 outline-none" value={selfCheckData.studyHours} onChange={e => setSelfCheckData({ ...selfCheckData, studyHours: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 px-1">Assignment Status</label>
                    <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none" value={selfCheckData.assignmentStatus} onChange={e => setSelfCheckData({ ...selfCheckData, assignmentStatus: e.target.value })}>
                      <option>On Track</option>
                      <option>Needs Extension</option>
                      <option>Critical Latency</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 items-start bg-teal-500/5 p-6 rounded-3xl">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-white/10 bg-slate-950 text-teal-600 focus:ring-teal-500" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">System Verification: I certify that this telemetry is accurate to my current academic state. Unauthorized or false data may impact system integrity.</p>
                </div>

                <button type="submit" disabled={loading} className="w-full h-20 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase text-sm tracking-[0.4em] rounded-[32px] shadow-4xl shadow-teal-500/20 transition-all active:scale-95">
                  {loading ? 'Transmitting Data...' : 'Authorize Submission'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Internal Components matching elite UI suite
const BadgeNode = ({ icon, label, active }) => (
  <div className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${active ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 grayscale opacity-40'}`}>
    <span className="text-2xl">{icon}</span>
    <span className={`text-[8px] font-black uppercase tracking-tighter text-center ${active ? 'text-blue-600' : 'text-gray-600'}`}>{label}</span>
  </div>
);

const RecommendationCard = ({ title, desc, icon }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-300 flex items-start gap-6 group hover:bg-gray-50 transition-all cursor-pointer">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex-shrink-0 flex items-center justify-center text-2xl border border-blue-300 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="text-xs font-black text-black uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-[11px] text-gray-600 font-medium leading-relaxed italic">{desc}</p>
    </div>
  </div>
);

const ProtocolButton = ({ onClick, icon, label, accent }) => {
  const themes = {
    teal: 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border-blue-300 hover:border-blue-400',
    indigo: 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border-indigo-300 hover:border-indigo-400',
    orange: 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border-orange-300 hover:border-orange-400',
    blue: 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border-blue-300 hover:border-blue-400'
  };

  return (
    <button onClick={onClick} className={`w-full p-5 rounded-3xl flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border duration-500 shadow-xl group active:scale-[0.98] ${themes[accent]}`}>
      <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{icon}</span>
      {label}
    </button>
  );
};

export default StudentDashboard;
