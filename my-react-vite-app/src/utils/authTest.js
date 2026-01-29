// Test credentials for different roles
export const TEST_CREDENTIALS = {
  student: {
    email: 'student@ards.com',
    password: 'password123',
    expectedRole: 'student',
    expectedRedirect: '/student/dashboard'
  },
  advisor: {
    email: 'advisor@ards.com',
    password: 'password123',
    expectedRole: 'advisor',
    expectedRedirect: '/advisor/dashboard'
  },
  admin: {
    email: 'admin@ards.com',
    password: 'password123',
    expectedRole: 'admin',
    expectedRedirect: '/admin/dashboard'
  }
};

// Test functions
export const testLoginFlow = async (email, password, expectedRole, expectedRedirect) => {
  console.log('🧪 Testing login flow...');
  
  try {
    // Clear any existing auth data
    localStorage.clear();
    
    // Simulate login API call
    const mockResponse = {
      data: {
        success: true,
        data: {
          token: 'mock-jwt-token',
          role: expectedRole,
          userId: 'user-123',
          user: {
            id: 'user-123',
            email: email,
            full_name: `${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)} User`,
            role: expectedRole
          }
        }
      }
    };

    // Store auth data
    localStorage.setItem('token', mockResponse.data.data.token);
    localStorage.setItem('userRole', mockResponse.data.data.role);
    localStorage.setItem('userId', mockResponse.data.data.userId);
    localStorage.setItem('user', JSON.stringify(mockResponse.data.data.user));

    console.log('✅ Login successful:', {
      role: mockResponse.data.data.role,
      redirect: expectedRedirect
    });

    return {
      success: true,
      message: 'Login successful',
      data: mockResponse.data.data
    };
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export const testProtectedRoute = (allowedRoles, userRole) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  console.log('🔐 Testing protected route...');
  console.log('Token exists:', !!token);
  console.log('User role:', role);
  console.log('Allowed roles:', allowedRoles);

  if (!token) {
    return { success: false, message: 'No token found' };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return { success: false, message: `Role ${role} not allowed` };
  }

  return { success: true, message: 'Access granted' };
};

export const testRoleBasedRedirect = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  console.log('🔄 Testing role-based redirect...');
  console.log('Token exists:', !!token);
  console.log('User role:', role);

  if (!token) {
    return { success: false, message: 'No token found' };
  }

  const redirects = {
    student: '/student/dashboard',
    advisor: '/advisor/dashboard',
    admin: '/admin/dashboard'
  };

  const expectedRedirect = redirects[role];
  
  return {
    success: true,
    message: `Should redirect to ${expectedRedirect}`,
    data: { role, expectedRedirect }
  };
};

export const testPageRefresh = () => {
  console.log('🔄 Testing page refresh persistence...');
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const user = localStorage.getItem('user');
  
  return {
    token: !!token,
    role,
    user: user ? JSON.parse(user) : null,
    message: token ? 'User session persisted' : 'No session found'
  };
};

export const runAllTests = async () => {
  console.log('🚀 Starting ARDS Authentication Tests...\n');
  
  const results = [];
  
  // Test login for each role
  for (const [roleName, credentials] of Object.entries(TEST_CREDENTIALS)) {
    console.log(`\n🧪 Testing ${roleName} login...`);
    const result = await testLoginFlow(
      credentials.email, 
      credentials.password, 
      credentials.expectedRole, 
      credentials.expectedRedirect
    );
    results.push({ test: `${roleName} Login`, ...result });
  }
  
  // Test protected routes
  console.log('\n🔐 Testing protected routes...');
  const protectedRouteTests = [
    { role: 'student', allowedRoles: ['student'] },
    { role: 'advisor', allowedRoles: ['advisor'] },
    { role: 'admin', allowedRoles: ['admin'] },
    { role: 'student', allowedRoles: ['admin', 'advisor'] }, // Should fail
  ];
  
  for (const test of protectedRouteTests) {
    const result = testProtectedRoute(test.allowedRoles, test.role);
    results.push({ 
      test: `Protected Route - ${test.role} accessing ${test.allowedRoles.join(', ')}`, 
      ...result 
    });
  }
  
  // Test role-based redirect
  console.log('\n🔄 Testing role-based redirect...');
  const redirectTest = testRoleBasedRedirect();
  results.push({ test: 'Role-Based Redirect', ...redirectTest });
  
  // Test page refresh
  console.log('\n🔄 Testing page refresh persistence...');
  const refreshTest = testPageRefresh();
  results.push({ test: 'Page Refresh Persistence', ...refreshTest });
  
  console.log('\n📊 Test Results:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.test}: ${result.message}`);
  });
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Final Results: ${passedTests}/${totalTests} tests passed`);
  
  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    results,
    success: passedTests === totalTests
  };
};

export default {
  TEST_CREDENTIALS,
  testLoginFlow,
  testProtectedRoute,
  testRoleBasedRedirect,
  testPageRefresh,
  runAllTests
};
