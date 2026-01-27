import { useState } from 'react';
import PropTypes from 'prop-types';

const MeetingScheduler = ({ student, students, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: student?.id || '',
    meetingType: 'one_on_one',
    date: '',
    time: '',
    duration: '30',
    location: '',
    platform: 'in_person',
    agenda: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-scheduler-form" style={{ padding: '1.5rem' }}>
      <div className="form-group">
        <label htmlFor="studentId">Student *</label>
        <select
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">Select a student...</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.user?.firstName} {s.user?.lastName} ({s.id})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="meetingType">Meeting Type *</label>
        <select
          id="meetingType"
          name="meetingType"
          value={formData.meetingType}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="one_on_one">One-on-One</option>
          <option value="group">Group Session</option>
          <option value="emergency">Emergency Meeting</option>
          <option value="follow_up">Follow-up</option>
          <option value="check_in">Regular Check-in</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time *</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (minutes) *</label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="platform">Platform/Location Type *</label>
        <select
          id="platform"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="in_person">In Person</option>
          <option value="zoom">Zoom</option>
          <option value="teams">Microsoft Teams</option>
          <option value="phone">Phone Call</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location/Meeting Link *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Office 301 or https://zoom.us/j/..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="agenda">Meeting Agenda *</label>
        <textarea
          id="agenda"
          name="agenda"
          value={formData.agenda}
          onChange={handleChange}
          required
          rows="4"
          className="form-input"
          placeholder="What will be discussed in this meeting?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="form-input"
          placeholder="Any additional information..."
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Schedule Meeting
        </button>
      </div>
    </form>
  );
};

MeetingScheduler.propTypes = {
  student: PropTypes.object,
  students: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default MeetingScheduler;
