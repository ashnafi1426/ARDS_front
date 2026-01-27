import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';

const AssignmentTracker = ({ studentId, riskData }) => {
  const [loading, setLoading] = useState(true);
  const [assignmentData, setAssignmentData] = useState([]);

  useEffect(() => {
    console.log('📚 AssignmentTracker - Processing riskData:', riskData);
    processAssignmentData();
  }, [riskData]);

  const processAssignmentData = () => {
    try {
      setLoading(true);
      
      if (!riskData || riskData.length === 0) {
        console.log('⚠️  No risk data available for assignment tracking');
        setAssignmentData([]);
        setLoading(false);
        return;
      }

      // Extract assignment completion percentages from risk assessments
      const data = riskData
        .filter(assessment => assessment.assignmentCompletion !== undefined || assessment.assignment_completion !== undefined)
        .slice(0, 8) // Last 8 weeks
        .reverse()
        .map((assessment, index) => {
          const completion = assessment.assignmentCompletion || assessment.assignment_completion || 0;
          const weekNum = riskData.length - index;
          
          return {
            week: `Week ${weekNum}`,
            completion: completion,
            date: new Date(assessment.assessment_date || assessment.assessmentDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            status: completion >= 80 ? 'good' : completion >= 60 ? 'warning' : 'danger'
          };
        });

      console.log('✅ Processed assignment data:', data);
      setAssignmentData(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error processing assignment data:', error);
      setAssignmentData([]);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      good: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336'
    };
    return colors[status] || colors.warning;
  };

  const getStatusIcon = (status) => {
    const icons = {
      good: '✅',
      warning: '⚠️',
      danger: '❌'
    };
    return icons[status] || icons.warning;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const chartHeight = 200;
  const maxCompletion = 100;

  return (
    <div className="assignment-tracker">
      {assignmentData.length > 0 ? (
        <>
          <div className="chart" style={{ height: `${chartHeight}px`, position: 'relative', padding: '1rem 0' }}>
            <svg width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((value) => (
                <g key={value}>
                  <line
                    x1="40"
                    y1={chartHeight - (value / maxCompletion) * (chartHeight - 20)}
                    x2="100%"
                    y2={chartHeight - (value / maxCompletion) * (chartHeight - 20)}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x="5"
                    y={chartHeight - (value / maxCompletion) * (chartHeight - 20) + 5}
                    fontSize="11"
                    fill="#999"
                    textAnchor="start"
                  >
                    {value}%
                  </text>
                </g>
              ))}

              {/* Assignment bars */}
              {assignmentData.map((item, index) => {
                const barWidth = (100 - 50) / assignmentData.length;
                const x = 50 + (index * barWidth);
                const barHeight = (item.completion / maxCompletion) * (chartHeight - 20);
                const y = chartHeight - barHeight;
                const color = getStatusColor(item.status);
                const icon = getStatusIcon(item.status);

                return (
                  <g key={index}>
                    {/* Bar */}
                    <rect
                      x={`${x}%`}
                      y={y}
                      width={`${barWidth * 0.6}%`}
                      height={barHeight}
                      fill={color}
                      opacity="0.8"
                      rx="4"
                    />
                    
                    {/* Percentage label */}
                    <text
                      x={`${x + (barWidth * 0.3)}%`}
                      y={y - 5}
                      fontSize="11"
                      fill="#333"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {item.completion}%
                    </text>

                    {/* Status icon */}
                    <text
                      x={`${x + (barWidth * 0.3)}%`}
                      y={chartHeight - 5}
                      fontSize="14"
                      textAnchor="middle"
                    >
                      {icon}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="chart-labels" style={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#666',
            paddingLeft: '50px'
          }}>
            {assignmentData.map((item, index) => (
              <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{item.week}</div>
                <div style={{ fontSize: '0.7rem', color: '#999' }}>{item.date}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.5rem',
            marginTop: '1rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: getStatusColor('good') }}>✅</span>
              <span>Good (≥80%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: getStatusColor('warning') }}>⚠️</span>
              <span>Warning (60-79%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: getStatusColor('danger') }}>❌</span>
              <span>Danger (&lt;60%)</span>
            </div>
          </div>
        </>
      ) : (
        <div className="no-data" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>📚 No assignment data available yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Complete weekly self-checks to track your assignment completion.</p>
        </div>
      )}
    </div>
  );
};

AssignmentTracker.propTypes = {
  studentId: PropTypes.number.isRequired,
  riskData: PropTypes.array
};

export default AssignmentTracker;
