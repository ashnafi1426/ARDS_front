import { useState, useEffect } from 'react';

const StudentDataManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    program: '',
    year: 1,
    gpa: 0,
    riskLevel: 'low'
  });

  // Mock data
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@university.edu',
        studentId: 'STU001',
        program: 'Computer Science',
        year: 2,
        gpa: 3.8,
        riskLevel: 'low',
        status: 'active',
        enrolledDate: '2023-09-01',
        history: [
          { date: '2024-01-20', gpa: 3.8, riskLevel: 'low', attendance: '95%' },
          { date: '2024-01-10', gpa: 3.7, riskLevel: 'low', attendance: '92%' }
        ]
      },
      {
        id: 2,
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@university.edu',
        studentId: 'STU002',
        program: 'Business',
        year: 3,
        gpa: 2.5,
        riskLevel: 'high',
        status: 'active',
        enrolledDate: '2022-09-01',
        history: [
          { date: '2024-01-20', gpa: 2.5, riskLevel: 'high', attendance: '65%' },
          { date: '2024-01-10', gpa: 2.6, riskLevel: 'medium', attendance: '70%' }
        ]
      },
      {
        id: 3,
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol@university.edu',
        studentId: 'STU003',
        program: 'Engineering',
        year: 1,
        gpa: 3.2,
        riskLevel: 'medium',
        status: 'active',
        enrolledDate: '2023-09-01',
        history: [
          { date: '2024-01-20', gpa: 3.2, riskLevel: 'medium', attendance: '80%' },
          { date: '2024-01-10', gpa: 3.1, riskLevel: 'medium', attendance: '78%' }
        ]
      },
      {
        id: 4,
        firstName: 'David',
        lastName: 'Miller',
        email: 'david@university.edu',
        studentId: 'STU004',
        program: 'Mathematics',
        year: 2,
        gpa: 2.0,
        riskLevel: 'critical',
        status: 'inactive',
        enrolledDate: '2023-09-01',
        history: [
          { date: '2024-01-20', gpa: 2.0, riskLevel: 'critical', attendance: '45%' },
          { date: '2024-01-10', gpa: 2.1, riskLevel: 'high', attendance: '50%' }
        ]
      }
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  // Filter students
  useEffect(() => {
    let filtered = students;

    if (filterRisk !== 'all') {
      filtered = filtered.filter(s => s.riskLevel === filterRisk);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, filterRisk, students]);

  const handleEditStudent = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...formData } : s));
      setMessage({ type: 'success', text: 'Student updated successfully!' });
      setShowEditForm(false);
      setSelectedStudent(null);
      setLoading(false);
    }, 500);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      setStudents(students.filter(s => s.id !== id));
      setMessage({ type: 'success', text: 'Student record deleted successfully!' });
    }
  };

  const handleDeactivateStudent = (student) => {
    if (window.confirm(`Deactivate ${student.firstName} ${student.lastName}?`)) {
      setStudents(students.map(s => s.id === student.id ? { ...s, status: 'inactive' } : s));
      setMessage({ type: 'success', text: 'Student deactivated successfully!' });
    }
  };

  const openEditForm = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      studentId: student.studentId,
      program: student.program,
      year: student.year,
      gpa: student.gpa,
      riskLevel: student.riskLevel
    });
    setShowEditForm(true);
  };

  const openHistoryModal = (student) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Student Data Management</h2>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Risk Level</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Program</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">GPA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Risk Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.studentId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{student.firstName} {student.lastName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.program}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.gpa.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(student.riskLevel)}`}>
                    {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => openEditForm(student)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openHistoryModal(student)}
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    History
                  </button>
                  {student.status === 'active' && (
                    <button
                      onClick={() => handleDeactivateStudent(student)}
                      className="text-orange-600 hover:text-orange-800 font-semibold"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Student Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Student</h3>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <input
                  type="text"
                  required
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  required
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Performance History - {selectedStudent.firstName} {selectedStudent.lastName}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedStudent.history && selectedStudent.history.map((record, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{record.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">GPA</p>
                      <p className="text-sm font-semibold text-gray-900">{record.gpa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Risk Level</p>
                      <p className={`text-sm font-semibold ${getRiskColor(record.riskLevel)}`}>
                        {record.riskLevel.charAt(0).toUpperCase() + record.riskLevel.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Attendance</p>
                      <p className="text-sm font-semibold text-gray-900">{record.attendance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-6">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataManagement;
