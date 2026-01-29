import { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiInfo } from 'react-icons/fi';

const StudentRiskHistory = ({ studentId }) => {
  const [timeframe, setTimeframe] = useState('3months');

  // Mock risk history data
  const riskHistory = [
    {
      date: '2024-01-29',
      riskScore: 85,
      riskLevel: 'critical',
      factors: ['Low GPA: 1.8', 'Poor Attendance: 45%', 'Missing Assignments: 5'],
      trigger: 'Self-assessment submission'
    },
    {
      date: '2024-01-22',
      riskScore: 78,
      riskLevel: 'high',
      factors: ['Low GPA: 1.9', 'Poor Attendance: 52%', 'Missing Assignments: 3'],
      trigger: 'Weekly calculation'
    },
    {
      date: '2024-01-15',
      riskScore: 72,
      riskLevel: 'high',
      factors: ['Low GPA: 2.1', 'Poor Attendance: 58%', 'Stress Level: High'],
      trigger: 'Self-assessment submission'
    },
    {
      date: '2024-01-08',
      riskScore: 65,
      riskLevel: 'medium',
      factors: ['Low GPA: 2.2', 'Poor Attendance: 65%', 'Financial Concerns'],
      trigger: 'Weekly calculation'
    },
    {
      date: '2024-01-01',
      riskScore: 58,
      riskLevel: 'medium',
      factors: ['Low GPA: 2.3', 'Attendance: 70%', 'Course Difficulty'],
      trigger: 'Semester start'
    }
  ];

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (current, previous) => {
    if (!previous) return <FiMinus className="trend-icon neutral" />;
    
    if (current > previous) {
      return <FiTrendingUp className="trend-icon increasing" />;
    } else if (current < previous) {
      return <FiTrendingDown className="trend-icon decreasing" />;
    } else {
      return <FiMinus className="trend-icon stable" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentRisk = riskHistory[0];
  const previousRisk = riskHistory[1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Risk History</h3>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Current Risk Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-gray-900">{currentRisk.riskScore}</span>
              </div>
              <span className="text-sm text-gray-600">Risk Score</span>
            </div>
            <div className="space-y-2">
              <div>
                <span 
                  className="inline-flex px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: getRiskColor(currentRisk.riskLevel), color: 'white' }}
                >
                  {currentRisk.riskLevel?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getTrendIcon(currentRisk.riskScore, previousRisk?.riskScore)}
                <span>
                  {previousRisk ? 
                    `${currentRisk.riskScore > previousRisk.riskScore ? '+' : ''}${currentRisk.riskScore - previousRisk.riskScore} from last week`
                    : 'No previous data'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Current Risk Factors</h4>
          <div className="space-y-2">
            {currentRisk.factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <FiInfo className="w-4 h-4 text-gray-400" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk History Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Score Trend</h4>
        <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
          <svg width="100%" height="200" viewBox="0 0 600 200">
            {/* Chart grid lines */}
            <defs>
              <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Risk level zones */}
            <rect x="0" y="0" width="600" height="50" fill="#dc2626" fillOpacity="0.1" />
            <rect x="0" y="50" width="600" height="50" fill="#ef4444" fillOpacity="0.1" />
            <rect x="0" y="100" width="600" height="50" fill="#f59e0b" fillOpacity="0.1" />
            <rect x="0" y="150" width="600" height="50" fill="#10b981" fillOpacity="0.1" />
            
            {/* Risk score line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={riskHistory.reverse().map((point, index) => {
                const x = (index / (riskHistory.length - 1)) * 580 + 10;
                const y = 190 - (point.riskScore / 100) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {riskHistory.map((point, index) => {
              const x = (index / (riskHistory.length - 1)) * 580 + 10;
              const y = 190 - (point.riskScore / 100) * 180;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={getRiskColor(point.riskLevel)}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm text-gray-600">Critical (80-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">High (60-79)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Medium (40-59)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Low (0-39)</span>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment Timeline</h4>
        <div className="space-y-4">
          {riskHistory.reverse().map((entry, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: getRiskColor(entry.riskLevel) }}
                ></div>
                {index < riskHistory.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{formatDate(entry.date)}</span>
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: getRiskColor(entry.riskLevel) }}
                  >
                    Score: {entry.riskScore}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-500">{entry.trigger}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {entry.factors.map((factor, factorIndex) => (
                    <span key={factorIndex} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentRiskHistory;