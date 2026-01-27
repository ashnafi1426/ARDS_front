import { useState, useEffect } from 'react';

const AdvisorManagement = () => {
  const [advisors, setAdvisors] = useState([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showReassignForm, setShowReassignForm] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [assignFormData, setAssignFormData] = useState({
    advisorId: '',
    studentId: ''
  });

  // Mock data
  useEffect(() => {
    const mockAdvisors = [
      {
        id: 1,
        firstName: 'Dr.',
        lastName: 'Smith',
        email: 'smith@university.edu',
        department: 'Computer Science',
        assignedStudents: 15,
        performance: 'Excellent',
        status: 'active',
        joinDate: '2020-01-15',
        students: [
          { id: 1, name: 'Alice Brown', riskLevel: 'low' },
          { id: 2, name: 'Bob Wilson', riskLevel: 'high' }
        ]
      },
      {
        id: 2,
        firstName: 'Prof.',
        lastName: 'Johnson',
        email: 'johnson@university.edu',
        department: 'Business',
        assignedStudents: 12,
        performance: 'Good',
        status: 'active',
        joinDate: '2021-03-20',
        students: [
          { id: 3, name: 'Carol Davis', riskLevel: 'medium' }
        ]
      },
      {
        id: 3,
        firstName: 'Dr.',
        lastName: 'Williams',
        email: 'williams@university.edu',
        department: 'Engineering',
        assignedStudents: 18,
        performance: 'Excellent',
        status: 'active',
        joinDate: '2019-08-10',
        students: [
          { id: 4, name: 'David Miller', riskLevel: 'critical' }
        ]
      }
    ];

    const mockStudents = [
      { id: 1, name: 'Alice Brown', program: 'CS', riskLevel: 'low', currentAdvisor: 1 },
      { id: 2, name: 'Bob Wilson', program: 'Business', riskLevel: 'high', currentAdvisor: 1 },
      { id: 3, name: 'Carol Davis', program: 'Engineering', riskLevel: 'medium', currentAdvisor: 2 },
      { id: 4, name: 'David Miller', program: 'Math', riskLevel: 'critical', currentAdvisor: 3 },
      { id: 5, name: 'Eve Taylor', program: 'CS', riskLevel: 'low', currentAdvisor: null }
    ];

    setAdvisors(mockAdvisors);
    setFilteredAdvisors(mockAdvisors);
    setStudents(mockStudents);
  }, []);

  // Filter advisors
  useEffect(() => {
    let filtered = advisors;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAdvisors(filtered);
  }, [searchTerm, advisors]);

  const handleAssignStudent = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Update advisor's assigned students
      setAdvisors(advisors.map(a => {
        if (a.id === parseInt(assignFormData.advisorId)) {
          const student = students.find(s => s.id === parseInt(assignFormData.studentId));
          return {
            ...a,
            assignedStudents: a.assignedStudents + 1,
            students: [...a.students, { id: student.id, name: student.name, riskLevel: student.riskLevel }]
          };
        }
        return a;
      }));

      // Update student's advisor
      setStudents(students.map(s =>
        s.id === parseInt(assignFormData.studentId)
          ? { ...s, currentAdvisor: parseInt(assignFormData.advisorId) }
          : s
      ));

      setMessage({ type: 'success', text: 'Student assigned to advisor successfully!' });
      setShowAssignForm(false);
      setAssignFormData({ advisorId: '', studentId: '' });
      setLoading(false);
    }, 500);
  };

  const handleReassignStudent = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const oldAdvisorId = selectedStudent.currentAdvisor;
      const newAdvisorId = parseInt(assignFormData.advisorId);

      // Remove from old advisor
      setAdvisors(advisors.map(a => {
        if (a.id === oldAdvisorId) {
          return {
            ...a,
            assignedStudents: a.assignedStudents - 1,
            students: a.students.filter(s => s.id !== selectedStudent.id)
          };
        }
        // Add to new advisor
        if (a.id === newAdvisorId) {
          return {
            ...a,
            assignedStudents: a.assignedStudents + 1,
            students: [...a.students, { id: selectedStudent.id, name: selectedStudent.name, riskLevel: selectedStudent.riskLevel }]
          };
        }
        return a;
      }));

      // Update student's advisor
      setStudents(students.map(s =>
        s.id === selectedStudent.id
          ? { ...s, currentAdvisor: newAdvisorId }
          : s
      ));

      setMessage({ type: 'success', text: 'Student reassigned successfully!' });
      setShowReassignForm(false);
      setSelectedStudent(null);
      setAssignFormData({ advisorId: '', studentId: '' });
      setLoading(false);
    }, 500);
  };

  const openReassignForm = (student) => {
    setSelectedStudent(student);
    setAssignFormData({ advisorId: student.currentAdvisor || '', studentId: '' });
    setShowReassignForm(true);
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Average': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return colors[performance] || 'bg-gray-100 text-gray-800';
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

  const unassignedStudents = students.filter(s => !s.currentAdvisor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Advisor Management</h2>
        <button
          onClick={() => setShowAssignForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          + Assign Student
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Unassigned Students Alert */}
      {unassignedStudents.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800">
            ⚠️ {unassignedStudents.length} student(s) without an assigned advisor
          </p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Advisors</label>
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Advisors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvisors.map(advisor => (
          <div key={advisor.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <h3 className="text-xl font-bold">{advisor.firstName} {advisor.lastName}</h3>
              <p className="text-blue-100 text-sm">{advisor.department}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Assigned Students</p>
                  <p className="text-2xl font-bold text-gray-900">{advisor.assignedStudents}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Performance</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(advisor.performance)}`}>
                    {advisor.performance}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Email</p>
                <p className="text-sm text-gray-700">{advisor.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Assigned Students</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {advisor.students.map(student => (
                    <div key={student.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{student.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(student.riskLevel)}`}>
                        {student.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Students Section */}
      {unassignedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Unassigned Students</h3>
          <div className="space-y-3">
            {unassignedStudents.map(student => (
              <div key={student.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.program}</p>
                </div>
                <button
                  onClick={() => openReassignForm(student)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm"
                >
                  Assign Advisor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Assign Student to Advisor</h3>
            <form onSubmit={handleAssignStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Advisor</label>
                <select
                  required
                  value={assignFormData.advisorId}
                  onChange={(e) => setAssignFormData({ ...assignFormData, advisorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose an advisor...</option>
                  {advisors.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} ({a.assignedStudents} students)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  required
                  value={assignFormData.studentId}
                  onChange={(e) => setAssignFormData({ ...assignFormData, studentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose a student...</option>
                  {students.filter(s => !s.currentAdvisor).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.program})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Student Modal */}
      {showReassignForm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Reassign {selectedStudent.name}
            </h3>
            <form onSubmit={handleReassignStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select New Advisor</label>
                <select
                  required
                  value={assignFormData.advisorId}
                  onChange={(e) => setAssignFormData({ ...assignFormData, advisorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose an advisor...</option>
                  {advisors.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} ({a.assignedStudents} students)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReassignForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Reassigning...' : 'Reassign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorManagement;
