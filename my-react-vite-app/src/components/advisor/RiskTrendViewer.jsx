import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';
import LoadingSpinner from '../LoadingSpinner';

const RiskTrendViewer = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [riskHistory, setRiskHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, risk, gpa, attendance

  useEffect(() => {
    if (student) {
      fetchRiskHistory();
    }
  }, [student]);

  const fetchRiskHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/risks/student/${student.id}`);
      setRiskHistory(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching risk history:', error);
      setRiskHistory([]);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const latestAssessment = riskHistory[0] || {};

  return (
    <div className="risk-trend-viewer">
      {/* Student Header */}
      <div style={{ 
        padding: '1rem', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>
          {student.user?.firstName} {student.user?.lastName}
        </h3>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <span>ID: {student.id || student.studentId}</span>
          <span>Program: {student.program}</span>
          <span>Year: {student.year}</span>
          <span>Email: {student.user?.email}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1rem',
        borderBottom: '2px solid #e0e0e0'
      }}>
        {['overview', 'risk', 'gpa', 'attendance'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'none',
              borderBottom: selectedTab === tab ? '2px solid #2196f3' : 'none',
              color: selectedTab === tab ? '#2196f3' : '#666',
              fontWeight: selectedTab === tab ? '600' : 'normal',
              cursor: 'pointer',
              textTransform: 'capitalize',
              marginBottom: '-2px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="overview-tab">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Current Risk Level</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
                {student.currentRiskLevel || 'Not Assessed'}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Risk Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
                {(student.currentRiskScore || 0).toFixed(1)}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Current GPA</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
                {(student.gpa || 0).toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Attendance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
                {student.attendance || 0}%
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: '1rem' }}>Recent Assessments</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {riskHistory.length > 0 ? (
              riskHistory.slice(0, 5).map((assessment, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600' }}>
                      {new Date(assessment.assessment_date).toLocaleDateString()}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      background: assessment.risk_level === 'high' ? '#f44336' : 
                                 assessment.risk_level === 'medium' ? '#ff9800' : '#4caf50',
                      color: 'white'
                    }}>
                      {assessment.risk_level}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    GPA: {(assessment.gpa || 0).toFixed(2)} | 
                    Attendance: {assessment.attendance || 0}% | 
                    Score: {(assessment.risk_score || 0).toFixed(1)}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                No assessment history available
              </p>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'risk' && (
        <div className="risk-tab">
          <h4>Risk Level Trend</h4>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <p>Risk trend chart will be displayed here</p>
            <p style={{ fontSize: '0.9rem' }}>Showing risk level changes over time</p>
          </div>
        </div>
      )}

      {selectedTab === 'gpa' && (
        <div className="gpa-tab">
          <h4>GPA Trend</h4>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <p>GPA trend chart will be displayed here</p>
            <p style={{ fontSize: '0.9rem' }}>Showing GPA changes over time</p>
          </div>
        </div>
      )}

      {selectedTab === 'attendance' && (
        <div className="attendance-tab">
          <h4>Attendance Trend</h4>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <p>Attendance trend chart will be displayed here</p>
            <p style={{ fontSize: '0.9rem' }}>Showing attendance patterns over time</p>
          </div>
        </div>
      )}
    </div>
  );
};

RiskTrendViewer.propTypes = {
  student: PropTypes.object.isRequired
};

export default RiskTrendViewer;
