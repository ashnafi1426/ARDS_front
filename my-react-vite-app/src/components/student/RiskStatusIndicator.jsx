import { useMemo } from 'react';
import PropTypes from 'prop-types';

const RiskStatusIndicator = ({ riskLevel, lastAssessment }) => {
  const riskConfig = useMemo(() => {
    const configs = {
      low: {
        color: '#4caf50',
        bgColor: '#e8f5e9',
        icon: '✅',
        title: 'Low Risk',
        message: 'Great job! Keep up the good work.',
        advice: 'Continue maintaining your current study habits and attendance.'
      },
      medium: {
        color: '#ff9800',
        bgColor: '#fff3e0',
        icon: '⚠️',
        title: 'Medium Risk',
        message: 'Some areas need attention.',
        advice: 'Consider meeting with your advisor to discuss improvement strategies.'
      },
      high: {
        color: '#f44336',
        bgColor: '#ffebee',
        icon: '🚨',
        title: 'High Risk',
        message: 'Immediate action required.',
        advice: 'Please schedule a meeting with your advisor as soon as possible.'
      },
      critical: {
        color: '#d32f2f',
        bgColor: '#ffcdd2',
        icon: '🆘',
        title: 'Critical Risk',
        message: 'Urgent intervention needed.',
        advice: 'Your advisor will contact you shortly. Please respond promptly.'
      },
      not_assessed: {
        color: '#757575',
        bgColor: '#f5f5f5',
        icon: '📊',
        title: 'Not Assessed',
        message: 'No risk assessment available yet.',
        advice: 'Complete your weekly self-check to get your risk assessment.'
      }
    };
    return configs[riskLevel] || configs.not_assessed;
  }, [riskLevel]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="risk-indicator-card"
      style={{ 
        backgroundColor: riskConfig.bgColor,
        borderLeft: `5px solid ${riskConfig.color}`
      }}
    >
      <div className="risk-indicator-content">
        <div className="risk-icon" style={{ fontSize: '3rem' }}>
          {riskConfig.icon}
        </div>
        <div className="risk-details">
          <h2 style={{ color: riskConfig.color, margin: '0 0 0.5rem 0' }}>
            {riskConfig.title}
          </h2>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '500' }}>
            {riskConfig.message}
          </p>
          <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
            {riskConfig.advice}
          </p>
          <div style={{ fontSize: '0.9rem', color: '#999' }}>
            Last Assessment: {formatDate(lastAssessment)}
          </div>
        </div>
      </div>
    </div>
  );
};

RiskStatusIndicator.propTypes = {
  riskLevel: PropTypes.oneOf(['low', 'medium', 'high', 'critical', 'not_assessed']).isRequired,
  lastAssessment: PropTypes.string
};

export default RiskStatusIndicator;
