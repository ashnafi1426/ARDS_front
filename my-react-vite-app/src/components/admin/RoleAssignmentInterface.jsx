import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

const RoleAssignmentInterface = ({ onRefresh }) => {
  // State Management
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Pagination & Filtering for Users
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Advisor Assignment State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [advisorSearch, setAdvisorSearch] = useState('');

  // Assignments Pagination
  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [assignmentsPageSize, setAssignmentsPageSize] = useState(25);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchQuery, roleFilter]);

  useEffect(() => {
    fetchAssignments();
  }, [assignmentsPage, assignmentsPageSize]);

  useEffect(() => {
    const q = studentSearch.trim();
    if (!q) {
      setStudentOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get('/students', {
          params: { page: 1, limit: 20, search: q }
        });

        if (response.data.status === 'success' && response.data.data) {
          setStudentOptions(response.data.data.students || []);
        } else {
          setStudentOptions(response.data.students || []);
        }
      } catch (error) {
        console.error('Error searching students:', error);
        setStudentOptions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [studentSearch]);

  useEffect(() => {
    const q = advisorSearch.trim();
    if (!q) {
      setAdvisors([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await api.get('/auth/users', {
          params: { page: 1, limit: 20, search: q, role: 'advisor' }
        });

        if (response.data.status === 'success' && response.data.data) {
          setAdvisors(response.data.data.users || []);
        } else {
          setAdvisors(response.data.users || []);
        }
      } catch (error) {
        console.error('Error searching advisors:', error);
        setAdvisors([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [advisorSearch]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        role: roleFilter !== 'all' ? roleFilter : undefined
      };

      const response = await api.get('/auth/users', { params });
      if (response.data.status === 'success' && response.data.data) {
        setUsers(response.data.data.users || []);
        setTotalUsers(response.data.data.total || 0);
      } else {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.users?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const params = {
        page: assignmentsPage,
        limit: assignmentsPageSize
      };

      const response = await api.get('/students', { params });
      if (response.data.status === 'success' && response.data.data) {
        setStudents(response.data.data.students || []);
        setTotalAssignments(response.data.data.total || 0);
      } else {
        setStudents(response.data.students || []);
        setTotalAssignments(response.data.students?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const applySearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    if (searchQuery) {
      setSearchQuery('');
      setCurrentPage(1);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSubmitting(true);
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) {
        showToast('error', 'User not found');
        return;
      }

      await api.put(`/auth/users/${userId}`, { ...userToUpdate, role: newRole });
      showToast('success', `Role updated to ${newRole}`);
      fetchUsers();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Role update error:', error);
      showToast('error', error.response?.data?.message || 'Error updating role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignAdvisor = async () => {
    if (!selectedStudent || !selectedAdvisor) {
      showToast('error', 'Please select both student and advisor');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/students/${selectedStudent}`, { advisorId: selectedAdvisor });
      showToast('success', 'Advisor assigned successfully');
      setSelectedStudent('');
      setSelectedAdvisor('');
      setStudentSearch('');
      setAdvisorSearch('');
      fetchAssignments();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Advisor assignment error:', error);
      showToast('error', error.response?.data?.message || 'Error assigning advisor');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / pageSize);
  const assignmentsTotalPages = Math.ceil(totalAssignments / assignmentsPageSize);

  const getRoleBadgeColor = (role) => {
    const roles = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      advisor: 'bg-blue-100 text-blue-700 border-blue-200',
      student: 'bg-green-100 text-green-700 border-green-200'
    };
    return roles[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Skeleton loader
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-2xl text-white font-medium text-sm animate-fade-in-down flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
          <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* Quick Role Changes Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-2xl font-bold text-gray-900">Role Assignment & Advisor Management</h3>
          <p className="text-sm text-gray-600 mt-1">Manage user roles and academic advisors • {totalUsers.toLocaleString()} total users</p>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 bg-[#f8f9fa] border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-9 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search and verify user identities..."
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); }}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 text-sm"
                />
                {searchInput && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
              <button
                onClick={applySearch}
                disabled={loading}
                className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Scan Registry
              </button>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-3 relative">
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 appearance-none text-sm font-medium"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="advisor">Advisors</option>
                <option value="admin">Admins</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto relative bg-white">
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-700 font-medium">Loading users...</p>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-gray-900">No users found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={submitting}
                          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 appearance-none cursor-pointer pr-10"
                        >
                          <option value="student">Student</option>
                          <option value="advisor">Advisor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-gray-900">{Math.min(currentPage * pageSize, totalUsers)}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalUsers.toLocaleString()}</span> users
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                disabled={loading}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              <span className="px-4 py-1.5 text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Assignment Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-900">Assign Advisor to Student</h3>
          <p className="text-sm text-gray-600 mt-1">Connect students with their academic advisors</p>
        </div>

        <div className="p-6 bg-[#f8f9fa]">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Search student by name or ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm mb-2"
                />
                <div className="relative">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Student --</option>
                    {studentOptions.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.user?.firstName} {student.user?.lastName} ({student.studentId || student.id})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Advisor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Advisor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Search advisor by name..."
                  value={advisorSearch}
                  onChange={(e) => setAdvisorSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm mb-2"
                />
                <div className="relative">
                  <select
                    value={selectedAdvisor}
                    onChange={(e) => setSelectedAdvisor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Advisor --</option>
                    {advisors.map(advisor => (
                      <option key={advisor.id} value={advisor.id}>
                        {advisor.first_name} {advisor.last_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Assign Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAssignAdvisor}
                disabled={!selectedStudent || !selectedAdvisor || submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                Assign Advisor
              </button>
            </div>
          </div>
        </div>

        {/* Current Assignments Table */}
        <div className="px-6 py-6 bg-white">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Current Advisor Assignments</h4>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned Advisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {students.filter(s => s.advisor).length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-base font-medium text-gray-900">No advisor assignments yet</p>
                        <p className="text-sm text-gray-500">Start by assigning advisors to students above</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.filter(s => s.advisor).map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-green-400 to-green-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                            {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {student.user?.firstName} {student.user?.lastName}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{student.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">{student.program || 'N/A'}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {student.advisor?.firstName?.[0]}{student.advisor?.lastName?.[0]}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.advisor?.firstName} {student.advisor?.lastName}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Assignments Pagination */}
          {students.filter(s => s.advisor).length > 0 && (
            <div className="mt-6 px-6 py-4 bg-[#f8f9fa] rounded-lg border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{(assignmentsPage - 1) * assignmentsPageSize + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">{Math.min(assignmentsPage * assignmentsPageSize, totalAssignments)}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalAssignments.toLocaleString()}</span> assignments
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={assignmentsPageSize}
                    onChange={(e) => { setAssignmentsPageSize(Number(e.target.value)); setAssignmentsPage(1); }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAssignmentsPage(prev => Math.max(1, prev - 1))}
                    disabled={assignmentsPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>

                  <span className="px-4 py-1.5 text-sm text-gray-700 font-medium">
                    Page {assignmentsPage} of {assignmentsTotalPages}
                  </span>

                  <button
                    onClick={() => setAssignmentsPage(prev => Math.min(assignmentsTotalPages, prev + 1))}
                    disabled={assignmentsPage === assignmentsTotalPages}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RoleAssignmentInterface.propTypes = {
  onRefresh: PropTypes.func
};

export default RoleAssignmentInterface;
