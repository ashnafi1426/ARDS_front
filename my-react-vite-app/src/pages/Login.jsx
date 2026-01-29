import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Auth.css';

const { Title, Text } = Typography;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Mock authentication function
  const mockLogin = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user database
    const users = [
      { email: 'admin@ards.com', password: 'password123', role: 'admin', userId: 'admin-123', full_name: 'Admin User' },
      { email: 'advisor@ards.com', password: 'password123', role: 'advisor', userId: 'advisor-123', full_name: 'Advisor User' },
      { email: 'student@ards.com', password: 'password123', role: 'student', userId: 'student-123', full_name: 'Student User' },
    ];

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      data: {
        token: `mock-jwt-token-${user.userId}`,
        role: user.role,
        userId: user.userId,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        }
      }
    };
  };

  const handleSubmit = async (values) => {
    console.log('🔐 Login attempt:', values);
    setError('');
    setLoading(true);
    
    try {
      // Call mock authentication
      const response = await mockLogin(values.email, values.password);
      console.log('🔐 Login response:', response);

      if (response.success) {
        const { token, role, userId, user } = response.data;
        
        // Store token and user data securely
        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // Changed from userRole to role
        localStorage.setItem('userId', userId);
        localStorage.setItem('user', JSON.stringify(user));

        message.success('Login successful!');
        
        // Redirect based on role
        if (role === 'student') {
          navigate('/student/dashboard', { replace: true });
        } else if (role === 'advisor') {
          navigate('/advisor/dashboard', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/redirect', { replace: true });
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('🔐 Login error:', err);
      const errorMessage = err.message || 'Invalid credentials';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to your ARDS account</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1890ff' }}>
                Sign up
              </Link>
            </Text>
            <br />
            <Text type="secondary">
              <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                Forgot password?
              </Link>
            </Text>
            <br />
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Test Accounts:
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Student: student@ards.com / password123
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Advisor: advisor@ards.com / password123
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Admin: admin@ards.com / password123
            </Text>
            <br />
            <br />
            <Link to="/" style={{ color: '#1890ff' }}>
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
