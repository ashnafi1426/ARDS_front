import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/students');
      if (response.data.status === 'success') {
        setStudents(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
      setLoading(false);
    }
  };

  const getRiskLevel = (student) => {
    if (student.gpa < 2.0) return 'critical';
    if (student.gpa < 2.5) return 'high';
    if (student.gpa < 3.0) return 'medium';
    return 'low';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || getRiskLevel(student) === filterRisk;
    return matchesSearch && matchesRisk;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <p>Monitor and manage student records and academic progress</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={fetchStudents}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">At-Risk</span>
          <span className="stat-value">{students.filter(s => getRiskLevel(s) !== 'low').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Critical</span>
          <span className="stat-value">{students.filter(s => getRiskLevel(s) === 'critical').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>GPA</th>
              <th>Attendance</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.gpa?.toFixed(2) || 'N/A'}</td>
                  <td>{student.attendance || 'N/A'}%</td>
                  <td>
                    <span className={`badge badge-${getRiskLevel(student)}`}>
                      {getRiskLevel(student).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedStudent.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Student ID:</span>
                <span className="detail-value">{selectedStudent.studentId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedStudent.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">GPA:</span>
                <span className="detail-value">{selectedStudent.gpa?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Attendance:</span>
                <span className="detail-value">{selectedStudent.attendance}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Risk Level:</span>
                <span className={`badge badge-${getRiskLevel(selectedStudent)}`}>
                  {getRiskLevel(selectedStudent).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
