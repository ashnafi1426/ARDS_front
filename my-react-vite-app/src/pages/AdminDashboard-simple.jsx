import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography } from 'antd';
import { UserOutlined, TeamOutlined, AlertOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <div>
          <Title level={2}>Admin Dashboard</Title>
          <Text type="secondary">Welcome back, Admin!</Text>
        </div>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={150}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Students"
              value={120}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Advisors"
              value={25}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="At Risk Students"
              value={15}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="System Health" style={{ height: '200px' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                ✅ System Healthy
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" style={{ height: '200px' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">
                User Management, Reports, and Settings coming soon...
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
