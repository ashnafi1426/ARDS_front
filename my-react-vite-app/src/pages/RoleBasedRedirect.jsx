import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    let currentUser = user;
    if (!currentUser) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }
      } catch (_) {
      }
    }

    if (!currentUser || !currentUser.role) {
      navigate('/login', { replace: true });
      return;
    }

    const redirectPath =
      currentUser.role === 'admin'
        ? '/admin/dashboard'
        : currentUser.role === 'advisor'
          ? '/advisor/dashboard'
          : '/student/dashboard';

    navigate(redirectPath, { replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
      Redirecting...
    </div>
  );
};

export default RoleBasedRedirect;
