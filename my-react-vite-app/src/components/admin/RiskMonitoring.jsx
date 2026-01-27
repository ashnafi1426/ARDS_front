import { useState } from 'react';

const RiskMonitoring = () => {
  const [riskData] = useState({
    lowRisk: 320,
    mediumRisk: 94,
    highRisk: 25,
    criticalRisk: 15
  });

  const [trends] = useState([
    { week: 'Week 1', low: 300, medium: 80, high: 20, critical: 10 },
    { week: 'Week 2', low: 310, medium: 85, high: 22, critical: 12 },
    { week: 'Week 3', low: 320, medium: 90, high: 24, critical: 14 },
    { week: 'Week 4', low: 320, medium: 94, high: 25, critical: 15 }
  ]);

  const [highRiskStudents] = useState([
    { id: 1, name: 'Student A', riskScore: 85, factors: ['Low Attendance', 'Poor GPA'], lastAssessment: '2024-01-20' },
    { id: 2, name: 'Student B', riskScore: 78, factors: ['High Stress', 'Low Engagement'], lastAssessment: '2024-01-19' },
    { id: 3, name: 'Student C', riskScore: 72, factors: ['Financial Issues', 'Family Problems'], lastAssessment: '2024-01-18' }
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Risk Monitoring & Reports</h1>
        <p className="text-gray-600 mt-2">Monitor risk trends and generate reports</p>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RiskCard label="Low Risk" value={riskData.lowRisk} color="green" />
        <RiskCard label="Medium Risk" value={riskData.mediumRisk} color="yellow" />
        <RiskCard label="High Risk" value={riskData.highRisk} color="orange" />
        <RiskCard label="Critical Risk" value={riskData.criticalRisk} color="red" />
      </div>

      {/* Risk Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Trends (Last 4 Weeks)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Period</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Low Risk</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Medium Risk</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">High Risk</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Critical Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trends.map((trend, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{trend.week}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-semibold">{trend.low}</td>
                  <td className="px-6 py-4 text-sm text-yellow-600 font-semibold">{trend.medium}</td>
                  <td className="px-6 py-4 text-sm text-orange-600 font-semibold">{trend.high}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">{trend.critical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High Risk Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">High Risk Students</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            📊 Generate Report
          </button>
        </div>
        <div className="space-y-4">
          {highRiskStudents.map(student => (
            <div key={student.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">Last Assessment: {student.lastAssessment}</p>
                </div>
                <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg">
                  Risk Score: {student.riskScore}%
                </span>
              </div>
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">Risk Factors:</p>
                <div className="flex flex-wrap gap-2">
                  {student.factors.map((factor, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Details</button>
                <button className="text-green-600 hover:text-green-800 font-medium text-sm">Assign Intervention</button>
                <button className="text-orange-600 hover:text-orange-800 font-medium text-sm">Contact Advisor</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReportButton title="System-Wide Risk Report" icon="📊" />
          <ReportButton title="Advisor Performance Report" icon="👨‍🏫" />
          <ReportButton title="Intervention Outcomes Report" icon="📈" />
        </div>
      </div>
    </div>
  );
};

const RiskCard = ({ label, value, color }) => {
  const colors = {
    green: 'bg-green-50 border-l-green-500 text-green-700',
    yellow: 'bg-yellow-50 border-l-yellow-500 text-yellow-700',
    orange: 'bg-orange-50 border-l-orange-500 text-orange-700',
    red: 'bg-red-50 border-l-red-500 text-red-700'
  };

  return (
    <div className={`${colors[color]} border-l-4 rounded-lg p-6`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

const ReportButton = ({ title, icon }) => (
  <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200">
    <span className="text-2xl">{icon}</span>
    <span className="text-left">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-600">Download</p>
    </span>
  </button>
);

export default RiskMonitoring;
