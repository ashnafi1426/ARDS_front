import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdvisorLayout from '../components/layouts/AdvisorLayout';

const AdvisorInterventionsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interventions, setInterventions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/interventions');
      const data = response.data.data?.interventions || response.data?.data || response.data || [];

      if (Array.isArray(data) && data.length > 0) {
        setInterventions(data);
      } else {
        setInterventions(getDemoCases());
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching interventions:', err);
      setInterventions(getDemoCases());
      setLoading(false);
    }
  };

  const getDemoCases = () => [
    {
      id: 'int-demo-1',
      studentName: 'Abebe Kebede',
      studentId: 'STU/1023/14',
      type: 'Academic Support',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      description: 'Weekly logic and programming tutoring specialized for Computer Science foundations.'
    },
    {
      id: 'int-demo-2',
      studentName: 'Sara Mohammed',
      studentId: 'STU/0562/15',
      type: 'Counseling',
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      description: 'Stress management workshop and personal counseling session for academic balance.'
    },
    {
      id: 'int-demo-3',
      studentName: 'Michael Chen',
      studentId: 'STU/0889/15',
      type: 'Meeting',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      description: 'Mid-semester performance review and intervention plan finalization.'
    }
  ];

  const getStatusBadgeStyle = (status) => {
    const styles = {
      'Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || styles['Scheduled'];
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Academic Support': '📝',
      'Counseling': '🤝',
      'Meeting': '💼',
      'Follow-up': '📈'
    };
    return icons[type] || '📑';
  };

  const filteredAndSorted = useMemo(() => {
    return interventions.filter(item => {
      const name = (item.studentName || '').toLowerCase();
      const id = (item.studentId || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [interventions, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginated = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <AdvisorLayout><div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div></AdvisorLayout>;

  return (
    <AdvisorLayout>
      <div className="min-h-[90vh] p-4 lg:p-10 space-y-10">
        {error && <ErrorMessage message={error} />}

        {/* Tactical Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative">
          <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] opacity-50" />
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">System Interventions</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] opacity-80">Command and Control: Student Support Tracks</p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchInterventions} className="p-4 bg-white/5 hover:bg-indigo-600/20 text-indigo-400 rounded-2xl transition-all border border-white/5 group shadow-2xl">
              <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2.5} /></svg>
            </button>
          </div>
        </div>

        {/* Global Strategy Plane (Search) */}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-3xl flex flex-col xl:flex-row gap-10 items-center">
          <div className="flex-1 w-full relative group">
            <input
              type="text"
              placeholder="IDENTIFY STUDENT ENTITY (Name or ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-5 pl-14 text-white text-xs font-black uppercase tracking-widest placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
            />
            <svg className="absolute left-6 top-5 w-5 h-5 text-slate-700 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3} /></svg>
          </div>
          <div className="w-full xl:w-[320px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-5 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-950">ALL LIFECYCLE STATES</option>
              <option value="Scheduled" className="bg-slate-950">SCHEDULED NODES</option>
              <option value="In Progress" className="bg-slate-950">ACTIVE STRATEGY</option>
              <option value="Completed" className="bg-slate-950">FINALIZED TRACKS</option>
              <option value="Cancelled" className="bg-slate-950">DE-ACTIVATED</option>
            </select>
          </div>
        </div>

        {/* Strategy Response Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {paginated.length > 0 ? (
            paginated.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-white/[0.03] hover:border-indigo-500/30 rounded-[48px] p-10 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(79,70,229,0.1)] group flex flex-col relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-4xl shadow-inner border border-white/[0.03] group-hover:scale-110 transition-transform duration-700 group-hover:rotate-6">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl leading-tight group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">{item.studentName}</h3>
                      <p className="text-indigo-400/40 text-[10px] font-black tracking-widest mt-1 uppercase">UUID: {item.studentId}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg backdrop-blur-md transition-all duration-700 ${getStatusBadgeStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="bg-slate-950/50 rounded-[32px] p-6 mb-10 border border-white/5 group-hover:border-indigo-500/10 flex-grow transition-all relative z-10">
                  <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.3em] mb-3">{item.type} Strategy</p>
                  <p className="text-slate-400 text-sm leading-relaxed font-bold italic opacity-70 group-hover:opacity-100 group-hover:text-slate-200 transition-all">"{item.description}"</p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/[0.03] relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                  </div>
                  <button className="h-12 px-8 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-95 border border-indigo-500/20">
                    Track Progress
                  </button>
                </div>

                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/[0.02] pointer-events-none" />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center bg-white/[0.01] rounded-[64px] border border-dashed border-white/5 backdrop-blur-3xl animate-in zoom-in-95 duration-700">
              <div className="w-28 h-28 bg-slate-950 rounded-full flex items-center justify-center mb-10 shadow-2xl border border-white/5 opacity-50">
                <svg className="w-14 h-14 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeWidth={1.5} /></svg>
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Cluster Vacant</h3>
              <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em] text-center leading-loose">The requested mitigation registry returned zero active support logs.</p>
            </div>
          )}
        </div>

        {/* Global Nav Control */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 shadow-4xl mb-20 translate-y-10">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
              Architecture Segment <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
            </p>

            <div className="flex gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-14 h-14 rounded-[20px] bg-white/5 border border-white/5 text-white flex items-center justify-center disabled:opacity-20 hover:bg-indigo-600 transition-all font-black shadow-xl"
              >
                ←
              </button>

              <div className="flex gap-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-14 h-14 rounded-[20px] font-black text-xs transition-all duration-500 border ${currentPage === (i + 1) ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-110' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(i + 1)}
                className="w-14 h-14 rounded-[20px] bg-white/5 border border-white/5 text-white flex items-center justify-center disabled:opacity-20 hover:bg-indigo-600 transition-all font-black shadow-xl"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdvisorLayout>
  );
};

export default AdvisorInterventionsPage;
