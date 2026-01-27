import { useState, useEffect } from 'react';

const NotificationsManagement = ({ setSuccess, setError }) => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    priority: ''
  });

  // Search Logic
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const applySearch = () => setSearchQuery(searchInput.trim());
  const clearSearch = () => { setSearchInput(''); setSearchQuery(''); };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Mock notifications data - replace with actual API calls
      const notificationsData = [
        {
          id: 1,
          title: 'High Risk Alert: John Smith',
          message: 'Student John Smith has been flagged as high risk due to declining GPA and poor attendance.',
          type: 'risk_alert',
          priority: 'high',
          status: 'pending',
          recipient: 'advisor@university.edu',
          createdAt: new Date().toISOString(),
          scheduledFor: new Date(Date.now() + 3600000).toISOString()
        },
        {
          id: 2,
          title: 'Weekly Risk Report',
          message: 'Attached is the weekly risk assessment report for all students.',
          type: 'report',
          priority: 'medium',
          status: 'sent',
          recipient: 'admin@university.edu',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          sentAt: new Date(Date.now() - 82800000).toISOString()
        },
        {
          id: 3,
          title: 'System Maintenance Notice',
          message: 'Scheduled system maintenance will occur tonight from 2 AM to 4 AM.',
          type: 'system',
          priority: 'low',
          status: 'scheduled',
          recipient: 'all_users',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          scheduledFor: new Date(Date.now() + 7200000).toISOString()
        }
      ];

      const templatesData = [
        {
          id: 1,
          name: 'High Risk Alert',
          type: 'risk_alert',
          subject: 'High Risk Alert: {{student_name}}',
          body: 'Student {{student_name}} has been flagged as high risk. Current GPA: {{gpa}}, Attendance: {{attendance}}%. Please review and take appropriate action.',
          variables: ['student_name', 'gpa', 'attendance'],
          isActive: true
        },
        {
          id: 2,
          name: 'Weekly Report',
          type: 'report',
          subject: 'Weekly Risk Assessment Report - {{date}}',
          body: 'Please find attached the weekly risk assessment report for {{total_students}} students. {{high_risk_count}} students require immediate attention.',
          variables: ['date', 'total_students', 'high_risk_count'],
          isActive: true
        },
        {
          id: 3,
          name: 'Welcome Email',
          type: 'welcome',
          subject: 'Welcome to the Academic Risk Management System',
          body: 'Dear {{user_name}}, welcome to the Academic Risk Management System. Your login credentials have been created. Please log in and update your profile.',
          variables: ['user_name'],
          isActive: false
        }
      ];

      setNotifications(notificationsData);
      setTemplates(templatesData);
    } catch (error) {
      setError('Failed to fetch notifications data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (notificationData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newNotification = {
        id: notifications.length + 1,
        ...notificationData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setNotifications([newNotification, ...notifications]);
      setSuccess('Notification created successfully');
      setShowCreateForm(false);
    } catch (error) {
      setError('Failed to create notification');
    }
  };

  const handleApproveNotification = async (id) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, status: 'approved' } : n
      ));
      setSuccess('Notification approved successfully');
    } catch (error) {
      setError('Failed to approve notification');
    }
  };

  const handleSendNotification = async (id) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, status: 'sent', sentAt: new Date().toISOString() } : n
      ));
      setSuccess('Notification sent successfully');
    } catch (error) {
      setError('Failed to send notification');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNotifications.length === 0) {
      setError('Please select notifications first');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNotifications(notifications.map(n =>
        selectedNotifications.includes(n.id)
          ? { ...n, status: action === 'approve' ? 'approved' : 'sent', sentAt: action === 'send' ? new Date().toISOString() : n.sentAt }
          : n
      ));
      setSuccess(`Notifications ${action}d successfully`);
      setSelectedNotifications([]);
    } catch (error) {
      setError(`Failed to ${action} notifications`);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTemplate = {
        id: templates.length + 1,
        ...templateData,
        isActive: true
      };
      setTemplates([...templates, newTemplate]);
      setSuccess('Template created successfully');
      setShowTemplateForm(false);
    } catch (error) {
      setError('Failed to create template');
    }
  };

  const handleToggleTemplate = async (id) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTemplates(templates.map(t =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ));
      setSuccess('Template updated successfully');
    } catch (error) {
      setError('Failed to update template');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-200',
      approved: 'bg-blue-900 text-blue-200',
      sent: 'bg-green-900 text-green-200',
      scheduled: 'bg-purple-900 text-purple-200',
      failed: 'bg-red-900 text-red-200'
    };
    return colors[status] || 'bg-gray-900 text-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-900 text-blue-200',
      medium: 'bg-yellow-900 text-yellow-200',
      high: 'bg-red-900 text-red-200'
    };
    return colors[priority] || 'bg-gray-900 text-gray-200';
  };

  const getTypeColor = (type) => {
    const colors = {
      risk_alert: 'bg-red-900 text-red-200',
      report: 'bg-blue-900 text-blue-200',
      system: 'bg-gray-900 text-gray-200',
      welcome: 'bg-green-900 text-green-200'
    };
    return colors[type] || 'bg-gray-900 text-gray-200';
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch &&
      (!filter.status || n.status === filter.status) &&
      (!filter.type || n.type === filter.type) &&
      (!filter.priority || n.priority === filter.priority);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Notifications & Alerts</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
          >
            + Create Notification
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {['notifications', 'templates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Professional Search & Filters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Search Notifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 lg:col-span-9 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search by title or recipient..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="md:col-span-4 lg:col-span-3">
                <button onClick={applySearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all py-2.5 shadow-lg">
                  Execute Search
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-800">
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm"
              >
                <option value="">All Types</option>
                <option value="risk_alert">Risk Alert</option>
                <option value="report">Report</option>
                <option value="system">System</option>
                <option value="welcome">Welcome</option>
              </select>
              <button
                onClick={() => { setFilter({ status: '', type: '', priority: '' }); clearSearch(); }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Clear All Criteria
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-white">{selectedNotifications.length} notification(s) selected</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('send')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Send Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Notifications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-950">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => handleSelectNotification(notification.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {notification.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {notification.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {notification.status === 'pending' && (
                            <button
                              onClick={() => handleApproveNotification(notification.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Approve
                            </button>
                          )}
                          {notification.status === 'approved' && (
                            <button
                              onClick={() => handleSendNotification(notification.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              Send
                            </button>
                          )}
                          <button className="text-yellow-400 hover:text-yellow-300">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredNotifications.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        No notifications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Notification Templates</h3>
            <button
              onClick={() => setShowTemplateForm(!showTemplateForm)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
            >
              + Create Template
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(template.type)}`}>
                      {template.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTemplate(template.id)}
                      className={`px-3 py-1 text-xs rounded ${template.isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                        }`}
                    >
                      {template.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-400">Subject:</span>
                    <p className="text-white text-sm">{template.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Body:</span>
                    <p className="text-white text-sm line-clamp-3">{template.body}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Variables:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable) => (
                        <span key={variable} className="px-2 py-1 bg-gray-800 text-xs text-blue-400 rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                    Test
                  </button>
                  <button className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Notification Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Create Notification</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateNotification({
                title: e.target.title.value,
                message: e.target.message.value,
                type: e.target.type.value,
                priority: e.target.priority.value,
                recipient: e.target.recipient.value
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select name="type" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                    <option value="risk_alert">Risk Alert</option>
                    <option value="report">Report</option>
                    <option value="system">System</option>
                    <option value="welcome">Welcome</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                  <select name="priority" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Recipient</label>
                  <input
                    type="text"
                    name="recipient"
                    placeholder="email@domain.com"
                    required
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;