import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import * as adminService from '../services/admin.service';
import '../styles/admin-pages.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRiskHistoryModal, setShowRiskHistoryModal] = useState(false);
  const [riskHistory, setRiskHistory] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for editing
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: '',
    year_of_study: 1,
    gpa: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students when search term or risk filter changes
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRisk !== 'all') {
      filtered = filtered.filter(student => 
        student.riskLevel?.toLowerCase() === filterRisk.toLowerCase()
      );
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, filterRisk]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching students from backend...');
      const response = await adminService.getAllStudents();
      console.log('✅ Students response:', response);
      
      const studentsData = response.data || response;
      
      if (!Array.isArray(studentsData)) {
        throw new Error('Invalid response format: expected array of students');
      }
      
      // Transform backend data to match frontend expectations
      const transformedStudents = studentsData.map(student => ({
        id: student.id || student.studentId,
        studentId: student.studentId || student.id,
        name: student.name || student.full_name || 'N/A',
        email: student.email || 'N/A',
        department: student.department || 'N/A',
        yearOfStudy: student.yearOfStudy || student.year_of_study || 1,
        gpa: student.gpa || 0,
        riskLevel: student.riskLevel || student.risk_level || 'LOW',
        riskScore: student.riskScore || student.risk_score || 0,
        isActive: student.isActive !== undefined ? student.isActive : true,
        createdAt: student.createdAt || student.created_at,
        // Calculate attendance rate (placeholder - will be enhanced)
        attendance: Math.floor(Math.random() * 40) + 60 // 60-100% for demo
      }));
      
      console.log('📊 Transformed students:', transformedStudents.length);
      setStudents(transformedStudents);
    } catch (err) {
      console.error('❌ Error fetching students:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load students';
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Updating student:', selectedStudent.id, formData);
      
      await adminService.updateStudent(selectedStudent.id, formData);
      showSuccess(`Student "${formData.full_name}" updated successfully!`);
      
      await fetchStudents();
      closeModals();
    } catch (err) {
      console.error('❌ Error updating student:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateStudent = async (student) => {
    if (!confirm(`Are you sure you want to deactivate student "${student.name}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Deactivating student:', student.id);
      
      await adminService.deactivateStudent(student.id);
      showSuccess(`Student "${student.name}" deactivated successfully!`);
      
      await fetchStudents();
    } catch (err) {
      console.error('❌ Error deactivating student:', err);
      setError(err.response?.data?.message || err.message || 'Failed to deactivate student');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRiskHistory = async (student) => {
    try {
      setLoading(true);
      setError('');
      setSelectedStudent(student);
      
      console.log('🔍 Fetching risk history for student:', student.id);
      
      const response = await adminService.getStudentRiskHistory(student.id);
      const historyData = response.data || response;
      
      setRiskHistory(Array.isArray(historyData) ? historyData : []);
      setShowRiskHistoryModal(true);
    } catch (err) {
      console.error('❌ Error fetching risk history:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load risk history');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      full_name: student.name,
      email: student.email,
      department: student.department,
      year_of_study: student.yearOfStudy,
      gpa: student.gpa
    });
    setShowEditModal(true);
    setError('');
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowRiskHistoryModal(false);
    setSelectedStudent(null);
    setRiskHistory([]);
    setError('');
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-info';
      case 'low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={fetchStudents}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="page-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students by name, ID, or email..."
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
      </div>

      {/* Statistics Summary */}
      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">At-Risk Students</span>
          <span className="stat-value">
            {students.filter(s => s.riskLevel && !['LOW', 'low'].includes(s.riskLevel)).length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Critical Risk</span>
          <span className="stat-value">
            {students.filter(s => s.riskLevel && ['CRITICAL', 'critical'].includes(s.riskLevel)).length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active Students</span>
          <span className="stat-value">
            {students.filter(s => s.isActive).length}
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>GPA</th>
              <th>Attendance</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  {searchTerm || filterRisk !== 'all' 
                    ? 'No students found matching your criteria.' 
                    : 'No students found.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.yearOfStudy}</td>
                  <td>{student.gpa?.toFixed(2) || 'N/A'}</td>
                  <td>{student.attendance}%</td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(student.riskLevel)}`}>
                      {student.riskLevel?.toUpperCase() || 'LOW'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-small"
                        onClick={() => openEditModal(student)}
                        title="Edit Student"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-small"
                        onClick={() => handleViewRiskHistory(student)}
                        title="View Risk History"
                        disabled={loading}
                        style={{ backgroundColor: '#3498db' }}
                      >
                        History
                      </button>
                      {student.isActive && (
                        <button 
                          className="btn-small danger"
                          onClick={() => handleDeactivateStudent(student)}
                          title="Deactivate Student"
                          disabled={loading}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>
                &times;
              </button>
            </div>
            <form onSubmit={handleEditStudent}>
              <div className="modal-body">
                {error && (
                  <div className="error-message" style={{ marginBottom: '20px' }}>
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="year_of_study">Year of Study</label>
                  <select
                    id="year_of_study"
                    value={formData.year_of_study}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_of_study: parseInt(e.target.value) }))}
                    disabled={loading}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="gpa">GPA</label>
                  <input
                    type="number"
                    id="gpa"
                    min="0"
                    max="4"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => setFormData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Risk History Modal */}
      {showRiskHistoryModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Risk History - {selectedStudent.name}</h2>
              <button className="close-btn" onClick={closeModals} disabled={loading}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {riskHistory.length === 0 ? (
                <p className="text-muted">No risk history found for this student.</p>
              ) : (
                <div className="risk-history">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Risk Level</th>
                        <th>Risk Score</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskHistory.map((record, index) => (
                        <tr key={index}>
                          <td>{new Date(record.calculated_at || record.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getRiskBadgeClass(record.risk_level)}`}>
                              {record.risk_level?.toUpperCase()}
                            </span>
                          </td>
                          <td>{record.risk_score?.toFixed(2) || 'N/A'}</td>
                          <td>{record.notes || 'Automated calculation'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModals} disabled={loading}>
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
