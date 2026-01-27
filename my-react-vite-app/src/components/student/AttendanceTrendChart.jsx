import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AttendanceTrendChart = ({ studentId, riskData }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (riskData && riskData.length > 0) {
      // Extract attendance data from risk assessments
      const data = riskData
        .filter(assessment => assessment.attendance !== null && assessment.attendance !== undefined)
        .slice(0, 8)
        .reverse()
        .map((assessment, index) => ({
          week: `Week ${assessment.weekNumber || assessment.week_number || index + 1}`,
          attendance: parseFloat(assessment.attendance) || 0
        }));

      setAttendanceData(data.length > 0 ? data : []);
    } else {
      setAttendanceData([]);
    }
  }, [riskData]);

  const getBarColor = (attendance) => {
    if (attendance >= 90) return '#4caf50';
    if (attendance >= 75) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="chart-container">
      {attendanceData.length > 0 ? (
        <>
          <div className="bar-chart" style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-around',
            height: '200px',
            gap: '0.5rem',
            padding: '1rem 0'
          }}>
            {attendanceData.map((data, index) => (
              <div key={index} style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {data.attendance}%
                </div>
                <div style={{
                  width: '100%',
                  height: `${(data.attendance / 100) * 150}px`,
                  backgroundColor: getBarColor(data.attendance),
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: '10px'
                }} />
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}>
                  {data.week}
                </div>
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
              <div style={{ 
                width: '20px', 
                height: '12px', 
                backgroundColor: '#4caf50',
                borderRadius: '2px'
              }} />
              <span>≥90%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '20px', 
                height: '12px', 
                backgroundColor: '#ff9800',
                borderRadius: '2px'
              }} />
              <span>75-89%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '20px', 
                height: '12px', 
                backgroundColor: '#f44336',
                borderRadius: '2px'
              }} />
              <span>&lt;75%</span>
            </div>
          </div>
        </>
      ) : (
        <div className="no-data" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>📅 No attendance data available yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Attendance will be tracked through assessments.</p>
        </div>
      )}
    </div>
  );
};

AttendanceTrendChart.propTypes = {
  studentId: PropTypes.string,
  riskData: PropTypes.array
};

export default AttendanceTrendChart;
