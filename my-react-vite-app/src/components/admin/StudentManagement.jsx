import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../config/api';

const StudentManagement = ({ setSuccess, setError }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportForm, setShowImportForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filterRisk, setFilterRisk] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Search and Filter Node State
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalStudents, setTotalStudents] = useState(0);

  // Create/Edit Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    program: '',
    year: 1,
    gpa: 0.0
  });

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, filterProgram, filterYear, filterRisk, currentPage, pageSize]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery
      };

      if (filterProgram) params.program = filterProgram;
      if (filterYear) params.year = filterYear;
      if (filterRisk) params.riskLevel = filterRisk;

      const response = await api.get('/students', { params });
      if (response.data.status === 'success' && response.data.data) {
        setStudents(response.data.data.students || []);
        setTotalStudents(response.data.data.total || 0);
      }
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
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

  const handleUpdateStudent = async (studentId, studentData) => {
    try {
      await api.put(`/students/${studentId}`, studentData);
      setSuccess('Student updated successfully');
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      setError('Failed to update student');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.studentId) {
        setError('Please fill in all required fields');
        return;
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        studentId: formData.studentId,
        program: formData.program,
        year: parseInt(formData.year),
        gpa: parseFloat(formData.gpa)
      };

      const response = await api.post('/students', payload);
      if (response.data.status === 'success') {
        setSuccess('Student created successfully');
        setShowCreateForm(false);
        resetForm();
        fetchStudents();
      } else {
        setError(response.data.message || 'Failed to create student');
      }
    } catch (error) {
      console.error('Create student error:', error);
      let errorMsg = 'Failed to create student';
      
      // Handle different error types
      if (error.response?.status === 403) {
        errorMsg = 'Access Denied: Only admins can create students';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.status === 'fail') {
        errorMsg = error.response.data.message || 'Failed to create student';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
      program: '',
      year: 1,
      gpa: 0.0
    });
  };

  const handleDeactivateStudent = async (studentId) => {
    if (!confirm('Are you sure you want to deactivate this student?')) return;
    try {
      await api.put(`/students/${studentId}`, { isActive: false });
      setSuccess('Student deactivated successfully');
      fetchStudents();
    } catch (error) {
      setError('Failed to deactivate student');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedStudents.length === 0) {
      setError('Please select students first');
      return;
    }

    if (!confirm(`Are you sure you want to ${action} ${selectedStudents.length} student(s)?`)) return;

    try {
      const endpoint = action === 'deactivate' ? '/students/bulk-deactivate' : '/students/bulk-activate';
      await api.post(endpoint, { studentIds: selectedStudents });
      setSuccess(`Students ${action}d successfully`);
      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      setError(`Failed to ${action} students`);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Data exported successfully');
    } catch (error) {
      setError('Failed to export data');
    }
  };

  const handleImportData = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Students imported successfully');
      setShowImportForm(false);
      fetchStudents();
    } catch (error) {
      setError('Failed to import students');
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      low: 'bg-green-600',
      medium: 'bg-orange-600',
      high: 'bg-red-600',
      critical: 'bg-purple-700'
    };
    return colors[level] || 'bg-gray-600';
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Student Data Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Add Student
          </button>
          <button
            onClick={() => setShowImportForm(!showImportForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Import Students
          </button>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📤 Export Data
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Students</h3>
          <div className="text-3xl font-bold text-blue-400">{students.length}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active Students</h3>
          <div className="text-3xl font-bold text-green-400">
            {students.filter(s => s.isActive !== false).length}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">At Risk Students</h3>
          <div className="text-3xl font-bold text-orange-400">
            {students.filter(s => ['high', 'critical'].includes(s.currentRiskLevel)).length}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Avg GPA</h3>
          <div className="text-3xl font-bold text-purple-400">
            {students.length > 0 ? (students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Professional Search & Filter Hub */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Node */}
          <div className="md:col-span-6 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search by name, ID, or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applySearch();
                }
              }}
              className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Action */}
          <div className="md:col-span-2">
            <button
              onClick={applySearch}
              className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 py-3 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Secondary Filters Hub */}
          <div className="md:col-span-4 grid grid-cols-3 gap-2">
            <select
              value={filterProgram}
              onChange={(e) => { setFilterProgram(e.target.value); setCurrentPage(1); }}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Program</option>
              {['Computer Science', 'Engineering', 'Business', 'Medicine'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Year</option>
              {[1, 2, 3, 4, 5, 6].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filterRisk}
              onChange={(e) => { setFilterRisk(e.target.value); setCurrentPage(1); }}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Risk</option>
              {['low', 'medium', 'high', 'critical'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Import Form */}
      {showImportForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Import Students</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleImportData(e.target.files[0]);
                  }
                }}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div className="text-sm text-gray-400">
              <p>CSV format: first_name,last_name,email,student_id,program,year,gpa</p>
            </div>
            <button
              onClick={() => setShowImportForm(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Student Form */}
      {showCreateForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Create New Student</h3>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="student@university.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Student ID *</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="STU-12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Program</label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="3.5"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-white">{selectedStudents.length} student(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Deactivate Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Student Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length && students.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {student.studentId || student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {student.user?.firstName} {student.user?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {student.user?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.program}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {student.gpa?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${getRiskColor(student.currentRiskLevel)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm`}>
                      {student.currentRiskLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${student.isActive !== false ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                      }`}>
                      {student.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivateStudent(student.id)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        {student.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setSuccess('Retrieving historical telemetry archive...')}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-6">Edit Student</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Program</label>
                <input
                  type="text"
                  value={editingStudent.program}
                  onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={editingStudent.year}
                  onChange={(e) => setEditingStudent({ ...editingStudent, year: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={editingStudent.gpa}
                  onChange={(e) => setEditingStudent({ ...editingStudent, gpa: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStudent(editingStudent.id, {
                    program: editingStudent.program,
                    year: editingStudent.year,
                    gpa: editingStudent.gpa
                  })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
