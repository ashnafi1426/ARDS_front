import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSendForm, setShowSendForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient: 'all',
    priority: 'normal'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/notifications');
      if (response.data.status === 'success') {
        setNotifications(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/notifications/send', formData);
      if (response.data.status === 'success') {
        setNotifications([response.data.data, ...notifications]);
        setFormData({ title: '', message: '', recipient: 'all', priority: 'normal' });
        setShowSendForm(false);
      }
    } catch (err) {
      setError('Failed to send notification');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/admin/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const filteredNotifications = filterStatus === 'all'
    ? notifications
    : notifications.filter(n => n.status === filterStatus);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Send and manage system notifications</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setShowSendForm(!showSendForm)}>
          {showSendForm ? 'Cancel' : '+ Send Notification'}
        </button>
      </div>

      {showSendForm && (
        <div className="form-card">
          <h2>Send New Notification</h2>
          <form onSubmit={handleSendNotification}>
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
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Recipient</label>
              <select
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="advisors">Advisors Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">Send Notification</button>
          </form>
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Sent</span>
          <span className="stat-value">{notifications.filter(n => n.status === 'sent').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{notifications.filter(n => n.status === 'pending').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Failed</span>
          <span className="stat-value">{notifications.filter(n => n.status === 'failed').length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Recipient</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Sent Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <tr key={notification.id}>
                  <td>{notification.title}</td>
                  <td>{notification.recipient}</td>
                  <td><span className={`badge badge-${notification.priority}`}>{notification.priority}</span></td>
                  <td><span className={`badge badge-${notification.status}`}>{notification.status}</span></td>
                  <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                  <td>
                    {!notification.read && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark Read
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No notifications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsPage;
