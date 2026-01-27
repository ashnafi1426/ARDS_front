import { useState } from 'react';

const RiskMonitoringReports = () => {
  const [riskData] = useState({
    totalStudents: 450,
    lowRisk: 180,
    mediumRisk: 150,
    highRisk: 90,
    criticalRisk: 30,
    interventionSuccess: 78,
    averageRiskScore: 2.4
  });

  const [students] = useState([
    { id: 1, name: 'Bob Wilson', riskLevel: 'critical', riskScore: 3.8, gpa: 2.0, attendance: '45%', interventions: 3, lastIntervention: '2024-01-20' },
    { id: 2, name: 'David Miller', riskLevel: 'high', riskScore: 3.2, gpa: 2.5, attendance: '65%', interventions: 2, lastIntervention: '2024-01-18' },
    { id: 3, name: 'Carol Davis', riskLevel: 'medium', riskScore: 2.1, gpa: 3.2, attendance: '80%', interventions: 1, lastIntervention: '2024-01-15' },
    { id: 4, name: 'Eve Taylor', riskLevel: 'high', riskScore: 3.5, gpa: 2.3, attendance: '60%', interventions: 2, lastIntervention: '2024-01-19' }
  ]);

  const [filterRisk, setFilterRisk] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    reportType: 'student',
    format: 'pdf',
    includeHistory: true,
    includeRecommendations: true
  });

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    alert(`Report generated: ${reportFormData.reportType} report in ${reportFormData.format.toUpperCase()} format`);
    setShowReportModal(false);
  };

  const handleDownloadReport = (type) => {
    alert(`Downloading ${type} report...`);
  };

  const filteredStudents = filterRisk === 'all'
    ? students
    : students.filter(s => s.riskLevel === filterRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Risk Monitoring & Reports</h2>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          + Generate Report
        </button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Total Students</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{riskData.totalStudents}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Low Risk</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{riskData.lowRisk}</p>
          <p className="text-xs text-gray-500 mt-2">{((riskData.lowRisk / riskData.totalStudents) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">High Risk</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{riskData.highRisk}</p>
          <p className="text-xs text-gray-500 mt-2">{((riskData.highRisk / riskData.totalStudents) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Critical Risk</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{riskData.criticalRisk}</p>
          <p className="text-xs text-gray-500 mt-2">{((riskData.criticalRisk / riskData.totalStudents) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Low Risk</p>
              <p className="text-sm font-bold text-gray-900">{riskData.lowRisk} students</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: `${(riskData.lowRisk / riskData.totalStudents) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Medium Risk</p>
              <p className="text-sm font-bold text-gray-900">{riskData.mediumRisk} students</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-yellow-500"
                style={{ width: `${(riskData.mediumRisk / riskData.totalStudents) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">High Risk</p>
              <p className="text-sm font-bold text-gray-900">{riskData.highRisk} students</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-orange-500"
                style={{ width: `${(riskData.highRisk / riskData.totalStudents) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Critical Risk</p>
              <p className="text-sm font-bold text-gray-900">{riskData.criticalRisk} students</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-red-500"
                style={{ width: `${(riskData.criticalRisk / riskData.totalStudents) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Risk Level</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Risk Score (High to Low)</option>
              <option>Risk Score (Low to High)</option>
              <option>GPA (High to Low)</option>
              <option>Attendance (High to Low)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Export</label>
            <button
              onClick={() => handleDownloadReport('CSV')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Export as CSV
            </button>
          </div>
        </div>
      </div>

      {/* At-Risk Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">At-Risk Students ({filteredStudents.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interventions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.riskScore.toFixed(1)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.attendance}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.interventions}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.lastIntervention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h3>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportFormData.reportType}
                  onChange={(e) => setReportFormData({ ...reportFormData, reportType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="student">Student Report</option>
                  <option value="cohort">Cohort Report</option>
                  <option value="intervention">Intervention Report</option>
                  <option value="system">System Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
                <select
                  value={reportFormData.format}
                  onChange={(e) => setReportFormData({ ...reportFormData, format: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportFormData.includeHistory}
                    onChange={(e) => setReportFormData({ ...reportFormData, includeHistory: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include History</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportFormData.includeRecommendations}
                    onChange={(e) => setReportFormData({ ...reportFormData, includeRecommendations: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Recommendations</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMonitoringReports;
