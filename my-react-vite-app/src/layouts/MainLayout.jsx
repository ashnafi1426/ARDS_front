import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Badge,
  Space,
  theme
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  AlertOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('role'); // Changed from userRole to role

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
    ];

    if (userRole === 'student') {
      return [
        ...baseItems,
        {
          key: 'courses',
          icon: <BookOutlined />,
          label: 'Courses',
        },
        {
          key: 'calendar',
          icon: <CalendarOutlined />,
          label: 'Calendar',
        },
        {
          key: 'self-check',
          icon: <ExperimentOutlined />,
          label: 'Self Check',
        },
        {
          key: 'notifications',
          icon: <BellOutlined />,
          label: 'Notifications',
        },
      ];
    }

    if (userRole === 'advisor') {
      return [
        ...baseItems,
        {
          key: 'caseload',
          icon: <TeamOutlined />,
          label: 'My Caseload',
        },
        {
          key: 'interventions',
          icon: <AlertOutlined />,
          label: 'Interventions',
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Reports',
        },
      ];
    }

    if (userRole === 'admin') {
      return [
        ...baseItems,
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'User Management',
        },
        {
          key: 'students',
          icon: <TeamOutlined />,
          label: 'Students',
        },
        {
          key: 'advisors',
          icon: <UserOutlined />,
          label: 'Advisors',
        },
        {
          key: 'risk-monitoring',
          icon: <AlertOutlined />,
          label: 'Risk Monitoring',
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Reports',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
        },
      ];
    }

    return baseItems;
  };

  // Handle menu click
  const handleMenuClick = ({ key }) => {
    const basePath = userRole === 'student' ? '/student' : 
                     userRole === 'advisor' ? '/advisor' : 
                     userRole === 'admin' ? '/admin' : '';
    
    navigate(`${basePath}/${key}`);
  };

  // Get current selected key
  const getSelectedKey = () => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment || 'dashboard';
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Changed from userRole to role
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate(`/${userRole}/profile`),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate(`/${userRole}/settings`),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 16px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          {!collapsed && (
            <Text strong style={{ color: 'white', fontSize: '16px' }}>
              ARDS
            </Text>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={getMenuItems()}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
            <Badge count={0} showZero={false}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
                onClick={() => navigate(`/${userRole}/notifications`)}
              />
            </Badge>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                />
                <Text>{user?.full_name || user?.email}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
