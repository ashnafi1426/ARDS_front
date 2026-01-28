// Assignment Service - Frontend API Layer
// Handles all assignment-related API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Submit assignment with file upload
 * @param {string} assignmentId - Assignment ID
 * @param {File} file - File to upload
 * @param {string} submissionNotes - Optional submission notes
 * @returns {Promise} Submission result
 */
export const submitAssignment = async (assignmentId, file, submissionNotes = '') => {
  try {
    console.log('📤 Submitting assignment:', assignmentId);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    formData.append('submissionNotes', submissionNotes);
    
    const response = await fetch(`${API_URL}/assignments/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to submit assignment';
      console.error('❌ Submit failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Assignment submitted successfully');
    return data;
  } catch (error) {
    console.error('❌ Submit assignment error:', error.message);
    throw error;
  }
};

/**
 * Get assignment submission
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} Submission details
 */
export const getSubmission = async (assignmentId) => {
  try {
    console.log('📥 Fetching submission for assignment:', assignmentId);
    
    const response = await fetch(`${API_URL}/assignments/submission/${assignmentId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch submission';
      console.error('❌ Fetch failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Submission fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get submission error:', error.message);
    throw error;
  }
};

/**
 * Delete assignment submission
 * @param {string} submissionId - Submission ID
 * @returns {Promise} Delete result
 */
export const deleteSubmission = async (submissionId) => {
  try {
    console.log('🗑️ Deleting submission:', submissionId);
    
    const response = await fetch(`${API_URL}/assignments/submission/${submissionId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to delete submission';
      console.error('❌ Delete failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Submission deleted successfully');
    return data;
  } catch (error) {
    console.error('❌ Delete submission error:', error.message);
    throw error;
  }
};

/**
 * Get student submissions
 * @returns {Promise} List of submissions
 */
export const getStudentSubmissions = async () => {
  try {
    console.log('📋 Fetching student submissions');
    
    const response = await fetch(`${API_URL}/assignments/my-submissions`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch submissions';
      console.error('❌ Fetch failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Submissions fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get submissions error:', error.message);
    throw error;
  }
};

/**
 * Get assignment submissions (admin/instructor)
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} List of submissions
 */
export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    console.log('📋 Fetching assignment submissions:', assignmentId);
    
    const response = await fetch(`${API_URL}/assignments/submissions/${assignmentId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch submissions';
      console.error('❌ Fetch failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Submissions fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get submissions error:', error.message);
    throw error;
  }
};

// Export all services
const assignmentService = {
  submitAssignment,
  getSubmission,
  deleteSubmission,
  getStudentSubmissions,
  getAssignmentSubmissions
};

export default assignmentService;
