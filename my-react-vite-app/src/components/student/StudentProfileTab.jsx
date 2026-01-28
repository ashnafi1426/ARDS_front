import { useState, useEffect } from 'react';
import api from '../../config/api';
import studentService from '../../services/student.service';

const StudentProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching profile from backend API');
      
      // Call backend API to get profile
      const response = await studentService.getStudentProfile();
      
      if (response.status === 'success' && response.data) {
        const studentData = response.data;
        
        // Transform backend data to frontend format
        const profileData = {
          id: studentData.user_id,
          firstName: studentData.full_name?.split(' ')[0] || 'Student',
          lastName: studentData.full_name?.split(' ').slice(1).join(' ') || 'User',
          email: studentData.users?.email || '',
          phone: '+1 (555) 123-4567', // TODO: Add phone to database
          dateOfBirth: '2000-01-01', // TODO: Add DOB to database
          address: 'University Campus', // TODO: Add address to database
          emergencyContact: {
            name: 'Emergency Contact',
            relationship: 'Parent',
            phone: '+1 (555) 987-6543',
            email: 'emergency@email.com'
          }, // TODO: Add emergency contact to database
          createdAt: studentData.created_at,
          updatedAt: studentData.updated_at
        };

        const academicData = {
          studentId: studentData.student_id,
          program: studentData.department || 'Computer Science',
          year: studentData.year_of_study || 2,
          gpa: parseFloat(studentData.gpa) || 0.0,
          enrollmentDate: '2022-09-01', // TODO: Add to database
          expectedGraduation: '2025-05-15', // TODO: Add to database
          currentRiskLevel: studentData.risk_level?.toLowerCase() || 'low',
          advisor: {
            name: 'Academic Advisor', // TODO: Join with advisor data
            email: 'advisor@university.edu',
            office: 'Main Building, Room 101'
          },
          lastAssessment: new Date().toISOString(),
          attendance: 95 // TODO: Calculate from attendance table
        };

        setProfile(profileData);
        setFormData(profileData);
        setStudentData(academicData);
        
        console.log('✅ Profile loaded successfully from backend');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Error fetching profile data:', error);
      setError('Failed to load profile data. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Updating profile via backend API');
      
      // Prepare data for backend API
      const updateData = {
        email: formData.email,
        full_name: `${formData.firstName} ${formData.lastName}`,
        // Note: phone, dateOfBirth, address, emergencyContact not yet in database schema
        // TODO: Add these fields to database schema and update here
      };
      
      // Call backend API to update profile
      const response = await studentService.updateStudentProfile(updateData);
      
      if (response.status === 'success') {
        // Update local state with new data
        setProfile(formData);
        
        // Update localStorage user session if email changed
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (formData.email !== currentUser.email) {
          const updatedUser = {
            ...currentUser,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('🔄 Updated current user session');
        }
        
        setSuccess(`Profile updated successfully! ${formData.email !== profile.email ? 'Email has been updated in the database.' : ''}`);
        setIsEditing(false);
        
        console.log('✅ Profile update complete:', {
          email: formData.email,
          timestamp: new Date().toISOString()
        });
        
        // Refresh profile data from backend
        await fetchProfileData();
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object properties (like emergencyContact.name)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const getRiskColor = (level) => {
    if (!level) return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    
    const colors = {
      low: 'bg-green-600/20 text-green-400 border-green-500/30',
      moderate: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-red-600/20 text-red-400 border-red-500/30'
    };
    return colors[level] || 'bg-gray-600/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Profile Management</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Profile Overview */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-400 p-1">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl shadow-inner">
              👤
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">
              {profile?.firstName} {profile?.lastName}
            </h3>
            <p className="text-gray-400">Student</p>
            <div className="flex items-center gap-4 mt-3">
              <span className={`px-3 py-1 text-xs rounded-full border ${getRiskColor(studentData?.currentRiskLevel)}`}>
                Risk: {studentData?.currentRiskLevel?.toUpperCase() || 'LOW'}
              </span>
              <span className="text-gray-400 text-sm">
                GPA: {studentData?.gpa?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">First Name</div>
            <div className="text-sm text-white">{profile?.firstName}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Last Name</div>
            <div className="text-sm text-white">{profile?.lastName}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Date of Birth</div>
            <div className="text-sm text-white">{profile?.dateOfBirth}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Email</div>
            <div className="text-sm text-white font-mono">{profile?.email}</div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Student ID</div>
            <div className="text-sm font-medium text-blue-400 font-mono">{studentData?.studentId}</div>
            <div className="text-xs text-gray-500 mt-1">Read-only</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Program</div>
            <div className="text-sm font-medium text-white">{studentData?.program}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Year</div>
            <div className="text-sm font-medium text-white">{studentData?.year}</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">GPA</div>
            <div className="text-sm font-medium text-green-400">{studentData?.gpa?.toFixed(2)}</div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Email</div>
              <div className="text-sm text-white font-mono">{profile?.email}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Phone</div>
              <div className="text-sm text-white font-mono">{profile?.phone}</div>
            </div>
            <div className="md:col-span-2 bg-gray-700/50 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Address</div>
              <div className="text-sm text-white font-mono">{profile?.address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Information */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Academic Advisor</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center text-2xl">
            👨‍🏫
          </div>
          <div>
            <div className="text-sm font-medium text-white">{studentData?.advisor?.name}</div>
            <div className="text-xs text-gray-400">{studentData?.advisor?.email}</div>
            <div className="text-xs text-gray-400">{studentData?.advisor?.office}</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Emergency Contact</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center text-2xl">
            🚨
          </div>
          <div>
            <div className="text-sm font-medium text-white">{profile?.emergencyContact?.name}</div>
            <div className="text-xs text-gray-400">{profile?.emergencyContact?.relationship}</div>
            <div className="text-xs text-gray-400">{profile?.emergencyContact?.phone}</div>
            <div className="text-xs text-gray-400">{profile?.emergencyContact?.email}</div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                <p className="text-sm text-gray-400 mt-1">Update your personal information. Email changes will be used for login. Student ID cannot be changed.</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">This email will be used for login</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact?.name || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Relationship</label>
                    <input
                      type="text"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Email</label>
                    <input
                      type="email"
                      name="emergencyContact.email"
                      value={formData.emergencyContact?.email || ''}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex-1 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileTab;
