# 📚 Frontend Services Usage Guide

This guide shows you how to use the frontend services to connect with the backend API effectively.

## 🏗️ Service Architecture

```
src/services/
├── auth.service.js          # Authentication (login, register, logout)
├── student.service.js       # Student operations (profile, self-check, etc.)
├── login.service.jsx        # Legacy login service (can be replaced)
└── SERVICE_USAGE_GUIDE.md   # This file
```

## 🔐 Authentication Service

### Import the Service

```javascript
import authService from '../services/auth.service';
// OR import specific functions
import { login, register, logout } from '../services/auth.service';
```

### Example 1: Login Component

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login service
      const response = await authService.login(formData);
      
      // Store auth data
      authService.storeAuthData(response.user, response.token);
      
      // Redirect based on role
      if (response.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (response.user.role === 'advisor') {
        navigate('/advisor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Example 2: Register Component

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    department: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call register service
      const response = await authService.register(formData);
      
      // Store auth data
      authService.storeAuthData(response.user, response.token);
      
      // Redirect to dashboard
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* Form fields */}
    </form>
  );
};
```

### Example 3: Logout

```javascript
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};
```

### Example 4: Check Authentication

```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const ProtectedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Protected Content</div>;
};
```

## 👨‍🎓 Student Service

### Import the Service

```javascript
import studentService from '../services/student.service';
// OR import specific functions
import { 
  getStudentProfile, 
  updateStudentProfile,
  submitSelfCheck 
} from '../services/student.service';
```

### Example 1: Get Student Profile

```javascript
import { useState, useEffect } from 'react';
import studentService from '../services/student.service';

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudentProfile();
      setProfile(response.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile?.full_name}</p>
      <p>Email: {profile?.email}</p>
      <p>Department: {profile?.department}</p>
      <p>GPA: {profile?.gpa}</p>
      <p>Risk Level: {profile?.risk_level}</p>
    </div>
  );
};
```

### Example 2: Update Student Profile

```javascript
import { useState } from 'react';
import studentService from '../services/student.service';

const EditProfileForm = ({ currentProfile }) => {
  const [formData, setFormData] = useState({
    full_name: currentProfile.full_name,
    department: currentProfile.department,
    year_of_study: currentProfile.year_of_study
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await studentService.updateStudentProfile(formData);
      setSuccess('Profile updated successfully!');
      console.log('Updated profile:', response.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        placeholder="Full Name"
      />
      
      <input
        type="text"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        placeholder="Department"
      />
      
      <input
        type="number"
        value={formData.year_of_study}
        onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
        placeholder="Year of Study"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};
```

### Example 3: Submit Self-Check

```javascript
import { useState } from 'react';
import studentService from '../services/student.service';

const SelfCheckForm = () => {
  const [formData, setFormData] = useState({
    stress_level: 3,
    study_hours: 5,
    workload_difficulty: 3,
    sleep_quality: 3,
    financial_concern: 2,
    motivation_level: 4,
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await studentService.submitSelfCheck(formData);
      setSuccess('Self-check submitted successfully!');
      console.log('Self-check response:', response);
      
      // Reset form
      setFormData({
        stress_level: 3,
        study_hours: 5,
        workload_difficulty: 3,
        sleep_quality: 3,
        financial_concern: 2,
        motivation_level: 4,
        comments: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      
      <label>
        Stress Level (1-5):
        <input
          type="range"
          min="1"
          max="5"
          value={formData.stress_level}
          onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
        />
        <span>{formData.stress_level}</span>
      </label>
      
      <label>
        Study Hours:
        <input
          type="number"
          value={formData.study_hours}
          onChange={(e) => setFormData({ ...formData, study_hours: parseInt(e.target.value) })}
        />
      </label>
      
      <label>
        Comments:
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Any additional comments..."
        />
      </label>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Self-Check'}
      </button>
    </form>
  );
};
```

### Example 4: Get Notifications

```javascript
import { useState, useEffect } from 'react';
import studentService from '../services/student.service';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudentNotifications();
      setNotifications(response.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.notification_id}>
              <strong>{notif.message}</strong>
              <span>Priority: {notif.priority}</span>
              <span>Read: {notif.is_read ? 'Yes' : 'No'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Example 5: Get Risk History

```javascript
import { useState, useEffect } from 'react';
import studentService from '../services/student.service';

const RiskHistoryPage = () => {
  const [riskHistory, setRiskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRiskHistory();
  }, []);

  const fetchRiskHistory = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudentRiskHistory();
      setRiskHistory(response.riskHistory || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading risk history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Risk History</h1>
      {riskHistory.length === 0 ? (
        <p>No risk history available</p>
      ) : (
        <ul>
          {riskHistory.map((record) => (
            <li key={record.risk_history_id}>
              <span>Score: {record.risk_score}</span>
              <span>Level: {record.risk_level}</span>
              <span>Date: {new Date(record.calculated_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Example 6: Get Courses

```javascript
import { useState, useEffect } from 'react';
import studentService from '../services/student.service';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudentCourses();
      setCourses(response.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Courses</h1>
      {courses.length === 0 ? (
        <p>No courses enrolled</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.course_id}>
              <strong>{course.course_code}</strong>: {course.course_name}
              <span>Department: {course.department}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## 🔄 Complete Dashboard Example

Here's a complete example of a student dashboard using multiple services:

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import studentService from '../services/student.service';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [riskHistory, setRiskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch all dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const profileResponse = await studentService.getStudentProfile();
      setProfile(profileResponse.student);

      // Fetch notifications
      const notifResponse = await studentService.getStudentNotifications();
      setNotifications(notifResponse.notifications || []);

      // Fetch risk history
      const riskResponse = await studentService.getStudentRiskHistory();
      setRiskHistory(riskResponse.riskHistory || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {profile?.full_name || user?.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="card">
          <h2>Profile</h2>
          <p>Email: {profile?.email}</p>
          <p>Department: {profile?.department}</p>
          <p>GPA: {profile?.gpa}</p>
          <p>Risk Level: {profile?.risk_level}</p>
        </div>

        {/* Notifications Card */}
        <div className="card">
          <h2>Notifications ({notifications.length})</h2>
          {notifications.slice(0, 3).map((notif) => (
            <div key={notif.notification_id}>
              {notif.message}
            </div>
          ))}
        </div>

        {/* Risk History Card */}
        <div className="card">
          <h2>Risk History</h2>
          {riskHistory.slice(0, 5).map((record) => (
            <div key={record.risk_history_id}>
              {record.risk_level} - {record.risk_score}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
```

## 🎯 Best Practices

### 1. Error Handling

Always wrap service calls in try-catch blocks:

```javascript
try {
  const response = await studentService.getStudentProfile();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Error:', error.message);
  setError(error.message);
}
```

### 2. Loading States

Show loading indicators while fetching data:

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await studentService.getStudentProfile();
    // Handle response
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false); // Always stop loading
  }
};
```

### 3. Authentication Check

Always check authentication before making API calls:

```javascript
useEffect(() => {
  if (!authService.isAuthenticated()) {
    navigate('/login');
    return;
  }
  fetchData();
}, []);
```

### 4. Token Management

The services automatically handle tokens, but you can manually check:

```javascript
const token = authService.getAuthToken();
if (!token) {
  // Redirect to login
}
```

## 📊 API Response Format

All backend responses follow this format:

### Success Response
```json
{
  "student": {
    "id": "uuid",
    "email": "student@test.com",
    "full_name": "John Doe",
    "department": "Computer Science",
    "gpa": 3.5,
    "risk_level": "LOW"
  }
}
```

### Error Response
```json
{
  "message": "Error description here"
}
```

## 🚀 Quick Start Checklist

1. ✅ Import the service you need
2. ✅ Create state variables (data, loading, error)
3. ✅ Call service function in useEffect or event handler
4. ✅ Handle loading state
5. ✅ Handle error state
6. ✅ Display data

## 📝 Summary

- **auth.service.js**: Login, register, logout, check authentication
- **student.service.js**: Profile, self-check, notifications, risk history, courses, assignments
- All services use fetch API with proper headers
- All services include error handling and logging
- Token is automatically included in requests
- Follow the examples above for implementation

Happy coding! 🎉
