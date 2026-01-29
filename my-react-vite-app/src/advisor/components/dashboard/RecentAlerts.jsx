import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiAlertTriangle, FiInfo, FiCheckCircle, FiClock } from 'react-icons/fi';

const RecentAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'risk_increase',
      title: 'Risk Score Increased',
      message: 'John Doe\'s risk score increased to 85 (Critical)',
      studentId: 'STU001',
      studentName: 'John Doe',
      timestamp: '2024-01-29T10:30:00Z',
      priority: 'high',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'assessment_overdue',
      title: 'Assessment Overdue',
      message: 'Sarah Johnson has not completed weekly self-assessment',
      studentId: 'STU002',
      studentName: 'Sarah Johnson',
      timestamp: '2024-01-29T09:15:00Z',
      priority: 'medium',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      type: 'intervention_success',
      title: 'Intervention Update',
      message: 'Mike Chen responded positively to tutoring recommendation',
      studentId: 'STU003',
      studentName: 'Mike Chen',
      timestamp: '2024-01-28T16:45:00Z',
      priority: 'low',
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: 'system_notification',
      title: 'Weekly Report Ready',
      message: 'Your weekly advisor report is now available',
      studentId: null,
      studentName: null,
      timestamp: '2024-01-28T08:00:00Z',
      priority: 'low',
      read: true,
      actionRequired: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'risk_increase': return FiAlertTriangle;
      case 'assessment_overdue': return FiClock;
      case 'intervention_success': return FiCheckCircle;
      case 'system_notification': return FiInfo;
      default: return FiBell;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleAlertClick = (alert) => {
    if (alert.studentId) {
      navigate(`/advisor/students/${alert.studentId}`);
    } else if (alert.type === 'system_notification') {
      navigate('/advisor/reports');
    }
    
    // Mark as read
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? { ...a, read: true } : a
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <FiBell className="w-5 h-5" />
          <span>Recent Alerts</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button 
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
          )}
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate('/advisor/alerts')}
          >
            View All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <FiBell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent alerts</p>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert) => {
            const Icon = getAlertIcon(alert.type);
            
            return (
              <div 
                key={alert.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  !alert.read 
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex-shrink-0">
                  <Icon className={`w-5 h-5 ${getPriorityColor(alert.priority)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${!alert.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {alert.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  
                  {alert.studentName && (
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="text-xs text-gray-500">Student:</span>
                      <span className="text-xs font-medium text-gray-700">{alert.studentName}</span>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center space-x-1">
                  {!alert.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  {alert.actionRequired && (
                    <FiAlertTriangle className="w-4 h-4 text-orange-500" title="Action Required" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button 
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate('/advisor/alerts')}
          >
            View {alerts.length - 5} more alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;