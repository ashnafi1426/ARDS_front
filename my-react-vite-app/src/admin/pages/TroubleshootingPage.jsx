import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const TroubleshootingPage = () => {
  const [issues, setIssues] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('issues');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    category: 'bug'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Mock data for issues and errors
      const mockIssues = [
        {
          id: 1,
          title: 'Login page not loading',
          description: 'Users report login page takes too long to load',
          reporter: 'John Doe',
          priority: 'high',
          status: 'open',
          category: 'bug',
          createdAt: '2024-01-28',
          updatedAt: '2024-01-28',
          assignedTo: 'Admin'
        },
        {
          id: 2,
          title: 'Dashboard performance issue',
          description: 'Dashboard is slow when loading large datasets',
          reporter: 'Jane Smith',
          priority: 'medium',
          status: 'in-progress',
          category: 'performance',
          createdAt: '2024-01-27',
          updatedAt: '2024-01-28',
          assignedTo: 'Developer'
        },
        {
          id: 3,
          title: 'Email notifications not sending',
          description: 'Email service appears to be down',
          reporter: 'System',
          priority: 'critical',
          status: 'open',
          category: 'integration',
          createdAt: '2024-01-28',
          updatedAt: '2024-01-28',
          assignedTo: 'Admin'
        }
      ];

      const mockErrors = [
        {
          id: 1,
          timestamp: '2024-01-28 14:32:15',
          level: 'error',
          message: 'Database connection timeout',
          source: 'Backend API',
          stackTrace: 'Error: Connection timeout at Database.connect()',
          frequency: 5,
          lastOccurrence: '2024-01-28 14:32:15'
        },
        {
          id: 2,
          timestamp: '2024-01-28 13:45:22',
          level: 'warning',
          message: 'High memory usage detected',
          source: 'System Monitor',
          stackTrace: 'Memory usage: 85%',
          frequency: 12,
          lastOccurrence: '2024-01-28 14:30:00'
        },
        {
          id: 3,
          timestamp: '2024-01-28 12:15:08',
          level: 'error',
          message: 'API rate limit exceeded',
          source: 'API Gateway',
          stackTrace: 'Error: Rate limit exceeded for IP 192.168.1.1',
          frequency: 3,
          lastOccurrence: '2024-01-28 13:20:00'
        }
      ];

      setIssues(mockIssues);
      setErrors(mockErrors);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load troubleshooting data');
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const newIssue = {
        id: issues.length + 1,
        ...formData,
        reporter: 'Admin',
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        assignedTo: 'Unassigned'
      };

      setIssues([newIssue, ...issues]);
      setFormData({ title: '', description: '', priority: 'normal', category: 'bug' });
      setShowCreateForm(false);
      setSuccess('Issue created successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create issue');
    }
  };

  const handleUpdateIssue = async (issueId, updates) => {
    try {
      setIssues(issues.map(issue =>
        issue.id === issueId
          ? { ...issue, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : issue
      ));
      setSuccess('Issue updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update issue');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || issue.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'danger';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getErrorLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Troubleshooting & Support</h1>
        <p>Manage issues, errors, and system problems</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            🐛 Issues ({filteredIssues.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            ⚠️ System Errors ({errors.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📋 Error Logs
          </button>
        </div>

        {/* Issues Tab */}
        {activeTab === 'issues' && (
          <div className="tab-content">
            <div className="page-controls">
              <div className="filter-group">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="filter-group">
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : '+ Report Issue'}
              </button>
            </div>

            {showCreateForm && (
              <div className="form-card">
                <h2>Report New Issue</h2>
                <form onSubmit={handleCreateIssue}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="bug">Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="performance">Performance</option>
                      <option value="integration">Integration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-success">Create Issue</button>
                </form>
              </div>
            )}

            <div className="stats-summary">
              <div className="stat-box">
                <span className="stat-label">Open Issues</span>
                <span className="stat-value">{issues.filter(i => i.status === 'open').length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">{issues.filter(i => i.status === 'in-progress').length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Resolved</span>
                <span className="stat-value">{issues.filter(i => i.status === 'resolved').length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Critical</span>
                <span className="stat-value">{issues.filter(i => i.priority === 'critical').length}</span>
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <tr key={issue.id}>
                        <td>{issue.title}</td>
                        <td>{issue.category}</td>
                        <td>
                          <span className={`badge badge-${getPriorityColor(issue.priority)}`}>
                            {issue.priority.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${getStatusColor(issue.status)}`}>
                            {issue.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{issue.reporter}</td>
                        <td>{issue.createdAt}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setSelectedIssue(issue)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No issues found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedIssue && (
              <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{selectedIssue.title}</h2>
                    <button className="close-btn" onClick={() => setSelectedIssue(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{selectedIssue.description}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedIssue.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Priority:</span>
                      <span className={`badge badge-${getPriorityColor(selectedIssue.priority)}`}>
                        {selectedIssue.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`badge badge-${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Reporter:</span>
                      <span className="detail-value">{selectedIssue.reporter}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Assigned To:</span>
                      <span className="detail-value">{selectedIssue.assignedTo}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{selectedIssue.createdAt}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Updated:</span>
                      <span className="detail-value">{selectedIssue.updatedAt}</span>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <select
                      defaultValue={selectedIssue.status}
                      onChange={(e) => handleUpdateIssue(selectedIssue.id, { status: e.target.value })}
                      className="form-control"
                      style={{ marginRight: '10px' }}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button className="btn btn-secondary" onClick={() => setSelectedIssue(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Errors Tab */}
        {activeTab === 'errors' && (
          <div className="tab-content">
            <div className="card">
              <h2>System Errors</h2>
              <p className="text-muted">Critical system errors and warnings</p>

              <div className="stats-summary">
                <div className="stat-box">
                  <span className="stat-label">Total Errors</span>
                  <span className="stat-value">{errors.filter(e => e.level === 'error').length}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Warnings</span>
                  <span className="stat-value">{errors.filter(e => e.level === 'warning').length}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Info</span>
                  <span className="stat-value">{errors.filter(e => e.level === 'info').length}</span>
                </div>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Level</th>
                      <th>Message</th>
                      <th>Source</th>
                      <th>Frequency</th>
                      <th>Last Occurrence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.length > 0 ? (
                      errors.map(err => (
                        <tr key={err.id}>
                          <td>{err.timestamp}</td>
                          <td>
                            <span className={`badge badge-${getErrorLevelColor(err.level)}`}>
                              {err.level.toUpperCase()}
                            </span>
                          </td>
                          <td>{err.message}</td>
                          <td>{err.source}</td>
                          <td>{err.frequency}</td>
                          <td>{err.lastOccurrence}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No errors found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Error Logs Tab */}
        {activeTab === 'logs' && (
          <div className="tab-content">
            <div className="card">
              <h2>Error Logs</h2>
              <p className="text-muted">Detailed error logs and stack traces</p>

              <div className="logs-container">
                {errors.length > 0 ? (
                  <div className="logs-list">
                    {errors.map((err, idx) => (
                      <div key={idx} className="log-entry">
                        <div className="log-header">
                          <span className={`log-level badge-${getErrorLevelColor(err.level)}`}>
                            {err.level.toUpperCase()}
                          </span>
                          <span className="log-time">{err.timestamp}</span>
                          <span className="log-source">{err.source}</span>
                        </div>
                        <div className="log-message">{err.message}</div>
                        <div className="log-trace">
                          <strong>Stack Trace:</strong>
                          <pre>{err.stackTrace}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No error logs available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TroubleshootingPage;
