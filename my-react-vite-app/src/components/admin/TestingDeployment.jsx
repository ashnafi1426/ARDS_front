import { useState, useEffect } from 'react';
import api from '../../config/api';

const TestingDeployment = ({ setSuccess, setError }) => {
  const [testResults, setTestResults] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showDeploymentForm, setShowDeploymentForm] = useState(false);

  // Search Logic
  const [testSearchInput, setTestSearchInput] = useState('');
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [deploySearchInput, setDeploySearchInput] = useState('');
  const [deploySearchQuery, setDeploySearchQuery] = useState('');

  const applyTestSearch = () => setTestSearchQuery(testSearchInput.trim());
  const clearTestSearch = () => { setTestSearchInput(''); setTestSearchQuery(''); };

  const applyDeploySearch = () => setDeploySearchQuery(deploySearchInput.trim());
  const clearDeploySearch = () => { setDeploySearchInput(''); setDeploySearchQuery(''); };

  useEffect(() => {
    fetchTestingData();
  }, []);

  const fetchTestingData = async () => {
    try {
      setLoading(true);

      // Mock testing data - replace with actual API calls
      const testResultsData = [
        {
          id: 1,
          name: 'User Authentication Flow',
          type: 'integration',
          status: 'passed',
          duration: '2m 15s',
          passed: 15,
          failed: 0,
          total: 15,
          executedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          executedBy: 'qa-team@university.edu'
        },
        {
          id: 2,
          name: 'Risk Assessment Algorithm',
          type: 'unit',
          status: 'failed',
          duration: '45s',
          passed: 8,
          failed: 2,
          total: 10,
          executedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          executedBy: 'dev-team@university.edu'
        },
        {
          id: 3,
          name: 'Email Notification System',
          type: 'e2e',
          status: 'passed',
          duration: '5m 30s',
          passed: 12,
          failed: 0,
          total: 12,
          executedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          executedBy: 'qa-team@university.edu'
        }
      ];

      const deploymentsData = [
        {
          id: 1,
          version: 'v2.1.0',
          environment: 'staging',
          status: 'completed',
          deployedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          deployedBy: 'devops@university.edu',
          rollbackAvailable: true,
          features: ['Enhanced risk algorithm', 'New dashboard UI', 'Performance improvements']
        },
        {
          id: 2,
          version: 'v2.0.5',
          environment: 'production',
          status: 'active',
          deployedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
          deployedBy: 'devops@university.edu',
          rollbackAvailable: true,
          features: ['Bug fixes', 'Security patches']
        }
      ];

      const checklistData = [
        {
          id: 1,
          category: 'Pre-deployment',
          items: [
            { id: 1, task: 'Code review completed', status: 'completed', checkedBy: 'lead-dev@university.edu' },
            { id: 2, task: 'All tests passing', status: 'completed', checkedBy: 'qa-team@university.edu' },
            { id: 3, task: 'Security scan passed', status: 'completed', checkedBy: 'security@university.edu' },
            { id: 4, task: 'Performance benchmarks met', status: 'pending', checkedBy: null }
          ]
        },
        {
          id: 2,
          category: 'Post-deployment',
          items: [
            { id: 5, task: 'Health checks passed', status: 'completed', checkedBy: 'devops@university.edu' },
            { id: 6, task: 'Smoke tests passed', status: 'pending', checkedBy: null },
            { id: 7, task: 'Monitoring enabled', status: 'completed', checkedBy: 'devops@university.edu' }
          ]
        }
      ];

      setTestResults(testResultsData);
      setDeployments(deploymentsData);
      setChecklist(checklistData);
    } catch (error) {
      setError('Failed to fetch testing data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async (testType) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess(`${testType} tests completed successfully`);
      fetchTestingData();
    } catch (error) {
      setError('Failed to run tests');
    }
  };

  const handleDeploy = async (deploymentData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      setSuccess('Deployment completed successfully');
      setShowDeploymentForm(false);
      fetchTestingData();
    } catch (error) {
      setError('Failed to deploy');
    }
  };

  const handleRollback = async (deploymentId) => {
    if (!confirm('Are you sure you want to rollback this deployment?')) return;
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess('Rollback completed successfully');
      fetchTestingData();
    } catch (error) {
      setError('Failed to rollback');
    }
  };

  const handleChecklistItem = async (itemId) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setChecklist(checklist.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed', checkedBy: item.status === 'completed' ? null : 'admin@university.edu' }
            : item
        )
      })));
      setSuccess('Checklist updated successfully');
    } catch (error) {
      setError('Failed to update checklist');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      passed: 'bg-green-900 text-green-200',
      failed: 'bg-red-900 text-red-200',
      completed: 'bg-green-900 text-green-200',
      active: 'bg-blue-900 text-blue-200',
      pending: 'bg-yellow-900 text-yellow-200'
    };
    return colors[status] || 'bg-gray-900 text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading testing data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Testing & Deployment</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTestForm(!showTestForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🧪 Run Tests
          </button>
          <button
            onClick={() => setShowDeploymentForm(!showDeploymentForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
          >
            🚀 Deploy
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Test Telemetry</h3>

          {/* Test Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-10 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search test results by name or type..."
                value={testSearchInput}
                onChange={(e) => setTestSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyTestSearch()}
                className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
              />
              {testSearchInput && (
                <button onClick={clearTestSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="md:col-span-2">
              <button onClick={applyTestSearch} className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all py-3 shadow-lg flex items-center justify-center gap-2">
                Scan
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Test Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Results</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Executed By</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {testResults
                .filter(t => !testSearchQuery || t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) || t.type.toLowerCase().includes(testSearchQuery.toLowerCase()))
                .map((test) => (
                  <tr key={test.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {test.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-200 capitalize">
                        {test.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {test.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={test.failed > 0 ? 'text-red-400' : 'text-green-400'}>
                        {test.passed}/{test.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {test.executedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          View Details
                        </button>
                        <button className="text-green-400 hover:text-green-300">
                          Re-run
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 space-y-4">
          <h3 className="text-xl font-semibold text-white">Historical Deployment Registry</h3>

          {/* Deployment Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-10 relative">
              <input
                type="search"
                placeholder="Query deployments by version or environment..."
                value={deploySearchInput}
                onChange={(e) => setDeploySearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyDeploySearch()}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
              />
              {deploySearchInput && (
                <button onClick={clearDeploySearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="md:col-span-2">
              <button onClick={applyDeploySearch} className="w-full h-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all py-2.5">
                Query Logs
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Version</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Deployed At</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Deployed By</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Features</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {deployments
                .filter(d => !deploySearchQuery || d.version.toLowerCase().includes(deploySearchQuery.toLowerCase()) || d.environment.toLowerCase().includes(deploySearchQuery.toLowerCase()))
                .map((deployment) => (
                  <tr key={deployment.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      {deployment.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-200 capitalize">
                        {deployment.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(deployment.deployedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {deployment.deployedBy}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="max-w-xs">
                        {deployment.features.slice(0, 2).join(', ')}
                        {deployment.features.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {deployment.rollbackAvailable && (
                          <button
                            onClick={() => handleRollback(deployment.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Rollback
                          </button>
                        )}
                        <button className="text-blue-400 hover:text-blue-300">
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

      {/* Deployment Checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Deployment Checklist</h3>
        <div className="space-y-6">
          {checklist.map((category) => (
            <div key={category.id}>
              <h4 className="text-lg font-medium text-white mb-4">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.status === 'completed'}
                        onChange={() => handleChecklistItem(item.id)}
                        className="mr-3"
                      />
                      <span className="text-white">{item.task}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.checkedBy && (
                        <span className="text-sm text-gray-400">
                          by {item.checkedBy}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleRunTests('unit')}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          🧪 Run Unit Tests
        </button>
        <button
          onClick={() => handleRunTests('integration')}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔗 Run Integration Tests
        </button>
        <button
          onClick={() => handleRunTests('e2e')}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🌐 Run E2E Tests
        </button>
      </div>
    </div>
  );
};

export default TestingDeployment;
