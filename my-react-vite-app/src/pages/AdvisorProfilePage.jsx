import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdvisorLayout from '../components/layouts/AdvisorLayout';

const AdvisorProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError('');

      const profileResponse = await api.get('/auth/profile');
      const profileData = profileResponse.data.data;
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        department: profileData.department || '',
        officeLocation: profileData.officeLocation || '',
        officeHours: profileData.officeHours || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      await api.put('/auth/profile', formData);

      setProfile(prev => ({
        ...prev,
        ...formData
      }));

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      department: profile.department || '',
      officeLocation: profile.officeLocation || '',
      officeHours: profile.officeHours || ''
    });
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <AdvisorLayout>
        <LoadingSpinner />
      </AdvisorLayout>
    );
  }

  return (
    <AdvisorLayout>
      <div className="min-h-screen bg-[#020617] p-4 lg:p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] opacity-50" />
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Advisor Profile</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Registry Management & Personal Credentials</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center gap-3 border border-indigo-400/30 group active:scale-95"
            >
              ✏️ Modify Credentials
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95"
                disabled={saving}
              >
                Abort Changes
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl border border-indigo-400/30 active:scale-95"
                disabled={saving}
              >
                {saving ? 'Transmitting...' : '💾 Finalize Protocol'}
              </button>
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* Left Column - Profile Card */}
          <div className="xl:col-span-4 space-y-10">
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/5 shadow-3xl text-center relative overflow-hidden group">
              {/* Aesthetic Background Element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />

              <div className="relative z-10">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl shadow-2xl mx-auto mb-8 border-4 border-white/5 transform group-hover:rotate-6 transition-transform">
                  👨‍🏫
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-8">
                  Senior {profile?.role} Protocol
                </p>

                <div className="bg-slate-950/50 rounded-3xl p-6 border border-white/5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Authenticated Domain</p>
                  <p className="text-white font-bold truncate text-sm">{profile?.email}</p>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/5 blur-[80px] rounded-full" />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[40px] p-10 border border-white/5 shadow-xl">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="w-1 h-3 bg-indigo-500 rounded-full" />
                Operational Metrics
              </h3>
              <div className="space-y-6">
                <MetricItem label="Entity Load" value="13 Students" color="text-indigo-400" />
                <MetricItem label="Priority Alerts" value="3 Critical" color="text-red-400" />
                <MetricItem label="Active Strategies" value="5 Managed" color="text-orange-400" />
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="xl:col-span-8 space-y-10">
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 lg:p-12 border border-white/5 shadow-3xl">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10">Identity Telemetry</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputField
                  label="First Identity"
                  name="firstName"
                  value={formData.firstName}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  displayValue={profile?.firstName}
                />
                <InputField
                  label="Last Identity"
                  name="lastName"
                  value={formData.lastName}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  displayValue={profile?.lastName}
                />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Network Access</label>
                  <div className="p-5 bg-slate-950/50 border border-white/[0.02] rounded-2xl text-slate-600 text-sm font-bold">
                    {profile?.email} (Restricted Entry)
                  </div>
                </div>
                <InputField
                  label="Comms Frequency"
                  name="phone"
                  value={formData.phone}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  displayValue={profile?.phone}
                  placeholder="+251-XXX-XXX-XXX"
                />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 lg:p-12 border border-white/5 shadow-3xl">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10">Institutional Domain</h3>

              <div className="grid grid-cols-1 gap-10">
                <InputField
                  label="Assigned Sector"
                  name="department"
                  value={formData.department}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  displayValue={profile?.department}
                  placeholder="e.g., Computer Science Faculty"
                />
                <InputField
                  label="Station Coordinates"
                  name="officeLocation"
                  value={formData.officeLocation}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  displayValue={profile?.officeLocation}
                  placeholder="e.g., Block 04, Room 205"
                />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Engagement Window</label>
                  {isEditing ? (
                    <textarea
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
                      placeholder="e.g., Monday-Friday: 14:00 - 16:00"
                    />
                  ) : (
                    <div className="p-5 bg-slate-950/50 border border-white/[0.02] rounded-2xl text-white text-sm font-bold white-space-pre-wrap leading-relaxed min-h-[60px]">
                      {profile?.officeHours || 'Awaiting synchronization...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdvisorLayout>
  );
};

const MetricItem = ({ label, value, color }) => (
  <div className="flex justify-between items-center p-5 bg-slate-950/50 rounded-2xl border border-white/[0.02]">
    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
    <span className={`font-black uppercase tracking-tighter ${color}`}>{value}</span>
  </div>
);

const InputField = ({ label, name, value, isEditing, onChange, displayValue, placeholder }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      />
    ) : (
      <div className="p-5 bg-slate-950/50 border border-white/[0.02] rounded-2xl text-white text-sm font-bold">
        {displayValue || 'Uninitialized'}
      </div>
    )}
  </div>
);

export default AdvisorProfilePage;
