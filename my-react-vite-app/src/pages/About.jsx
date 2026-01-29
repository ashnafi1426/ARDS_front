import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Button 
        type="primary" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: '24px' }}
      >
        Back to Home
      </Button>

      <Card>
        <Title level={1}>About ARDS</Title>
        <Paragraph>
          The Academic Risk Detection System (ARDS) is an innovative platform designed to identify and prevent academic challenges before they become critical.
        </Paragraph>
        <Paragraph>
          Our mission is to empower students, advisors, and administrators with AI-powered insights and tools to support academic success.
        </Paragraph>
        <Title level={3}>Key Features</Title>
        <ul>
          <li>Real-time risk assessment</li>
          <li>Early intervention alerts</li>
          <li>Comprehensive analytics</li>
          <li>Role-based access control</li>
          <li>Secure data management</li>
        </ul>
      </Card>
    </div>
  );
};

export default AboutPage;
