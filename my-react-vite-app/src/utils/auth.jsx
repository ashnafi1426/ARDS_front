// Function to read the data from the user's local storage  
const getAuth = async () => {
  const tokenString = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (!tokenString || !userString) {
    return {};
  }

  try {
    const user = JSON.parse(userString);
    const decodedToken = decodeTokenPayload(tokenString);
    
    // Merge token data with stored user data
    return {
      ...user,
      token: tokenString,
      role: decodedToken.role || decodedToken.user_role,
      user_id: decodedToken.user_id || decodedToken.id,
      email: decodedToken.email || user.email,
      first_name: decodedToken.first_name || user.first_name,
      last_name: decodedToken.last_name || user.last_name,
    };
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return {};
  }
};

const decodeTokenPayload = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export default getAuth;
