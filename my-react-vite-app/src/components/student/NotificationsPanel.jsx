import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

const NotificationsPanel = ({ notifications, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async (notificationId) => {
    try {
      setLoading(true);
      await api.patch(`/notifications/${notificationId}/read`);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      setLoading(true);
      await api.delete(`/notifications/${notificationId}`);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      risk_alert: '🚨',
      assignment: '📚',
      grade: '📊',
      meeting: '👨‍🏫',
      reminder: '⏰',
      announcement: '📢',
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️',
      system: '⚙️',
      general: '📢',
      intervention: '🎯'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      risk_alert: '#f44336',
      assignment: '#2196f3',
      grade: '#4caf50',
      meeting: '#9c27b0',
      reminder: '#ff9800',
      announcement: '#00bcd4',
      success: '#4caf50',
      warning: '#ff9800',
      info: '#2196f3',
      system: '#607d8b',
      general: '#00bcd4',
      intervention: '#9c27b0'
    };
    return colors[type] || '#757575';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notifications-panel">
      {notifications && notifications.length > 0 ? (
        <div className="notification-list">
          {notifications.map(notification => {
            // Handle both camelCase and snake_case
            const isUnread = !(notification.is_read || notification.isRead);
            const notifType = notification.notification_type || notification.type || 'general';
            const createdAt = notification.created_at || notification.createdAt;
            
            console.log('🔔 Rendering notification:', {
              id: notification.id,
              title: notification.title,
              type: notifType,
              isUnread,
              createdAt
            });
            
            return (
              <div 
                key={notification.id}
                className={`notification-item ${isUnread ? 'unread' : ''}`}
                style={{
                  padding: '0.75rem',
                  borderLeft: `3px solid ${getNotificationColor(notifType)}`,
                  backgroundColor: isUnread ? '#f0f7ff' : '#f9f9f9',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {getNotificationIcon(notifType)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '0.9rem',
                      color: '#333',
                      fontWeight: '600'
                    }}>
                      {notification.title}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.85rem',
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#999'
                    }}>
                      <span>{formatTimeAgo(createdAt)}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={loading}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#2196f3',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              textDecoration: 'underline'
                            }}
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          disabled={loading}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-data" style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem', 
          color: '#999' 
        }}>
          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>🔔</p>
          <p style={{ margin: 0 }}>No notifications</p>
        </div>
      )}
    </div>
  );
};

NotificationsPanel.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    notification_type: PropTypes.string,
    is_read: PropTypes.bool,
    created_at: PropTypes.string
  })),
  onRefresh: PropTypes.func
};

NotificationsPanel.defaultProps = {
  notifications: []
};

export default NotificationsPanel;
