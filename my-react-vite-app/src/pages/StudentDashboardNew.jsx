import React from 'react';
import { Card, Row, Col, Statistic, Typography, Button } from 'antd';
import { UserOutlined, BookOutlined, TrophyOutlined, BellOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentDashboardNew = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Student Dashboard</Title>
        <Text type="secondary">Welcome back, {user.full_name || 'Student'}!</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Enrolled Courses"
              value={5}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Current GPA"
              value={3.7}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Risk Level"
              value="Low"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Notifications"
              value={3}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Courses" style={{ height: '300px' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">
                Your enrolled courses will appear here...
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Academic Progress" style={{ height: '300px' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">
                Your academic progress will be displayed here...
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboardNew;
