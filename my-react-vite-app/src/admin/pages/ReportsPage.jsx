import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/reports');
      if (response.data.status === 'success') {
        setReports(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
      setLoading(false);
    }
  };

  const generateReport = async (type) => {
    try {
      const response = await api.post('/admin/reports/generate', { type });
      if (response.data.status === 'success') {
        setReports([response.data.data, ...reports]);
      }
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  const downloadReport = (reportId) => {
    window.open(`/api/admin/reports/${reportId}/download`, '_blank');
  };

  const filteredReports = reportType === 'all'
    ? reports
    : reports.filter(r => r.type === reportType);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and view system reports</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <div className="filter-group">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="risk">Risk Analysis</option>
            <option value="attendance">Attendance</option>
            <option value="performance">Performance</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="report-generator">
        <h2>Generate New Report</h2>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => generateReport('risk')}>
            📊 Risk Analysis Report
          </button>
          <button className="btn btn-primary" onClick={() => generateReport('attendance')}>
            📋 Attendance Report
          </button>
          <button className="btn btn-primary" onClick={() => generateReport('performance')}>
            📈 Performance Report
          </button>
          <button className="btn btn-primary" onClick={() => generateReport('system')}>
            🖥️ System Report
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Generated Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td><span className="badge badge-info">{report.type}</span></td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${report.status}`}>{report.status}</span></td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setSelectedReport(report)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => downloadReport(report.id)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedReport.name}</h2>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedReport.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Generated:</span>
                <span className="detail-value">{new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`badge badge-${selectedReport.status}`}>{selectedReport.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Summary:</span>
                <span className="detail-value">{selectedReport.summary || 'No summary available'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={() => downloadReport(selectedReport.id)}
              >
                Download Report
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
