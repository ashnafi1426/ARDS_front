import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

const WeeklySelfCheckForm = ({ studentId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    weekNumber: (() => {
      const startDate = new Date('2025-09-01');
      const today = new Date();
      const diffTime = Math.abs(today - startDate);
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.min(Math.max(diffWeeks, 1), 52);
    })(),
    academicYear: '2025-2026',
    factors: {
      attendance: 100,
      assignmentCompletion: 100,
      examPerformance: 100,
      participationLevel: 5,
      mentalHealthScore: 5,
      financialStress: 5,
      socialEngagement: 5
    },
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFactorChange = (factor, value) => {
    setFormData(prev => ({
      ...prev,
      factors: {
        ...prev.factors,
        [factor]: parseFloat(value)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔵 WeeklySelfCheckForm submission started');
    console.log('📋 Student ID:', studentId);
    console.log('📋 Form data:', JSON.stringify(formData, null, 2));
    
    if (!studentId) {
      const errorMsg = 'No student ID provided';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      console.log('📡 Sending assessment to API...');
      
      const response = await api.post('/risks', {
        studentId: studentId,
        ...formData
      });
      
      console.log('✅ Assessment submitted successfully!');
      console.log('✅ Response:', JSON.stringify(response.data, null, 2));
      
      alert('✅ Self-check submitted successfully! Check your notifications for results.');
      
      if (onSubmit) {
        await onSubmit(response.data);
      }
      
    } catch (error) {
      console.error('❌ Error submitting assessment:', error);
      console.error('❌ Error response:', error.response?.data);
      
      let errorMessage = 'Failed to submit assessment. Please try again.';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join(', ');
        errorMessage = `Validation Error: ${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network Error: Cannot connect to server. Please check if the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert('❌ ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="self-check-form">
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          borderLeft: '3px solid #f44336'
        }}>
          <strong>⚠️ {error}</strong>
        </div>
      )}
      
      <div className="form-section">
        <h3>📅 Basic Information</h3>
        
        <div className="form-group">
          <label htmlFor="weekNumber">
            Week Number
          </label>
          <input
            type="number"
            id="weekNumber"
            value={formData.weekNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
            min="1"
            max="52"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="academicYear">
            Academic Year
          </label>
          <input
            type="text"
            id="academicYear"
            value={formData.academicYear}
            onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
            placeholder="2025-2026"
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>📚 Academic Performance</h3>
        
        <div className="form-group">
          <label>
            Attendance Rate (%): {formData.factors.attendance}
          </label>
          <input
            type="range"
            value={formData.factors.attendance}
            onChange={(e) => handleFactorChange('attendance', e.target.value)}
            min="0"
            max="100"
            className="range-input"
          />
        </div>

        <div className="form-group">
          <label>
            Assignment Completion (%): {formData.factors.assignmentCompletion}
          </label>
          <input
            type="range"
            value={formData.factors.assignmentCompletion}
            onChange={(e) => handleFactorChange('assignmentCompletion', e.target.value)}
            min="0"
            max="100"
            className="range-input"
          />
        </div>

        <div className="form-group">
          <label>
            Exam Performance (%): {formData.factors.examPerformance}
          </label>
          <input
            type="range"
            value={formData.factors.examPerformance}
            onChange={(e) => handleFactorChange('examPerformance', e.target.value)}
            min="0"
            max="100"
            className="range-input"
          />
        </div>

        <div className="form-group">
          <label>
            Class Participation (1-5): {formData.factors.participationLevel}
          </label>
          <input
            type="range"
            value={formData.factors.participationLevel}
            onChange={(e) => handleFactorChange('participationLevel', e.target.value)}
            min="1"
            max="5"
            className="range-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>💭 Wellbeing Factors</h3>
        
        <div className="form-group">
          <label>
            Mental Health Stress (1-10): {formData.factors.mentalHealthScore}
          </label>
          <input
            type="range"
            value={formData.factors.mentalHealthScore}
            onChange={(e) => handleFactorChange('mentalHealthScore', e.target.value)}
            min="1"
            max="10"
            className="range-input"
          />
          <small>1 = Excellent, 10 = Very Stressed</small>
        </div>

        <div className="form-group">
          <label>
            Financial Stress (1-10): {formData.factors.financialStress}
          </label>
          <input
            type="range"
            value={formData.factors.financialStress}
            onChange={(e) => handleFactorChange('financialStress', e.target.value)}
            min="1"
            max="10"
            className="range-input"
          />
          <small>1 = No Stress, 10 = High Stress</small>
        </div>

        <div className="form-group">
          <label>
            Social Engagement (1-10): {formData.factors.socialEngagement}
          </label>
          <input
            type="range"
            value={formData.factors.socialEngagement}
            onChange={(e) => handleFactorChange('socialEngagement', e.target.value)}
            min="1"
            max="10"
            className="range-input"
          />
          <small>1 = Very Isolated, 10 = Very Engaged</small>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label htmlFor="notes">
            Additional Comments (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows="4"
            className="form-input"
            placeholder="Share any concerns or feedback..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel}
          className="btn-secondary"
          disabled={submitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={submitting}
          style={{
            backgroundColor: submitting ? '#ccc' : '#2196f3',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? '⏳ Submitting...' : `✅ Submit Self-Check for Week ${formData.weekNumber}`}
        </button>
      </div>
    </form>
  );
};

WeeklySelfCheckForm.propTypes = {
  studentId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func.isRequired
};

export default WeeklySelfCheckForm;
