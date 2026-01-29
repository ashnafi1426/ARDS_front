import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import LandingHeader from '../components/LandingHeader';
import '../styles/Auth.css';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Mock reset password - replace with actual API call
      console.log('🔐 Reset password request:', { token, newPassword: '***' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      message.success('Password reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      message.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <LandingHeader />
        <div className="auth-content">
          <Card className="auth-card" style={{ maxWidth: 400, width: '100%' }}>
            <Alert
              message="Invalid Reset Link"
              description="The password reset link is invalid or has expired."
              type="error"
              showIcon
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/login">
                <Button type="primary">Back to Login</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <LandingHeader />
        <div className="auth-content">
          <Card className="auth-card" style={{ maxWidth: 400, width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={3} style={{ color: '#52c41a' }}>
                ✅ Password Reset Successfully
              </Title>
              <Text type="secondary">
                Your password has been reset successfully.
                You will be redirected to the login page shortly.
              </Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <LandingHeader />
      <div className="auth-content">
        <Card className="auth-card" style={{ maxWidth: 400, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Reset Password</Title>
            <Text type="secondary">
              Enter your new password below.
            </Text>
          </div>

          <Form
            name="reset-password"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm New Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#1890ff' }}>
                Back to Login
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
