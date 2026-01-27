import { useState, useEffect } from 'react';
import api from '../../config/api';

const RiskStatus = () => {
  const [riskData, setRiskData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  useEffect(() => {
    fetchRiskData();
  }, [selectedTimeRange]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      // Mock risk data - replace with actual API
      const mockRiskData = {
        currentRiskLevel: 'moderate',
        riskScore: 0.65,
        riskFactors: {
          attendance: 0.7,
          studyHours: 0.6,
          assignments: 0.8,
          participation: 0.5,
          stress: 0.8,
          sleep: 0.4,
          socialSupport: 0.7,
          financial: 0.6
        },
        recommendations: [
          'Increase study hours to at least 20 hours per week',
          'Join study groups to improve class participation',
          'Practice stress management techniques',
          'Maintain consistent sleep schedule (7-8 hours)',
          'Seek financial counseling if needed'
        ],
        lastUpdated: new Date().toISOString()
      };

      const mockHistoricalData = [
        { date: '2024-01-01', score: 0.45, level: 'low', week: 1 },
        { date: '2024-01-08', score: 0.52, level: 'low', week: 2 },
        { date: '2024-01-15', score: 0.58, level: 'moderate', week: 3 },
        { date: '2024-01-22', score: 0.65, level: 'moderate', week: 4 },
        { date: '2024-01-29', score: 0.72, level: 'high', week: 5 },
        { date: '2024-02-05', score: 0.68, level: 'moderate', week: 6 },
        { date: '2024-02-12', score: 0.62, level: 'moderate', week: 7 },
        { date: '2024-02-19', score: 0.65, level: 'moderate', week: 8 }
      ];

      setRiskData(mockRiskData);
      setHistoricalData(mockHistoricalData);
    } catch (error) {
      console.error('Failed to fetch risk data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      low: 'text-green-400 bg-green-900/20 border-green-800',
      moderate: 'text-yellow-400 bg-yellow-900/20 border-yellow-800',
      high: 'text-red-400 bg-red-900/20 border-red-800'
    };
    return colors[level] || 'text-gray-400 bg-gray-900/20 border-gray-800';
  };

  const getRiskProgressColor = (score) => {
    if (score < 0.4) return 'bg-green-500';
    if (score < 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFactorColor = (score) => {
    if (score < 0.4) return 'bg-green-500';
    if (score < 0.6) return 'bg-yellow-500';
    if (score < 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading risk status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Risk Status</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      {/* Current Risk Score */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Current Risk Assessment</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getRiskColor(riskData.currentRiskLevel).split(' ')[0]}`}>
              {(riskData.riskScore * 100).toFixed(0)}%
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium mt-2 ${getRiskColor(riskData.currentRiskLevel)}`}>
              {riskData.currentRiskLevel.toUpperCase()} RISK
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-6">
              <div 
                className={`h-6 rounded-full transition-all duration-500 ${getRiskProgressColor(riskData.riskScore)}`}
                style={{ width: `${riskData.riskScore * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Low Risk (0-40%)</span>
              <span>Moderate (40-70%)</span>
              <span>High (70-100%)</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Last updated: {new Date(riskData.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Risk Factors */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Risk Factors Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(riskData.riskFactors || {}).map(([factor, score]) => (
            <div key={factor} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <span className="text-gray-300 capitalize block mb-2">
                  {factor.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getFactorColor(score)}`}
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-400 w-12 text-right ml-4">
                {(score * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Trends */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Risk Score Trends</h3>
        <div className="space-y-3">
          {historicalData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-gray-400 w-16 text-sm">
                Week {data.week}
              </span>
              <span className="text-gray-400 w-24 text-sm">
                {new Date(data.date).toLocaleDateString()}
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${getRiskProgressColor(data.score)}`}
                  style={{ width: `${data.score * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-300 w-16 text-right text-sm">
                {(data.score * 100).toFixed(0)}%
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(data.level)}`}>
                {data.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Personalized Recommendations</h3>
        <div className="space-y-3">
          {riskData.recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
              <span className="text-green-400 mt-1">✓</span>
              <span className="text-gray-300">{recommendation}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Detailed Action Plan
          </button>
        </div>
      </div>

      {/* Risk Level Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`border rounded-xl p-4 ${getRiskColor('low')}`}>
          <h4 className="font-semibold text-green-400 mb-2">Low Risk</h4>
          <p className="text-sm text-gray-300">
            Good academic standing. Continue current habits and regular assessments.
          </p>
        </div>
        <div className={`border rounded-xl p-4 ${getRiskColor('moderate')}`}>
          <h4 className="font-semibold text-yellow-400 mb-2">Moderate Risk</h4>
          <p className="text-sm text-gray-300">
            Some concerns identified. Follow recommendations and consider advisor consultation.
          </p>
        </div>
        <div className={`border rounded-xl p-4 ${getRiskColor('high')}`}>
          <h4 className="font-semibold text-red-400 mb-2">High Risk</h4>
          <p className="text-sm text-gray-300">
            Immediate attention required. Schedule meeting with advisor and implement action plan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskStatus;