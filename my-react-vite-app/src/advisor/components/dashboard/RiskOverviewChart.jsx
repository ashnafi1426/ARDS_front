import { useState } from 'react';

const RiskOverviewChart = () => {
  const [timeframe, setTimeframe] = useState('week');

  // Mock data for risk distribution
  const riskData = {
    week: {
      low: 15,
      medium: 6,
      high: 2,
      critical: 1
    },
    month: {
      low: 18,
      medium: 4,
      high: 1,
      critical: 1
    },
    semester: {
      low: 20,
      medium: 3,
      high: 1,
      critical: 0
    }
  };

  const currentData = riskData[timeframe];
  const total = Object.values(currentData).reduce((sum, val) => sum + val, 0);

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      case 'critical': return 'bg-red-700';
      default: return 'bg-gray-400';
    }
  };

  const getRiskPercentage = (value) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        {/* Chart Visualization */}
        <div className="flex-1">
          <div className="relative w-48 h-48 mx-auto">
            <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="16"
              />
              {/* Simple progress ring for visualization */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="16"
                strokeDasharray={`${(currentData.low / total) * 502} 502`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Legend */}
        <div className="flex-1 space-y-3">
          {Object.entries(currentData).map(([level, count]) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(level)}`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {level}
                </span>
              </div>
              <div className="text-sm text-gray-900 font-medium">
                {count} ({getRiskPercentage(count)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">At Risk Students:</span>
          <span className="font-semibold text-red-600">
            {currentData.high + currentData.critical} of {total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskOverviewChart;