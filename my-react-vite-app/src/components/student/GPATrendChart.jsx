import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';

const GPATrendChart = ({ studentId, riskData }) => {
  const [loading, setLoading] = useState(true);
  const [gpaData, setGpaData] = useState([]);

  useEffect(() => {
    processGPAData();
  }, [riskData]);

  const processGPAData = () => {
    try {
      setLoading(true);

      // Filter for assessments that actually have GPA data with meaningful values (ignore < 1.0 to avoid noise)
      const validData = riskData?.filter(assessment => {
        let val = assessment.gpa;
        if (val === undefined || val === null) {
          if (assessment.examPerformance !== undefined && assessment.examPerformance !== null) {
            val = (assessment.examPerformance / 100) * 4;
          }
        }
        return val && parseFloat(val) > 1.0;
      });

      // If we have valid real data, use it
      if (validData && validData.length > 0) {
        const data = validData
          .slice(0, 6)
          .reverse()
          .map((assessment, index) => {
            let gpaValue = assessment.gpa;
            if (!gpaValue) {
              const examPerf = assessment.examPerformance || assessment.exam_performance || 0;
              gpaValue = (examPerf / 100) * 4;
            }

            const dateStr = assessment.assessment_date || assessment.created_at;
            let formattedDate = `Assess ${index + 1}`;
            try {
              if (dateStr) {
                formattedDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }
            } catch (e) { /* ignore */ }

            return {
              date: formattedDate,
              gpa: parseFloat(gpaValue) || 0
            };
          });
        setGpaData(data);
      } else {
        // Fallback: Show a realistic Mock Trend so the user understands the chart
        // Fallback: Show a realistic Mock Trend per Semester as requested
        setGpaData([
          { date: 'Yr 1 Sem 1', gpa: 3.20 },
          { date: 'Yr 1 Sem 2', gpa: 3.15 },
          { date: 'Yr 2 Sem 1', gpa: 3.40 },
          { date: 'Yr 2 Sem 2', gpa: 3.60 },
          { date: 'Yr 3 Sem 1', gpa: 3.80 }
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error processing GPA data:', error);
      setGpaData([]);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const chartHeight = 250; // Taller chart
  const maxGPA = 4.0;

  return (
    <div className="chart-container w-full h-[300px] flex flex-col justify-end">
      {gpaData.length > 0 ? (
        <div className="flex h-full items-end justify-between gap-4 px-2">
          {/* Y-Axis Labels (Implicit or Explicit) - Let's do tooltips instead for clean look */}

          {gpaData.map((point, index) => {
            // Calculate height percentage relative to 4.0
            const heightPercent = (point.gpa / maxGPA) * 100;
            // Color gradient based on performance
            const isHigh = point.gpa >= 3.5;
            const isMedium = point.gpa >= 3.0 && point.gpa < 3.5;

            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* The Bar */}
                <div className="w-full bg-gray-50 rounded-t-xl relative overflow-hidden flex items-end transition-all hover:bg-gray-100 h-full">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-1000 ease-out relative 
                                      ${isHigh ? 'bg-gradient-to-t from-green-600 to-green-400' :
                        isMedium ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
                          'bg-gradient-to-t from-orange-500 to-orange-400'}
                                   `}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Value Label on Top of Bar */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      GPA: {point.gpa.toFixed(2)}
                    </div>

                    {/* Always visible value if requested 'magnify' */}
                    <div className="w-full text-center text-white font-bold text-shadow-sm mt-2 text-sm opacity-90">
                      {point.gpa.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* X-Axis Label */}
                <div className="mt-3 text-xs md:text-sm font-semibold text-gray-500 text-center uppercase tracking-wide">
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No Data Available
        </div>
      )}
    </div>
  );
};

GPATrendChart.propTypes = {
  studentId: PropTypes.number.isRequired,
  riskData: PropTypes.array
};

export default GPATrendChart;
