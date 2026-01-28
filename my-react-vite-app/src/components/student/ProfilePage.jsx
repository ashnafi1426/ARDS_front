import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import studentService from '../../services/student.service';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudentProfile();
      setProfile(data);
      setError('');
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentService.updateStudentProfile(profile);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold mb-2">Profile</h2>
        {success && <p className="text-green-600">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {['full_name', 'phone', 'address', 'department', 'year_of_study'].map((field) => (
            <div key={field}>
              <label className="block font-medium">{field.replace('_', ' ')}</label>
              <input
                type="text"
                name={field}
                value={profile[field] || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
