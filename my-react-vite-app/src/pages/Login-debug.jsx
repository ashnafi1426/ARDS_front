import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Auth.css';

const { Title, Text } = Typography;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('🔐 Debug Login - Form submitted with values:', values);
    setDebugInfo(`Form submitted: ${JSON.stringify(values)}`);
    setError('');
    setLoading(true);
    
    try {
      // Mock login - simulate successful authentication
      console.log('🔐 Debug Login - Starting mock authentication...');
      setDebugInfo(prev => prev + '\nStarting mock authentication...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔐 Debug Login - Storing token and user data...');
      setDebugInfo(prev => prev + '\nStoring authentication data...');
      
      // Store mock token
      localStorage.setItem('token', 'mock-admin-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: values.email,
        role: 'admin',
        full_name: 'Test Admin User'
      }));
      
      console.log('🔐 Debug Login - Navigation to dashboard...');
      setDebugInfo(prev => prev + '\nNavigating to dashboard...');
      
      message.success('Login successful!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('🔐 Debug Login - Error:', err);
      setDebugInfo(prev => prev + `\nError: ${err.message}`);
      setError('An unexpected error occurred');
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('🔐 Debug Login - Form validation failed:', errorInfo);
    setDebugInfo(`Form validation failed: ${JSON.stringify(errorInfo)}`);
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

          {debugInfo && (
            <Alert
              message="Debug Info"
              description={<pre style={{ fontSize: '12px' }}>{debugInfo}</pre>}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            name="login"
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
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
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Sign In
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
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                const mockCredentials = {
                  email: 'admin@test.com',
                  password: 'password123'
                };
                handleSubmit(mockCredentials);
              }}
            >
              Quick Login (Admin)
            </Button>
            <br />
            <br />
            <Button
              type="default"
              size="small"
              onClick={() => setDebugInfo('')}
            >
              Clear Debug Info
            </Button>
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
