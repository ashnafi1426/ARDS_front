import { useState } from 'react';
import studentService from '../../services/student.service';

const SelfCheckForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    stress_level: 3,
    study_hours: 2,
    workload_difficulty: 3,
    sleep_quality: 3,
    financial_concern: 3,
    motivation_level: 3,
    attendance_rate: 'YES_100',  // New field for attendance self-check
    assignment_completion: 'MOST_COMPLETED',  // New field for assignment progress
    comments: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('🔍 Form data being submitted:', formData);
      console.log('📋 attendance_rate:', formData.attendance_rate);
      console.log('📋 assignment_completion:', formData.assignment_completion);
      
      await studentService.submitSelfCheck(formData);
      onSubmitSuccess();
      setError('');
    } catch (err) {
      console.error('❌ Form submission error:', err);
      setError('Failed to submit self-check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-bold">Self-Assessment Form</h3>
      {error && <p className="text-red-600">{error}</p>}
      
      {/* Existing self-check fields */}
      {['stress_level', 'study_hours', 'workload_difficulty', 'sleep_quality', 'financial_concern', 'motivation_level'].map((field) => (
        <div key={field}>
          <label className="block font-medium capitalize">{field.replace(/_/g, ' ')}</label>
          <input
            type="number"
            min="1"
            max="5"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      ))}
      
      {/* COMPONENT 5: ASSIGNMENT & STUDY PROGRESS */}
      <div className="border-t pt-4">
        <label className="block font-bold text-lg mb-2">Assignment & Study Progress</label>
        <p className="text-sm text-gray-600 mb-3">How many of your assignments have you completed this week?</p>
        <div className="space-y-2">
          {[
            { value: 'ALL_COMPLETED', label: 'All Completed' },
            { value: 'MOST_COMPLETED', label: 'Most Completed (75%+)' },
            { value: 'SOME_COMPLETED', label: 'Some Completed (50-74%)' },
            { value: 'NONE_COMPLETED', label: 'Few or None (<50%)' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="assignment_completion"
                value={option.value}
                checked={formData.assignment_completion === option.value}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* COMPONENT 6: ATTENDANCE SELF-CHECK */}
      <div className="border-t pt-4">
        <label className="block font-bold text-lg mb-2">Attendance Self-Check</label>
        <p className="text-sm text-gray-600 mb-3">How often did you attend classes this week?</p>
        <div className="space-y-2">
          {[
            { value: 'YES_100', label: 'Yes (100%)' },
            { value: 'MOSTLY_75_99', label: 'Mostly (75-99%)' },
            { value: 'SOME_50_74', label: 'Some (50-74%)' },
            { value: 'RARELY_BELOW_50', label: 'Rarely (<50%)' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="attendance_rate"
                value={option.value}
                checked={formData.attendance_rate === option.value}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Comments */}
      <div className="border-t pt-4">
        <label className="block font-medium">Additional Comments (Optional)</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          rows="3"
          placeholder="Any additional thoughts or concerns..."
        />
      </div>
      
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:bg-gray-400" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Self-Check'}
      </button>
    </form>
  );
};

export default SelfCheckForm;
