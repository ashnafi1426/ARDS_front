// Debug utility to test authentication flow
export const testAuthFlow = () => {
  console.log('🧪 Testing ARDS Authentication Flow...\n');
  
  // Test 1: Check localStorage keys
  console.log('📋 Current localStorage:');
  console.log('Token:', !!localStorage.getItem('token'));
  console.log('Role:', localStorage.getItem('role'));
  console.log('User ID:', localStorage.getItem('userId'));
  console.log('User:', !!localStorage.getItem('user'));
  
  // Test 2: Mock login
  console.log('\n🔐 Testing mock login...');
  const mockUser = {
    email: 'admin@ards.com',
    password: 'password123',
    role: 'admin',
    userId: 'admin-123',
    full_name: 'Admin User'
  };
  
  // Store mock data
  localStorage.setItem('token', `mock-jwt-token-${mockUser.userId}`);
  localStorage.setItem('role', mockUser.role);
  localStorage.setItem('userId', mockUser.userId);
  localStorage.setItem('user', JSON.stringify({
    id: mockUser.userId,
    email: mockUser.email,
    role: mockUser.role,
    full_name: mockUser.full_name
  }));
  
  console.log('✅ Mock login data stored');
  
  // Test 3: Check ProtectedRoute logic
  console.log('\n🔒 Testing ProtectedRoute logic...');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    console.log('❌ No token found - would redirect to /login');
  } else {
    console.log('✅ Token found');
    
    if (role === 'admin') {
      console.log('✅ Admin role - can access admin routes');
    } else {
      console.log('❌ Wrong role - would redirect to /redirect');
    }
  }
  
  // Test 4: Check RoleBasedRedirect logic
  console.log('\n🔄 Testing RoleBasedRedirect logic...');
  switch (role) {
    case 'student':
      console.log('✅ Would redirect to /student/dashboard');
      break;
    case 'advisor':
      console.log('✅ Would redirect to /advisor/dashboard');
      break;
    case 'admin':
      console.log('✅ Would redirect to /admin/dashboard');
      break;
    default:
      console.log('❌ Unknown role - would redirect to /login');
  }
  
  console.log('\n🎯 Authentication flow test completed!');
  
  return {
    token: !!token,
    role,
    userId: localStorage.getItem('userId'),
    user: JSON.parse(localStorage.getItem('user') || '{}')
  };
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  console.log('🧹 Auth data cleared');
};

export default {
  testAuthFlow,
  clearAuthData
};
