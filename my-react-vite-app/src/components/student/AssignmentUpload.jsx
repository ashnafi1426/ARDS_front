import { useState, useRef } from 'react';
import assignmentService from '../../services/assignment.service';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const AssignmentUpload = ({ assignment, onSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png', 'xlsx', 'pptx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setError('File size exceeds 10MB limit');
      setFile(null);
      return;
    }

    // Validate file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      setError(`File type .${fileExtension} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Uploading assignment:', assignment.assignment_id);
      
      const result = await assignmentService.submitAssignment(
        assignment.assignment_id,
        file,
        notes
      );

      setSuccess('Assignment submitted successfully!');
      setFile(null);
      setNotes('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call success callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.data);
        }
      }, 2000);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setNotes('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onCancel) {
      onCancel();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">📤 Submit Assignment</h3>
        <p className="text-gray-600">{assignment.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          Due: {new Date(assignment.due_date).toLocaleDateString()}
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">✅ {success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            📎 Select File
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png,.xlsx,.pptx"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-gray-600 hover:text-blue-600 font-medium"
            >
              {file ? `✅ ${file.name}` : '📁 Click to select file or drag and drop'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Max size: 10MB | Allowed: PDF, DOC, DOCX, TXT, ZIP, JPG, PNG, XLSX, PPTX
          </p>
          {file && (
            <p className="text-sm text-gray-600 mt-2">
              File size: {(file.size / 1024 / 1024).toFixed(2)}MB
            </p>
          )}
        </div>

        {/* Submission Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            📝 Submission Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your submission..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!file || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Uploading...' : '📤 Submit Assignment'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentUpload;
