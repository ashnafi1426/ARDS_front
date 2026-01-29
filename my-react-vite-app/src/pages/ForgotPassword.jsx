import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import LandingHeader from '../components/LandingHeader';
import '../styles/Auth.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Mock forgot password - replace with actual API call
      console.log('🔐 Forgot password request:', values.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      message.success('Password reset instructions sent to your email');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      message.error('Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <LandingHeader />
        <div className="auth-content">
          <Card className="auth-card" style={{ maxWidth: 400, width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={3} style={{ color: '#52c41a' }}>
                ✅ Email Sent
              </Title>
              <Text type="secondary">
                Password reset instructions have been sent to your email address.
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
            <Title level={2}>Forgot Password</Title>
            <Text type="secondary">
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </div>

          <Form
            name="forgot-password"
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
                prefix={<MailOutlined />}
                placeholder="Email Address"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}
              >
                Send Reset Instructions
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

export default ForgotPassword;
