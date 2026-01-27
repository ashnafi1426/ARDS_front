import { useState, useEffect } from 'react';
import api from '../../config/api';

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@university.edu',
        studentId: 'STU-001',
        program: 'Computer Science',
        year: 3,
        gpa: 3.2,
        phone: '+1234567890',
        address: '123 University Ave, Campus Town',
        dateOfBirth: '2000-05-15',
        emergencyContact: 'Jane Doe - +9876543210',
        profilePicture: null
      };
      setStudentData(mockData);
      setFormData(mockData);
    } catch (error) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudentData(formData);
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleProfilePictureUpload = async (file) => {
    try {
      // Mock API call for image upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile picture updated successfully');
    } catch (error) {
      setError('Failed to upload profile picture');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Student Profile</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg">
          ❌ {error}
        </div>
      )}

      {editMode ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-800 border-gray-700 text-gray-400 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                disabled
                className="w-full bg-gray-800 border-gray-700 text-gray-400 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {studentData.firstName} {studentData.lastName}
              </h3>
              <p className="text-gray-400 mb-4">{studentData.studentId}</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Upload Photo
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Full Name</span>
                    <p className="text-white font-medium">{studentData.firstName} {studentData.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Email</span>
                    <p className="text-white font-medium">{studentData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Phone</span>
                    <p className="text-white font-medium">{studentData.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Address</span>
                    <p className="text-white font-medium">{studentData.address}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 text-sm">Student ID</span>
                    <p className="text-white font-medium">{studentData.studentId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Program</span>
                    <p className="text-white font-medium">{studentData.program}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Year</span>
                    <p className="text-white font-medium">Year {studentData.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">GPA</span>
                    <p className="text-white font-medium">{studentData.gpa?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-md font-semibold text-white mb-3">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Date of Birth</span>
                    <p className="text-white font-medium">{studentData.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Emergency Contact</span>
                    <p className="text-white font-medium">{studentData.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;