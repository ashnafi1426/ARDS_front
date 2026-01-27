import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdvisorLayout from '../components/layouts/AdvisorLayout';

const AdvisorReportsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');

      const studentsRes = await api.get('/students', { params: { limit: 3000 } });
      let students = [];
      if (studentsRes.data.status === 'success' && studentsRes.data.data) {
        students = studentsRes.data.data.students || [];
      } else if (studentsRes.data.students) {
        students = studentsRes.data.students;
      }

      const totalStudents = students.length;
      const criticalRisk = students.filter(s => s.currentRiskLevel === 'critical').length;
      const highRisk = students.filter(s => s.currentRiskLevel === 'high').length;
      const mediumRisk = students.filter(s => s.currentRiskLevel === 'medium').length;
      const lowRisk = students.filter(s => s.currentRiskLevel === 'low').length;

      const gpaValues = students.map(s => s.gpa || 0);
      const avgGPA = gpaValues.reduce((a, b) => a + b, 0) / (totalStudents || 1);

      const attendanceValues = students.map(s => s.attendance || 0);
      const avgAttendance = attendanceValues.reduce((a, b) => a + b, 0) / (totalStudents || 1);

      setReportData({
        totalStudents,
        criticalRisk,
        highRisk,
        mediumRisk,
        lowRisk,
        avgGPA,
        avgAttendance,
        students
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data.');
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!reportData) return [];
    return reportData.students.filter(s => {
      const name = `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase();
      const id = (s.id || s.studentId || '').toString().toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
    });
  }, [reportData, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    if (!reportData) return;
    const headers = ['Name', 'ID', 'Program', 'GPA', 'Attendance', 'Risk Level', 'Year'];
    const rows = reportData.students.map(s => [
      `"${s.user?.firstName} ${s.user?.lastName}"`,
      s.id || s.studentId,
      `"${s.program || ''}"`,
      (s.gpa || 0).toFixed(2),
      `${s.attendance || 0}%`,
      s.currentRiskLevel || 'low',
      s.year || 1
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getRiskBadgeStyle = (level) => {
    const styles = {
      critical: 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
      low: 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
    };
    return styles[level] || styles.low;
  };

  if (loading) return <AdvisorLayout><LoadingSpinner /></AdvisorLayout>;

  return (
    <AdvisorLayout>
      <div className="min-h-screen bg-[#020617] p-4 lg:p-8 space-y-10">
        {error && <ErrorMessage message={error} />}

        {/* Intelligence Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative">
          <div className="absolute -left-10 bottom-0 w-1.5 h-16 bg-indigo-600 rounded-full shadow-[0_0_20px_#4f46e5]" />
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mr-4">Performance Audit</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em] opacity-80 mt-2">Analytical Intelligence & Baseline Telemetry</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center gap-3 border border-indigo-400/30 group active:scale-95"
          >
            <span className="group-hover:translate-y-1 transition-transform">📥</span> Export Analytics Layer
          </button>
        </div>

        {/* Global Insight Matrix */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard label="Total Cohort" value={reportData.totalStudents} color="blue" icon="👥" />
            <StatCard label="Critical Risk" value={reportData.criticalRisk} color="red" icon="🚨" />
            <StatCard label="High Priority" value={reportData.highRisk} color="orange" icon="⚠️" />
            <StatCard label="Baseline safe" value={reportData.lowRisk} color="green" icon="✅" />
            <StatCard label="Academic Mean" value={reportData.avgGPA.toFixed(2)} color="purple" icon="🎓" />
            <StatCard label="Engagement IQ" value={`${reportData.avgAttendance.toFixed(0)}%`} color="cyan" icon="🕒" />
          </div>
        )}

        {/* Primary Data Grid */}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] shadow-3xl border border-white/[0.03] overflow-hidden">
          <div className="p-10 border-b border-white/[0.03] bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-6 w-full md:w-auto relative group">
              <input
                type="text"
                placeholder="FILTER ENTITY DOMAIN (Name/ID)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              />
              <svg className="absolute right-6 top-4 w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3} /></svg>
            </div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
              Validated Entries: <span className="text-indigo-400">{filteredStudents.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/60 text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] border-b border-white/[0.03]">
                  <th className="px-10 py-6">Entity Signature</th>
                  <th className="px-6 py-6">Protocol ID</th>
                  <th className="px-6 py-6">Program track</th>
                  <th className="px-6 py-6 text-center">Perf GPA</th>
                  <th className="px-6 py-6 text-center">Engage %</th>
                  <th className="px-10 py-6 text-center">Risk status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {paginatedStudents.map((student) => (
                  <tr key={student.id || student.studentId} className="hover:bg-indigo-600/[0.03] transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black border border-indigo-500/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          {student.user?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <span className="font-black text-white uppercase tracking-tighter text-sm group-hover:text-indigo-400 transition-colors">{student.user?.firstName} {student.user?.lastName}</span>
                          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-0.5">{student.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-slate-500 font-black text-[10px] tracking-[0.2em]">{student.id || student.studentId}</td>
                    <td className="px-6 py-6 text-slate-400 text-xs font-bold uppercase tracking-wide">{student.program || 'GENERAL'}</td>
                    <td className="px-6 py-6 text-center font-black text-lg tabular-nums text-white group-hover:scale-110 transition-transform">{(student.gpa || 0).toFixed(2)}</td>
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-white font-black text-lg tabular-nums group-hover:text-cyan-400 transition-colors">{student.attendance || 0}%</span>
                        <div className="w-12 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${student.attendance || 0}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl backdrop-blur-md ${getRiskBadgeStyle(student.currentRiskLevel)}`}>
                        {student.currentRiskLevel || 'baseline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          {totalPages > 1 && (
            <div className="p-10 border-t border-white/[0.03] flex justify-between items-center bg-slate-950/60 backdrop-blur-md">
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Segment <span className="text-indigo-400">{currentPage}</span> / {totalPages} Architecture</span>
              <div className="flex gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-slate-400 disabled:opacity-20 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
                >
                  ← Analysis Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-slate-400 disabled:opacity-20 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
                >
                  Analysis Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdvisorLayout>
  );
};

const StatCard = ({ label, value, color, icon }) => {
  const themes = {
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    red: 'border-red-500/20 bg-red-500/5 text-red-400',
    orange: 'border-orange-500/20 bg-orange-500/5 text-orange-400',
    green: 'border-green-500/20 bg-green-500/5 text-green-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400'
  };

  return (
    <div className={`p-8 rounded-[32px] border ${themes[color] || themes.blue} backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-white/5 transition-all duration-500`}>
      <span className="text-3xl mb-3 opacity-80 group-hover:scale-125 transition-transform duration-700">{icon}</span>
      <p className="text-4xl font-black mb-1 text-white tracking-tighter tabular-nums">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 leading-none">{label}</p>

      {/* Dynamic Background Pulse */}
      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
    </div>
  );
};

export default AdvisorReportsPage;
