import { useState, useEffect } from 'react';
import api from '../../config/api';

const Troubleshooting = ({ setSuccess, setError }) => {
  const [issues, setIssues] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);

  useEffect(() => {
    fetchTroubleshootingData();
  }, []);

  const fetchTroubleshootingData = async () => {
    try {
      setLoading(true);
      
      // Mock troubleshooting data - replace with actual API calls
      const issuesData = [
        {
          id: 1,
          title: 'Database Connection Timeout',
          description: 'Users experiencing slow database responses during peak hours',
          severity: 'high',
          status: 'open',
          category: 'database',
          reportedBy: 'admin@university.edu',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          assignedTo: 'dev-team@university.edu'
        },
        {
          id: 2,
          title: 'Email Notifications Not Sending',
          description: 'Risk alert emails are not being delivered to advisors',
          severity: 'medium',
          status: 'in_progress',
          category: 'notifications',
          reportedBy: 'advisor@university.edu',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          assignedTo: 'it-support@university.edu'
        },
        {
          id: 3,
          title: 'UI Loading Issues',
          description: 'Dashboard taking too long to load on mobile devices',
          severity: 'low',
          status: 'resolved',
          category: 'frontend',
          reportedBy: 'student@university.edu',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          resolvedAt: new Date(Date.now() - 3600000 * 12).toISOString()
        }
      ];

      const ticketsData = [
        {
          id: 1,
          ticketNumber: 'TS-001',
          subject: 'Cannot login to system',
          description: 'Getting authentication error when trying to login',
          priority: 'high',
          status: 'open',
          category: 'authentication',
          requester: 'john.doe@university.edu',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          assignedTo: 'it-support@university.edu'
        },
        {
          id: 2,
          ticketNumber: 'TS-002',
          subject: 'Risk assessment not updating',
          description: 'Student risk levels not updating after questionnaire completion',
          priority: 'medium',
          status: 'in_progress',
          category: 'functionality',
          requester: 'advisor@university.edu',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          assignedTo: 'dev-team@university.edu'
        }
      ];

      setIssues(issuesData);
      setTickets(ticketsData);
    } catch (error) {
      setError('Failed to fetch troubleshooting data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (issueData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newIssue = {
        id: issues.length + 1,
        ...issueData,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      setIssues([newIssue, ...issues]);
      setSuccess('Issue created successfully');
      setShowIssueForm(false);
    } catch (error) {
      setError('Failed to create issue');
    }
  };

  const handleAssignIssue = async (issueId, assignee) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, assignedTo: assignee } : issue
      ));
      setSuccess('Issue assigned successfully');
    } catch (error) {
      setError('Failed to assign issue');
    }
  };

  const handleResolveIssue = async (issueId) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: 'resolved', resolvedAt: new Date().toISOString() } : issue
      ));
      setSuccess('Issue resolved successfully');
    } catch (error) {
      setError('Failed to resolve issue');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-900 text-blue-200',
      medium: 'bg-yellow-900 text-yellow-200',
      high: 'bg-red-900 text-red-200'
    };
    return colors[severity] || 'bg-gray-900 text-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-900 text-red-200',
      in_progress: 'bg-yellow-900 text-yellow-200',
      resolved: 'bg-green-900 text-green-200'
    };
    return colors[status] || 'bg-gray-900 text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading troubleshooting data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Troubleshooting & Support</h2>
        <button
          onClick={() => setShowIssueForm(!showIssueForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
        >
          + Report Issue
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Open Issues</h3>
          <div className="text-3xl font-bold text-red-400">
            {issues.filter(i => i.status === 'open').length}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">In Progress</h3>
          <div className="text-3xl font-bold text-yellow-400">
            {issues.filter(i => i.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Resolved Today</h3>
          <div className="text-3xl font-bold text-green-400">3</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active Tickets</h3>
          <div className="text-3xl font-bold text-blue-400">{tickets.length}</div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">System Issues</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {issue.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {issue.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {issue.reportedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {issue.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {issue.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveIssue(issue.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Resolve
                        </button>
                      )}
                      <button className="text-blue-400 hover:text-blue-300">
                        Assign
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Support Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket #</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {ticket.ticketNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {ticket.requester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        View
                      </button>
                      <button className="text-green-400 hover:text-green-300">
                        Respond
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        Escalate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Issue Form */}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Report System Issue</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateIssue({
                title: e.target.title.value,
                description: e.target.description.value,
                severity: e.target.severity.value,
                category: e.target.category.value,
                reportedBy: 'admin@university.edu'
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Issue Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Severity</label>
                  <select name="severity" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select name="category" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                    <option value="database">Database</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="notifications">Notifications</option>
                    <option value="authentication">Authentication</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowIssueForm(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Report Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Troubleshooting;
