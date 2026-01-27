import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdvisorLayout from '../components/layouts/AdvisorLayout';

const AdvisorStudentsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('risk');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/students', {
        params: { limit: 3000 }
      });

      let studentsData = [];
      if (response.data.status === 'success' && response.data.data) {
        studentsData = response.data.data.students || [];
      } else if (response.data.students) {
        studentsData = response.data.students;
      }

      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load student roster data');
      setLoading(false);
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter(student => {
      const fullName = `${student.user?.firstName || ''} ${student.user?.lastName || ''}`.toLowerCase();
      const studentId = (student.id || student.studentId || '').toString().toLowerCase();
      const program = (student.program || '').toLowerCase();

      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
        studentId.includes(searchTerm.toLowerCase()) ||
        program.includes(searchTerm.toLowerCase());

      const matchesRisk = filterRisk === 'all' || student.currentRiskLevel === filterRisk;

      return matchesSearch && matchesRisk;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.user?.firstName} ${a.user?.lastName}`.localeCompare(`${b.user?.firstName} ${b.user?.lastName}`);
        case 'risk':
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1, not_assessed: 0 };
          return (riskOrder[b.currentRiskLevel] || 0) - (riskOrder[a.currentRiskLevel] || 0);
        case 'gpa':
          return (a.gpa || 0) - (b.gpa || 0);
        case 'attendance':
          return (a.attendance || 0) - (b.attendance || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [students, searchTerm, filterRisk, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getRiskColor = (level) => {
    const colors = {
      critical: 'from-rose-500 to-rose-600 border-rose-500/30 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
      high: 'from-orange-500 to-orange-600 border-orange-500/30 text-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
      medium: 'from-amber-400 to-amber-500 border-amber-500/30 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      low: 'from-emerald-500 to-emerald-600 border-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      not_assessed: 'from-slate-500 to-slate-600 border-slate-500/30 text-slate-100 transition-all'
    };
    return colors[level] || colors.not_assessed;
  };

  if (loading) return <AdvisorLayout><div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div></AdvisorLayout>;

  return (
    <AdvisorLayout>
      <div className="p-8 space-y-10 animate-in fade-in duration-1000">

        {/* Superior Data Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2} /></svg>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter">Student Portfolio</h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                <span className="text-indigo-400">Validated Entity Domain</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{filteredAndSortedStudents.length} Records Loaded</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Strategy Plane (Search & Filter) */}
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[40px] p-8 border border-white/5 shadow-3xl flex flex-col xl:flex-row gap-8 items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Case Identification (Name, System ID, or Protocol)..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-5 pl-14 text-white text-sm placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
            />
            <svg className="absolute left-6 top-5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2.5} /></svg>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {['all', 'critical', 'high', 'medium', 'low'].map((risk) => (
              <button
                key={risk}
                onClick={() => { setFilterRisk(risk); setCurrentPage(1); }}
                className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterRisk === risk
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {risk}
              </button>
            ))}
          </div>

          <div className="w-full xl:w-64">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-white text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-white/10 transition-all"
            >
              <option value="risk">Sort: Risk Gradient</option>
              <option value="name">Sort: Alphabetical ID</option>
              <option value="gpa">Sort: Performance IQ</option>
              <option value="attendance">Sort: Engagement Metric</option>
            </select>
          </div>
        </div>

        {/* Entity Response Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 xl:grid-cols-3 gap-8">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => {
              const riskStyle = getRiskColor(student.currentRiskLevel);

              return (
                <div
                  key={student.id || student.studentId}
                  onClick={() => navigate(`/advisor/student/${student.id}`)}
                  className="bg-[#0f172a] hover:bg-slate-900 border border-white/[0.04] hover:border-indigo-500/30 rounded-[48px] p-8 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:scale-[1.03]"
                >
                  {/* Performance Indicator */}
                  <div className={`absolute top-0 right-0 px-6 py-2 bg-gradient-to-l ${riskStyle} rounded-bl-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg`}>
                    {student.currentRiskLevel || 'AWAITING ASSESSMENT'}
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${riskStyle} flex items-center justify-center text-white font-black text-2xl shadow-xl transform group-hover:rotate-6 transition-transform`}>
                      {student.user?.firstName?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-white font-black text-xl leading-tight truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">
                        {student.user?.firstName} {student.user?.lastName}
                      </h3>
                      <p className="text-indigo-400/40 text-[10px] font-black uppercase tracking-widest mt-1">
                        UUID: {(student.id || student.studentId).toString().slice(0, 12)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0 border border-white/[0.03]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                      </div>
                      <span className="text-xs font-bold truncate uppercase tracking-wide">{student.program || 'GENERAL STUDIES'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center flex-shrink-0 border border-white/[0.03]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="text-xs font-bold truncate lowercase tracking-wide">{student.user?.email || 'unconfigured@portal.edu'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-950/80 rounded-[28px] p-6 border border-white/[0.05] shadow-inner group-hover:bg-slate-950 transition-colors">
                    <div className="text-center border-r border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">GPA IQ</p>
                      <p className={`text-xl font-black ${(student.gpa || 0) < 2.0 ? 'text-rose-400' : 'text-white'}`}>
                        {(student.gpa || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center border-r border-white/5 px-2">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">ENGAGE</p>
                      <p className={`text-xl font-black ${(student.attendance || 0) < 70 ? 'text-rose-400' : 'text-white'}`}>
                        {student.attendance || 0}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">STAGE</p>
                      <p className="text-xl font-black text-white">{student.year || 1}</p>
                    </div>
                  </div>

                  {/* Aesthetic Scrapper Overlay */}
                  <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.01] transition-all duration-700 pointer-events-none" />
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/[0.02] rounded-[64px] border border-dashed border-white/5 backdrop-blur-md">
              <div className="w-28 h-28 bg-slate-950 rounded-full flex items-center justify-center mb-10 shadow-2xl border border-white/5">
                <svg className="w-14 h-14 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={1.5} /></svg>
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">Null Entity Response</h3>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] text-center leading-loose">The requested student matrix produced zero results.<br />Re-initialize search vectors or adjust risk thresholds.</p>
            </div>
          )}
        </div>

        {/* Tactical Pagination Controller */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 shadow-4xl mb-12">
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Active Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span> Architecture
            </div>

            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-indigo-600 border border-white/5 text-white rounded-2xl transition-all font-black shadow-xl"
              >
                ←
              </button>

              <div className="hidden sm:flex gap-3">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-14 h-14 rounded-2xl font-black text-xs transition-all border ${currentPage === page
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-110'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10'
                          }`}
                      >
                        0{page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-slate-700 self-center font-black">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-indigo-600 border border-white/5 text-white rounded-2xl transition-all font-black shadow-xl"
              >
                →
              </button>
            </div>

            <div className="hidden lg:block bg-slate-900 border border-white/5 px-4 py-2 rounded-full">
              <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">{itemsPerPage} Entities per segment</span>
            </div>
          </div>
        )}
      </div>
    </AdvisorLayout>
  );
};

export default AdvisorStudentsPage;
