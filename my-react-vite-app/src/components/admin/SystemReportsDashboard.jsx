import { useState, useEffect } from 'react';
import api from '../../config/api';

const SystemReportsDashboard = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/comprehensive?days=${dateRange}`);
      setReports(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      if (!reports) {
        alert('No data to export');
        return;
      }

      if (format === 'csv') {
        exportToCSV();
      } else if (format === 'pdf') {
        exportToPDF();
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report: ' + error.message);
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = [];

      // Header
      csvData.push(['Academic Risk Detection System Report']);
      csvData.push(['Generated:', new Date().toLocaleString()]);
      csvData.push(['Date Range:', `Last ${dateRange} Days`]);
      csvData.push([]);

      // Overview Stats
      csvData.push(['OVERVIEW STATISTICS']);
      csvData.push(['Metric', 'Value']);
      csvData.push(['Total Students', reports?.totalStudents || 0]);
      csvData.push(['Total Assessments', reports?.totalAssessments || 0]);
      csvData.push(['Total Interventions', reports?.totalInterventions || 0]);
      csvData.push(['Average GPA', reports?.averageGPA?.toFixed(2) || '0.00']);
      csvData.push([]);

      // Risk Distribution
      csvData.push(['RISK DISTRIBUTION']);
      csvData.push(['Risk Level', 'Count']);
      if (reports?.riskDistribution && Array.isArray(reports.riskDistribution)) {
        reports.riskDistribution.forEach(item => {
          const riskLevel = item._id || 'unknown';
          csvData.push([riskLevel, item.count || 0]);
        });
      }
      csvData.push([]);

      // Program Performance
      csvData.push(['PERFORMANCE BY PROGRAM']);
      csvData.push(['Program', 'Students', 'Avg GPA', 'Avg Attendance', 'At Risk']);
      if (reports?.programPerformance && Array.isArray(reports.programPerformance)) {
        reports.programPerformance.forEach(prog => {
          csvData.push([
            prog.program || 'Unknown',
            prog.studentCount || 0,
            prog.averageGPA?.toFixed(2) || '0.00',
            (prog.averageAttendance?.toFixed(1) || '0.0') + '%',
            prog.atRiskCount || 0
          ]);
        });
      }

      // Convert to CSV string
      const csvContent = csvData.map(row => row.join(',')).join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error in exportToCSV:', error);
      throw new Error('Failed to export CSV: ' + error.message);
    }
  };

  const exportToPDF = () => {
    try {
      // Create a printable HTML version
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        throw new Error('Could not open print window. Please allow popups for this site.');
      }

      // Safely get risk distribution HTML
      const riskDistributionHTML = reports?.riskDistribution && Array.isArray(reports.riskDistribution)
        ? reports.riskDistribution.map(item => {
          const percentage = reports.totalStudents > 0
            ? ((item.count / reports.totalStudents) * 100).toFixed(1)
            : '0.0';
          const riskLevel = item._id || 'unknown';
          const riskLevelCapitalized = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
          return `
              <tr>
                <td class="risk-${riskLevel}">${riskLevelCapitalized}</td>
                <td>${item.count || 0}</td>
                <td>${percentage}%</td>
              </tr>
            `;
        }).join('')
        : '<tr><td colspan="3">No data available</td></tr>';

      // Safely get program performance HTML
      const programPerformanceHTML = reports?.programPerformance && Array.isArray(reports.programPerformance)
        ? reports.programPerformance.map(prog => `
            <tr>
              <td>${prog.program || 'Unknown'}</td>
              <td>${prog.studentCount || 0}</td>
              <td>${prog.averageGPA?.toFixed(2) || '0.00'}</td>
              <td>${prog.averageAttendance?.toFixed(1) || '0.0'}%</td>
              <td>${prog.atRiskCount || 0}</td>
            </tr>
          `).join('')
        : '<tr><td colspan="5">No data available</td></tr>';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>System Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
            h1 { color: #2196f3; border-bottom: 3px solid #2196f3; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; }
            .meta { color: #666; margin-bottom: 20px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 2rem; font-weight: bold; color: #2196f3; }
            .stat-label { color: #666; font-size: 0.9rem; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .risk-critical { color: #d32f2f; font-weight: bold; }
            .risk-high { color: #f44336; font-weight: bold; }
            .risk-medium { color: #ff9800; font-weight: bold; }
            .risk-low { color: #4caf50; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>📊 Academic Risk Detection System Report</h1>
          <div class="meta">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Date Range:</strong> Last ${dateRange} Days</p>
          </div>
          <h2>Overview Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${reports?.totalStudents || 0}</div>
              <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reports?.totalAssessments || 0}</div>
              <div class="stat-label">Assessments</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reports?.totalInterventions || 0}</div>
              <div class="stat-label">Interventions</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reports?.averageGPA?.toFixed(2) || '0.00'}</div>
              <div class="stat-label">Average GPA</div>
            </div>
          </div>
          <h2>Risk Distribution</h2>
          <table>
            <thead><tr><th>Risk Level</th><th>Count</th><th>Percentage</th></tr></thead>
            <tbody>${riskDistributionHTML}</tbody>
          </table>
          <h2>Performance by Program</h2>
          <table>
            <thead><tr><th>Program</th><th>Students</th><th>Avg GPA</th><th>Avg Attendance</th><th>At Risk</th></tr></thead>
            <tbody>${programPerformanceHTML}</tbody>
          </table>
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer; background: #2196f3; color: white; border: none; border-radius: 4px;">Print / Save as PDF</button>
          </div>
        </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error('Error in exportToPDF:', error);
      throw new Error('Failed to export PDF: ' + error.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12 bg-blue-900 rounded-xl">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="bg-blue-900 rounded-xl shadow-sm border border-blue-700 overflow-hidden text-white">
      <div className="px-6 py-5 border-b border-blue-700 bg-blue-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">System Reports</h3>
          <p className="text-sm text-blue-200 mt-1">Analytics and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-blue-900 border border-blue-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
          <button onClick={() => exportReport('pdf')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            Export PDF
          </button>
          <button onClick={() => exportReport('csv')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            Export CSV
          </button>
        </div>
      </div>

      {reports && (
        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-800 p-4 rounded-xl border border-blue-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-1">{reports.totalStudents || 0}</div>
                <div className="text-sm text-blue-200 font-medium uppercase tracking-wide">Total Students</div>
              </div>
              <div className="absolute right-2 bottom-2 text-5xl opacity-10 text-white group-hover:scale-110 transition-transform">👥</div>
            </div>

            <div className="bg-blue-800 p-4 rounded-xl border border-blue-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-1">{reports.totalAssessments || 0}</div>
                <div className="text-sm text-blue-200 font-medium uppercase tracking-wide">Assessments</div>
              </div>
              <div className="absolute right-2 bottom-2 text-5xl opacity-10 text-white group-hover:scale-110 transition-transform">📊</div>
            </div>

            <div className="bg-blue-800 p-4 rounded-xl border border-blue-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-1">{reports.totalInterventions || 0}</div>
                <div className="text-sm text-blue-200 font-medium uppercase tracking-wide">Interventions</div>
              </div>
              <div className="absolute right-2 bottom-2 text-5xl opacity-10 text-white group-hover:scale-110 transition-transform">🎯</div>
            </div>

            <div className="bg-blue-800 p-4 rounded-xl border border-blue-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-1">{reports.averageGPA?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-blue-200 font-medium uppercase tracking-wide">Average GPA</div>
              </div>
              <div className="absolute right-2 bottom-2 text-5xl opacity-10 text-white group-hover:scale-110 transition-transform">📈</div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-blue-800 rounded-lg p-6 border border-blue-700">
            <h4 className="text-md font-semibold text-blue-100 mb-4 border-b border-blue-700 pb-2">Risk Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reports.riskDistribution?.map(item => (
                <div key={item._id} className="text-center p-4 bg-blue-900/50 rounded-lg border border-blue-600/30">
                  <div className={`text-3xl font-bold mb-1 ${item._id === 'critical' ? 'text-purple-400' :
                      item._id === 'high' ? 'text-red-400' :
                        item._id === 'medium' ? 'text-orange-400' : 'text-green-400'
                    }`}>
                    {item.count}
                  </div>
                  <div className="text-xs text-blue-300 uppercase font-bold tracking-wider">
                    {item._id} Risk
                  </div>
                </div>
              ))}
              {(!reports.riskDistribution || reports.riskDistribution.length === 0) && (
                <div className="col-span-4 text-center text-blue-300 py-4">No risk distribution data available</div>
              )}
            </div>
          </div>

          {/* Program Performance */}
          <div className="bg-blue-800 rounded-lg border border-blue-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-700">
              <h4 className="text-md font-semibold text-blue-100">Performance by Program</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-900/50 text-blue-200 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Program</th>
                    <th className="px-6 py-3">Students</th>
                    <th className="px-6 py-3">Avg GPA</th>
                    <th className="px-6 py-3">Attendance</th>
                    <th className="px-6 py-3">At Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-700">
                  {reports.programPerformance?.map(prog => (
                    <tr key={prog.program} className="hover:bg-blue-700/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{prog.program}</td>
                      <td className="px-6 py-4 text-blue-200">{prog.studentCount}</td>
                      <td className="px-6 py-4 text-white font-bold">{prog.averageGPA?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-blue-200">{prog.averageAttendance?.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-red-300 font-medium">{prog.atRiskCount}</td>
                    </tr>
                  ))}
                  {(!reports.programPerformance || reports.programPerformance.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-blue-300 italic">No program data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-blue-800 rounded-lg border border-blue-700">
            <div className="px-6 py-4 border-b border-blue-700">
              <h4 className="text-md font-semibold text-blue-100">Recent Activity</h4>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {reports.recentActivity && reports.recentActivity.length > 0 ? (
                reports.recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 border-b border-blue-700/50 last:border-0 hover:bg-blue-700/20 rounded transition-colors">
                    <div className="font-semibold text-white">{activity.type}</div>
                    <div className="text-sm text-blue-200">{activity.description}</div>
                    <div className="text-xs text-blue-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-blue-300 italic">No recent activity logged</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemReportsDashboard;
