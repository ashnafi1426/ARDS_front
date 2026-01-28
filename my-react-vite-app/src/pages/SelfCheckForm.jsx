import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import studentService from '../services/student.service';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardLayout from '../components/layouts/DashboardLayout';

const SelfCheckForm = () => {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    weekNumber: 1,
    academicYear: '2025-2026',
    // Component 2: Stress Level Assessment
    stressLevel: 'Moderate',
    // Component 3: Workload Difficulty
    workloadDifficulty: 'Manageable',
    // Component 4: Time Management Status
    timeManagement: 'Average',
    // Component 5: Assignment & Study Progress
    assignmentProgress: 'Most completed',
    // Component 6: Attendance Self-Check
    attendancePercentage: 'Yes (100%)',
    // Component 7: Optional Comments
    notes: '',
    // Component 8: Submission Confirmation
    confirmAccuracy: false,
    // Legacy factors (keeping for backward compatibility)
    factors: {
      attendance: 100,
      assignmentCompletion: 100,
      examPerformance: 100,
      participationLevel: 5,
      mentalHealthScore: 5,
      financialStress: 5,
      socialEngagement: 5
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get('/health');
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    checkBackend();

    if (user) {
      fetchStudentId();

      const startDate = new Date('2025-09-01');
      const today = new Date();
      const diffTime = Math.abs(today - startDate);
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      const currentWeek = Math.min(Math.max(diffWeeks, 1), 52);

      setFormData(prev => ({
        ...prev,
        weekNumber: currentWeek
      }));
    }
  }, [user]);

  const fetchStudentId = async () => {
    try {
      setInitialLoading(true);
      setError('');

      const res = await api.get('/students', {
        params: { userId: user.id }
      });

      const students = res.data.data?.students || [];

      if (students.length > 0) {
        const student = students[0];
        const studentIdValue = student.id || student.studentId;

        setStudentId(studentIdValue);
        setStudentData(student);
      } else {
        setError('No student record found. Please contact your administrator.');
      }
    } catch (error) {
      setError('Failed to load student information.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.confirmAccuracy) {
      setError('Please confirm that the information provided is accurate.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError('');

    // Map the form data to the backend format
    const selfCheckData = {
      stress_level: formData.stressLevel === 'Very Low' ? 1 :
        formData.stressLevel === 'Low' ? 2 :
          formData.stressLevel === 'Moderate' ? 3 :
            formData.stressLevel === 'High' ? 4 : 5,
      workload_difficulty: formData.workloadDifficulty === 'Very Easy' ? 1 :
        formData.workloadDifficulty === 'Easy' ? 2 :
          formData.workloadDifficulty === 'Manageable' ? 3 :
            formData.workloadDifficulty === 'Difficult' ? 4 : 5,
      sleep_quality: formData.timeManagement === 'Very well' ? 5 :
        formData.timeManagement === 'Well' ? 4 :
          formData.timeManagement === 'Average' ? 3 :
            formData.timeManagement === 'Poor' ? 2 : 1,
      study_hours: formData.assignmentProgress === 'All completed' ? 40 :
        formData.assignmentProgress === 'Most completed' ? 30 :
          formData.assignmentProgress === 'Some completed' ? 20 : 10,
      financial_concern: 3, // Default middle value
      motivation_level: formData.attendancePercentage === 'Yes (100%)' ? 5 :
        formData.attendancePercentage === 'Mostly (75–99%)' ? 4 :
          formData.attendancePercentage === 'Some (50–74%)' ? 3 : 2,
      // NEW: Map attendance to backend format
      attendance_rate: formData.attendancePercentage === 'Yes (100%)' ? 'YES_100' :
        formData.attendancePercentage === 'Mostly (75–99%)' ? 'MOSTLY_75_99' :
          formData.attendancePercentage === 'Some (50–74%)' ? 'SOME_50_74' : 'RARELY_BELOW_50',
      // NEW: Map assignment progress to backend format
      assignment_completion: formData.assignmentProgress === 'All completed' ? 'ALL_COMPLETED' :
        formData.assignmentProgress === 'Most completed' ? 'MOST_COMPLETED' :
          formData.assignmentProgress === 'Some completed' ? 'SOME_COMPLETED' : 'NONE_COMPLETED',
      comments: formData.notes || ''
    };

    console.log('🔍 Submitting self-check data:', selfCheckData);
    console.log('📋 attendance_rate:', selfCheckData.attendance_rate);
    console.log('📋 assignment_completion:', selfCheckData.assignment_completion);

    try {
      const response = await studentService.submitSelfCheck(selfCheckData);

      if (response.status === 'success') {
        setSuccess(true);

        // Reset form
        setFormData({
          ...formData,
          stressLevel: 'Moderate',
          workloadDifficulty: 'Manageable',
          timeManagement: 'Average',
          assignmentProgress: 'Most completed',
          attendancePercentage: 'Yes (100%)',
          notes: '',
          confirmAccuracy: false
        });

        // Trigger a custom event to notify dashboard to refresh
        window.dispatchEvent(new CustomEvent('selfCheckSubmitted', {
          detail: { 
            riskData: response.data?.riskData,
            timestamp: new Date().toISOString()
          }
        }));

        setTimeout(() => setSuccess(false), 5000);
      }

    } catch (error) {
      let errorMessage = 'Failed to submit assessment. Please try again.';

      if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-10 space-y-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Intelligence Header */}
        <div className="relative">
          <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] opacity-50" />
          <h1 className="text-7xl font-[900] text-black tracking-tighter uppercase mb-2">Weekly Assessment</h1>
          <p className="text-blue-600 text-lg font-[900] uppercase tracking-[0.4em] opacity-80">Phase {formData.weekNumber} Performance Telemetry Submission</p>
        </div>

        {backendStatus === 'disconnected' && (
          <div className="bg-red-500 border-2 border-red-700 p-6 rounded-[32px] flex items-center gap-6">
            <span className="text-3xl">📡</span>
            <div>
              <h3 className="text-white font-[900] text-sm uppercase tracking-widest">Network Error</h3>
              <p className="text-white font-[900] text-base">Backend Link Diverted. Re-establish host connection.</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500 border-2 border-green-700 p-8 rounded-[32px] space-y-4">
            <div className="flex items-center gap-6">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="text-white font-[900] text-lg uppercase tracking-widest">Component 9: System Feedback</h3>
                <p className="text-white font-[900] text-xl">Assessment Successfully Submitted!</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 space-y-2">
              <p className="text-white font-[900] text-sm">✓ Form data saved to database</p>
              <p className="text-white font-[900] text-sm">✓ Risk score recalculated</p>
              <p className="text-white font-[900] text-sm">✓ Notification sent to your dashboard</p>
              <p className="text-white font-[900] text-sm">✓ Advisor has been notified (if risk level changed)</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-orange-500 border-2 border-orange-700 p-6 rounded-[32px] flex items-center gap-6">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-white font-[900] text-sm uppercase tracking-widest">Relay Exception</h3>
              <p className="text-white font-[900] text-base">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-[40px] flex items-start gap-8 relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 rounded-[24px] bg-blue-900 flex items-center justify-center text-3xl text-white shrink-0">
            ℹ️
          </div>
          <div className="space-y-2">
            <h3 className="text-black font-[900] text-xl uppercase tracking-widest">Deployment Directive</h3>
            <p className="text-black font-[900] text-lg leading-relaxed">Authorize your weekly performance metrics. This data will be ingested by the Risk Logic Engine to generate your academic health score.</p>
          </div>
        </div>

        {studentData && (
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border-4 border-blue-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-[900] text-3xl shadow-xl shrink-0">
                {studentData.user?.firstName?.charAt(0)}
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-gray-500 text-xs font-[900] uppercase tracking-widest">Component 1: Student Identification (Read-Only)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs font-[900] uppercase tracking-widest mb-1">Student ID</p>
                    <p className="text-black font-[900] text-xl">{studentData.id || studentData.studentId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-[900] uppercase tracking-widest mb-1">Student Name</p>
                    <p className="text-black font-[900] text-xl">{studentData.user?.firstName} {studentData.user?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-[900] uppercase tracking-widest mb-1">Department</p>
                    <p className="text-black font-[900] text-xl">{studentData.department || 'Not Specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-[900] uppercase tracking-widest mb-1">Semester / Week</p>
                    <p className="text-black font-[900] text-xl">Week {formData.weekNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-white rounded-[56px] p-10 lg:p-14 shadow-3xl space-y-16">
            <section className="space-y-10">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
                Temporal Sync
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-sm font-[900] text-black uppercase tracking-widest px-1">Observation Week</label>
                  <input
                    type="number" min="1" max="52"
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                    required
                    className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl p-6 text-black text-2xl font-[900] focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-[900] text-black uppercase tracking-widest px-1">Fiscal Cycle</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2025-2026"
                    required
                    className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl p-6 text-black text-2xl font-[900] focus:ring-4 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                Component 2: Stress Level Assessment
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-6 block">
                  How would you rate your academic stress level this week?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, stressLevel: level })}
                      className={`p-6 rounded-2xl font-[900] text-sm uppercase tracking-widest transition-all border-2 ${formData.stressLevel === level
                        ? 'bg-red-500 text-white border-red-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                Component 3: Workload Difficulty
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-6 block">
                  How difficult was your academic workload this week?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Very Easy', 'Easy', 'Manageable', 'Difficult', 'Very Difficult'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, workloadDifficulty: level })}
                      className={`p-6 rounded-2xl font-[900] text-sm uppercase tracking-widest transition-all border-2 ${formData.workloadDifficulty === level
                        ? 'bg-orange-500 text-white border-orange-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]" />
                Component 4: Time Management Status
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-6 block">
                  How well did you manage your study time this week?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Very well', 'Well', 'Average', 'Poor', 'Very poor'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeManagement: level })}
                      className={`p-6 rounded-2xl font-[900] text-sm uppercase tracking-widest transition-all border-2 ${formData.timeManagement === level
                        ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-300'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                Component 5: Assignment & Study Progress
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-6 block">
                  Did you complete your assignments and planned study tasks this week?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['All completed', 'Most completed', 'Some completed', 'None completed'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, assignmentProgress: level })}
                      className={`p-6 rounded-2xl font-[900] text-sm uppercase tracking-widest transition-all border-2 ${formData.assignmentProgress === level
                        ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                Component 6: Attendance Self-Check
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-6 block">
                  Did you attend all scheduled classes this week?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Yes (100%)', 'Mostly (75–99%)', 'Some (50–74%)', 'Rarely (<50%)'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, attendancePercentage: level })}
                      className={`p-6 rounded-2xl font-[900] text-sm uppercase tracking-widest transition-all border-2 ${formData.attendancePercentage === level
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                Component 7: Optional Comments
              </h2>
              <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px]">
                <label className="text-sm font-[900] text-black uppercase tracking-widest mb-4 block">
                  Is there anything affecting your studies that you would like to share?
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value.slice(0, 250) })}
                  rows="5"
                  maxLength="250"
                  placeholder="Academic-related context only..."
                  className="w-full bg-white border-2 border-gray-200 rounded-[24px] p-6 text-black font-[900] text-base focus:ring-4 focus:ring-purple-500 outline-none transition-all resize-none"
                />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-4xl font-[900] text-black uppercase tracking-tighter flex items-center gap-5">
                <span className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                Component 8: Submission Confirmation
              </h2>
              <div className="bg-indigo-50 border-2 border-indigo-200 p-8 rounded-[32px]">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.confirmAccuracy}
                    onChange={(e) => setFormData({ ...formData, confirmAccuracy: e.target.checked })}
                    required
                    className="w-8 h-8 rounded-lg border-2 border-indigo-300 text-indigo-600 focus:ring-4 focus:ring-indigo-500 cursor-pointer mt-1 shrink-0"
                  />
                  <span className="text-black font-[900] text-base leading-relaxed group-hover:text-indigo-600 transition-colors">
                    I confirm that the information provided is accurate and understand it will be used for risk assessment.
                  </span>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || !formData.confirmAccuracy}
              className="w-full h-24 bg-blue-600 hover:bg-blue-700 text-white rounded-[32px] font-[900] uppercase text-2xl tracking-[0.5em] shadow-4xl shadow-blue-500/30 transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center gap-8 relative"
            >
              {loading ? <span>Transmitting Payload...</span> : <span>Submit Assessment</span>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default SelfCheckForm;
