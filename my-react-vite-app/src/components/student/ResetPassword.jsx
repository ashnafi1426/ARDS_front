import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import studentService from '../../services/student.service';
import LoadingSpinner from '../../components/LoadingSpinner';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Call backend API to send reset link
      await studentService.resetPassword(email);
      setSuccess('Password reset link sent to your email.');
      setError('');
    } catch (err) {
      setError('Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        {loading && <LoadingSpinner />}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send Reset Link
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ResetPassword;
