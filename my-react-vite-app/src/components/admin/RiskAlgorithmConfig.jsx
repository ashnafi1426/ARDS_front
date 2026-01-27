import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

const RiskAlgorithmConfig = ({ onRefresh }) => {
  const [config, setConfig] = useState({
    gpaWeight: 0.35,
    attendanceWeight: 0.30,
    assignmentWeight: 0.25,
    behaviorWeight: 0.10,
    gpaThresholds: {
      critical: 2.0,
      high: 2.5,
      medium: 3.0
    },
    attendanceThresholds: {
      critical: 60,
      high: 70,
      medium: 80
    },
    assignmentThresholds: {
      critical: 50,
      high: 65,
      medium: 80
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.get('/admin/risk-config');
      if (response.data.config) {
        setConfig(response.data.config);
      }
    } catch (error) {
      console.log('Using default config', error);
      // Don't show error to user for default fallback, but log it
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMsg('');
      setErrorMsg('');

      await api.put('/admin/risk-config', config);
      setSuccessMsg('Configuration saved successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Save error:', error);
      setErrorMsg('Error saving configuration: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = (key, value) => {
    const newValue = parseFloat(value);
    setConfig(prev => ({ ...prev, [key]: newValue }));
  };

  const handleThresholdChange = (category, level, value) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [level]: parseFloat(value)
      }
    }));
  };

  const totalWeight = (config.gpaWeight || 0) + (config.attendanceWeight || 0) + (config.assignmentWeight || 0) + (config.behaviorWeight || 0);
  const isValidWeight = Math.abs(totalWeight - 1.0) < 0.01;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-blue-900 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 rounded-xl shadow-sm border border-blue-700 overflow-hidden text-white">
      <div className="px-6 py-5 border-b border-blue-700 bg-blue-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Risk Algorithm Configuration</h3>
          <p className="text-sm text-blue-200 mt-1">Adjust weights and thresholds for risk calculation</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!isValidWeight || saving}
          className={`px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${!isValidWeight || saving
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-400 text-white'
            }`}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Messages */}
        {successMsg && (
          <div className="bg-green-600/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg flex items-center animate-fade-in">
            ✅ <span className="ml-2 font-medium">{successMsg}</span>
          </div>
        )}

        {(!isValidWeight || errorMsg) && (
          <div className="bg-red-600/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg flex items-center animate-fade-in">
            ⚠️ <span className="ml-2 font-medium">
              {errorMsg || `Total weight must equal 1.0 (currently: ${totalWeight.toFixed(2)})`}
            </span>
          </div>
        )}

        {/* Factor Weights */}
        <div className="bg-blue-800 rounded-lg p-6 border border-blue-700">
          <div className="flex justify-between items-center mb-4 border-b border-blue-700 pb-2">
            <h4 className="text-md font-semibold text-blue-100">Factor Weights</h4>
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${isValidWeight ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'}`}>
              Total: {totalWeight.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">GPA Weight</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.gpaWeight}
                onChange={(e) => handleWeightChange('gpaWeight', e.target.value)}
                className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="text-xs text-blue-300 mt-1">
                Current: {(config.gpaWeight * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Attendance Weight</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.attendanceWeight}
                onChange={(e) => handleWeightChange('attendanceWeight', e.target.value)}
                className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="text-xs text-blue-300 mt-1">
                Current: {(config.attendanceWeight * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Assignments Weight</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.assignmentWeight}
                onChange={(e) => handleWeightChange('assignmentWeight', e.target.value)}
                className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="text-xs text-blue-300 mt-1">
                Current: {(config.assignmentWeight * 100).toFixed(0)}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Behavior Weight</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.behaviorWeight}
                onChange={(e) => handleWeightChange('behaviorWeight', e.target.value)}
                className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="text-xs text-blue-300 mt-1">
                Current: {(config.behaviorWeight * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* GPA Thresholds */}
          <div className="bg-blue-800 rounded-lg p-6 border border-blue-700">
            <h4 className="text-md font-semibold text-blue-100 mb-4 border-b border-blue-700 pb-2">GPA Thresholds</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-300 mb-1">Critical (Below)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={config.gpaThresholds.critical}
                  onChange={(e) => handleThresholdChange('gpaThresholds', 'critical', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-1">High (Below)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={config.gpaThresholds.high}
                  onChange={(e) => handleThresholdChange('gpaThresholds', 'high', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">Medium (Below)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={config.gpaThresholds.medium}
                  onChange={(e) => handleThresholdChange('gpaThresholds', 'medium', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Attendance Thresholds */}
          <div className="bg-blue-800 rounded-lg p-6 border border-blue-700">
            <h4 className="text-md font-semibold text-blue-100 mb-4 border-b border-blue-700 pb-2">Attendance (%)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-300 mb-1">Critical (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.attendanceThresholds.critical}
                  onChange={(e) => handleThresholdChange('attendanceThresholds', 'critical', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-1">High (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.attendanceThresholds.high}
                  onChange={(e) => handleThresholdChange('attendanceThresholds', 'high', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">Medium (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.attendanceThresholds.medium}
                  onChange={(e) => handleThresholdChange('attendanceThresholds', 'medium', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Assignment Thresholds */}
          <div className="bg-blue-800 rounded-lg p-6 border border-blue-700">
            <h4 className="text-md font-semibold text-blue-100 mb-4 border-b border-blue-700 pb-2">Assignments (%)</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-300 mb-1">Critical (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.assignmentThresholds.critical}
                  onChange={(e) => handleThresholdChange('assignmentThresholds', 'critical', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-1">High (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.assignmentThresholds.high}
                  onChange={(e) => handleThresholdChange('assignmentThresholds', 'high', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">Medium (Below)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.assignmentThresholds.medium}
                  onChange={(e) => handleThresholdChange('assignmentThresholds', 'medium', e.target.value)}
                  className="w-full bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RiskAlgorithmConfig.propTypes = {
  onRefresh: PropTypes.func
};

export default RiskAlgorithmConfig;
