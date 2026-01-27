import { useState, useEffect } from 'react';

const SecurityCompliance = ({ setSuccess, setError }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('audit');
  
  // Search state
  const [auditSearchInput, setAuditSearchInput] = useState('');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  const applyAuditSearch = () => setAuditSearchQuery(auditSearchInput.trim());
  const clearAuditSearch = () => { setAuditSearchInput(''); setAuditSearchQuery(''); };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in production replace with api.get('/admin/security/audit-logs'), etc.
      const auditLogsData = [
        { id: 1, action: 'User Login', user: 'admin@university.edu', timestamp: new Date().toISOString(), ipAddress: '192.168.1.100', status: 'success', details: 'Admin login from office network' },
        { id: 2, action: 'Role Change', user: 'admin@university.edu', timestamp: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.100', status: 'success', details: 'Changed user role for john.doe@university.edu' },
        { id: 3, action: 'Failed Login', user: 'unknown@university.edu', timestamp: new Date(Date.now() - 7200000).toISOString(), ipAddress: '192.168.1.200', status: 'failed', details: 'Invalid credentials provided' }
      ];

      const policiesData = [
        { id: 1, name: 'Data Retention Policy', type: 'privacy', status: 'active', compliance: 95, description: 'Student data retention and deletion procedures' },
        { id: 2, name: 'Access Control Policy', type: 'security', status: 'active', compliance: 100, description: 'Role-based access control and permission management' }
      ];

      const reportsData = [
        { id: 1, name: 'GDPR Compliance Assessment', type: 'privacy', generatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'compliant', score: 94, issues: 2 },
        { id: 2, name: 'Security Audit Report', type: 'security', generatedAt: new Date(Date.now() - 86400000 * 14).toISOString(), status: 'partial', score: 87, issues: 5 }
      ];

      setAuditLogs(auditLogsData);
      setPolicies(policiesData);
      setComplianceReports(reportsData);
    } catch (error) {
      setError('Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-900 text-green-200',
      failed: 'bg-red-900 text-red-200',
      active: 'bg-green-900 text-green-200',
      compliant: 'bg-green-900 text-green-200',
      partial: 'bg-yellow-900 text-yellow-200'
    };
    return colors[status] || 'bg-gray-800 text-gray-400';
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = !auditSearchQuery || 
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) || 
      log.user.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading security data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Security & Compliance</h2>
        <button onClick={() => setSuccess('Logs exported')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider">
          Export Audit Logs
        </button>
      </div>

      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {['audit', 'policies', 'compliance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Forensic Audit Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-10 relative">
                <input
                  type="search"
                  placeholder="Search audit trail by action, user, or IP..."
                  value={auditSearchInput}
                  onChange={(e) => setAuditSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyAuditSearch()}
                  className="w-full pl-4 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {auditSearchInput && (
                  <button onClick={clearAuditSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">✕</button>
                )}
              </div>
              <div className="md:col-span-2">
                <button onClick={applyAuditSearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest">
                  Verify
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${getStatusColor(log.status)}`}>{log.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map(policy => (
            <div key={policy.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-white">{policy.name}</h4>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${getStatusColor(policy.status)}`}>{policy.status}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{policy.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Compliance Score</span>
                <span className="text-2xl font-black text-green-400">{policy.compliance}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {complianceReports.map(report => (
                <tr key={report.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-bold">{report.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(report.generatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 uppercase text-[10px] font-bold"><span className={getStatusColor(report.status)}>{report.status}</span></td>
                  <td className="px-6 py-4 text-lg font-black text-blue-400">{report.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityCompliance;
