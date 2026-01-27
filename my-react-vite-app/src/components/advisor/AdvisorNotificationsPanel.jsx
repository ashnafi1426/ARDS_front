import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

const AdvisorNotificationsPanel = ({ notifications = [], onRefresh, compact = false }) => {
  const [markingId, setMarkingId] = useState(null);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      setMarkingId(id);
      await api.patch(`/notifications/${id}/read`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setMarkingId(null);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'risk_alert': return '🚨';
      case 'student_update': return '📊';
      case 'meeting': return '📅';
      case 'system': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <span className="text-3xl mb-2">🔕</span>
        <p className="text-sm font-medium">No new notifications</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${compact ? 'max-h-[400px] overflow-y-auto pr-2' : ''}`}>
      {notifications.map((notif) => {
        const type = notif.type || notif.notification_type || 'system';
        const isRead = notif.isRead || notif.is_read;
        const date = notif.createdAt || notif.created_at;
        const isActionable = !isRead;

        return (
          <div
            key={notif.id}
            className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${isRead
                ? 'bg-white border-gray-100 opacity-75'
                : 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50'
              }`}
          >
            <div className="flex gap-4">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${type === 'risk_alert' ? 'bg-red-100 text-red-600' :
                  type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                <span className="text-lg">{getIcon(type)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold truncate pr-2 ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {getTimeAgo(date)}
                  </span>
                </div>

                <p className={`text-sm mt-1 line-clamp-2 ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notif.message}
                </p>

                {isActionable && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      disabled={markingId === notif.id}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {markingId === notif.id ? 'Marking...' : 'Mark as Read'}
                    </button>
                    {/* Add more actions based on type if needed */}
                  </div>
                )}
              </div>
            </div>
            {!isRead && (
              <div className="absolute top-4 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

AdvisorNotificationsPanel.propTypes = {
  notifications: PropTypes.array,
  onRefresh: PropTypes.func,
  compact: PropTypes.bool
};

export default AdvisorNotificationsPanel;
