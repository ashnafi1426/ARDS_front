import React from 'react';
import { Button, Typography, Card } from 'antd';
import { ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: 400, textAlign: 'center' }}>
        <ExclamationCircleOutlined 
          style={{ 
            fontSize: '64px', 
            color: '#ff4d4f', 
            marginBottom: '16px' 
          }} 
        />
        <Title level={2} style={{ color: '#ff4d4f' }}>
          Unauthorized Access
        </Title>
        <Paragraph style={{ color: '#666' }}>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Paragraph>
        <div style={{ marginTop: '24px' }}>
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
