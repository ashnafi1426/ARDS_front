import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AtRiskStudentList = ({ students, onStudentSelect, onPlanIntervention, onScheduleMeeting }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('risk'); // risk, gpa, attendance

  const getRiskColor = (level) => {
    const colors = {
      critical: 'from-red-500 to-red-600',
      high: 'from-orange-500 to-orange-600',
      medium: 'from-yellow-400 to-yellow-500',
      low: 'from-green-500 to-green-600'
    };
    return colors[level] || colors.low;
  };

  // Filter and Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const fullName = `${student.user?.firstName} ${student.user?.lastName}`.toLowerCase();
      const studentId = (student.id || student.studentId || '').toString().toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || studentId.includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'all' || student.currentRiskLevel === filterRisk;
      return matchesSearch && matchesRisk;
    }).sort((a, b) => {
      if (sortBy === 'risk') {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (riskOrder[b.currentRiskLevel] || 0) - (riskOrder[a.currentRiskLevel] || 0);
      } else if (sortBy === 'gpa') {
        return (a.gpa || 0) - (b.gpa || 0);
      } else if (sortBy === 'attendance') {
        return (a.attendance || 0) - (b.attendance || 0);
      }
      return 0;
    });
  }, [students, searchTerm, filterRisk, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-all"
          />
          <svg className="absolute left-3 top-3 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['all', 'critical', 'high', 'medium', 'low'].map((risk) => (
            <button
              key={risk}
              onClick={() => { setFilterRisk(risk); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filterRisk === risk
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center text-sm text-purple-200/60 px-2 font-medium">
        <p>Showing {paginatedStudents.length} of {filteredStudents.length} students</p>
        <div className="flex items-center gap-2">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none border-none cursor-pointer"
          >
            <option value="risk" className="bg-slate-900">Highest Risk</option>
            <option value="gpa" className="bg-slate-900">Lowest GPA</option>
            <option value="attendance" className="bg-slate-900">Lowest Attendance</option>
          </select>
        </div>
      </div>

      {/* Student Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedStudents.length > 0 ? (
          paginatedStudents.map((student, index) => (
            <div
              key={student.id || student.studentId}
              onClick={() => onStudentSelect(student)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all group cursor-pointer relative overflow-hidden"
            >
              {/* Risk Glow Effect */}
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${getRiskColor(student.currentRiskLevel)}`} />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRiskColor(student.currentRiskLevel)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {student.user?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
                      {student.user?.firstName} {student.user?.lastName}
                    </h4>
                    <p className="text-white/40 text-sm font-medium">
                      {(student.id || student.studentId).toString().slice(0, 8)} • {student.program}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">GPA</p>
                    <p className={`font-bold text-lg ${(student.gpa || 0) < 2.0 ? 'text-red-400' : 'text-white'}`}>
                      {(student.gpa || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Attendance</p>
                    <p className={`font-bold text-lg ${(student.attendance || 0) < 75 ? 'text-red-400' : 'text-white'}`}>
                      {(student.attendance || 0)}%
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Risk</p>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-gradient-to-r ${getRiskColor(student.currentRiskLevel)} text-white`}>
                      {student.currentRiskLevel}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onPlanIntervention(student); }}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-sm font-bold transition-all border border-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    Plan
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onScheduleMeeting(student); }}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white rounded-xl text-sm font-bold transition-all border border-green-500/30 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    Meeting
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-white/40 font-medium">No students match your criteria</p>
          </div>
        )}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === pageNum
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="text-white/20 self-center">...</span>;
              }
              return null;
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

AtRiskStudentList.propTypes = {
  students: PropTypes.array.isRequired,
  onStudentSelect: PropTypes.func.isRequired,
  onPlanIntervention: PropTypes.func.isRequired,
  onScheduleMeeting: PropTypes.func.isRequired
};

export default AtRiskStudentList;
