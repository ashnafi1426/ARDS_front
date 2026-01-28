import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const SemesterManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/semesters');
      if (response.data.status === 'success') {
        setSemesters(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching semesters:', err);
      setError('Failed to load semesters');
      setLoading(false);
    }
  };

  const handleAddSemester = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/semesters', formData);
      if (response.data.status === 'success') {
        setSemesters([...semesters, response.data.data]);
        setFormData({ name: '', startDate: '', endDate: '', status: 'active' });
        setShowAddForm(false);
      }
    } catch (err) {
      setError('Failed to add semester');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Semester Management</h1>
        <p>Manage academic semesters and their schedules</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Semester'}
        </button>
      </div>

      {showAddForm && (
        <div className="form-card">
          <h2>Add New Semester</h2>
          <form onSubmit={handleAddSemester}>
            <div className="form-group">
              <label>Semester Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Fall 2024"
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">Save Semester</button>
          </form>
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Semesters</span>
          <span className="stat-value">{semesters.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active</span>
          <span className="stat-value">{semesters.filter(s => s.status === 'active').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Semester Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.length > 0 ? (
              semesters.map(semester => (
                <tr key={semester.id}>
                  <td>{semester.name}</td>
                  <td>{new Date(semester.startDate).toLocaleDateString()}</td>
                  <td>{new Date(semester.endDate).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${semester.status}`}>{semester.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No semesters found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SemesterManagement;
