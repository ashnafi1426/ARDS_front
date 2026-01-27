const API_URL = import.meta.env.VITE_API_URL;

export const logIn = async (formData) => {
  try {
    console.log('🔐 Sending login request to:', `${API_URL}/auth/login`);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || "Login failed";
      console.error('❌ Login failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Login response received:', { user: data.user?.email, hasToken: !!data.token });
    return data;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
};

export const register = async (formData) => {
  try {
    console.log('📝 Sending registration request to:', `${API_URL}/auth/register`);
    console.log('📝 Registration data:', { ...formData, password: '***' });

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || "Registration failed";
      console.error('❌ Registration failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Registration response received:', { user: data.user?.email, hasToken: !!data.token });
    return data;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
};

export const logOut = () => {
  console.log('🚪 Logging out user');
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
