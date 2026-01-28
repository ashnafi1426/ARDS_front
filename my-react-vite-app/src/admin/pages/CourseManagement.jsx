import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    instructor: '',
    credits: 3,
    semester: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/courses');
      if (response.data.status === 'success') {
        setCourses(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/courses', formData);
      if (response.data.status === 'success') {
        setCourses([...courses, response.data.data]);
        setFormData({ courseCode: '', courseName: '', instructor: '', credits: 3, semester: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      setError('Failed to add course');
    }
  };

  const filteredCourses = courses.filter(course => {
    return course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Course Management</h1>
        <p>Manage courses, instructors, and course assignments</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search courses by code, name, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {showAddForm && (
        <div className="form-card">
          <h2>Add New Course</h2>
          <form onSubmit={handleAddCourse}>
            <div className="form-group">
              <label>Course Code</label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g., CS101"
                required
              />
            </div>
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Instructor</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                min="1"
                max="6"
              />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g., Fall 2024"
              />
            </div>
            <button type="submit" className="btn btn-success">Save Course</button>
          </form>
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-label">Total Courses</span>
          <span className="stat-value">{courses.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Credits</span>
          <span className="stat-value">{courses.reduce((sum, c) => sum + (c.credits || 0), 0)}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.instructor || 'N/A'}</td>
                  <td>{course.credits}</td>
                  <td>{course.semester || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;
