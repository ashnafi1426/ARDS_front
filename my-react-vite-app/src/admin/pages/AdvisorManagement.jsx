import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const AdvisorManagement = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: ''
  });

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/advisors');
      if (response.data.status === 'success') {
        setAdvisors(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError('Failed to load advisors');
      setLoading(false);
    }
  };

  const handleAddAdvisor = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/advisors', formData);
      if (response.data.status === 'success') {
        setAdvisors([...advisors, response.data.data]);
        setFormData({ name: '', email: '', department: '', phone: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      setError('Failed to add advisor');
    }
  };

  const filteredAdvisors = advisors.filter(advisor => {
    return advisor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           advisor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           advisor.department?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Advisor Management</h1>
        <p>Manage academic advisors and their assignments</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search advisors by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Advisor'}
        </button>
      </div>

      {showAddForm && (
        <div className="form-card">
          <h2>Add New Advisor</h2>
          <form onSubmit={handleAddAdvisor}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Save Advisor</button>
          </form>
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Advisors</span>
          <span className="stat-value">{advisors.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active</span>
          <span className="stat-value">{advisors.filter(a => a.status === 'active').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvisors.length > 0 ? (
              filteredAdvisors.map(advisor => (
                <tr key={advisor.id}>
                  <td>{advisor.name}</td>
                  <td>{advisor.email}</td>
                  <td>{advisor.department || 'N/A'}</td>
                  <td>{advisor.phone || 'N/A'}</td>
                  <td><span className={`badge badge-${advisor.status || 'active'}`}>{advisor.status || 'active'}</span></td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No advisors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvisorManagement;
