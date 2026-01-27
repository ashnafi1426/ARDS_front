import { useState } from 'react';
import PropTypes from 'prop-types';

const InterventionPlanning = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'academic_support',
    description: '',
    goals: '',
    actionItems: '',
    timeline: '2_weeks',
    priority: 'medium',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert action items from text to array
    const actionItemsArray = formData.actionItems
      .split('\n')
      .filter(item => item.trim() !== '');
    
    onSubmit({
      ...formData,
      actionItems: actionItemsArray
    });
  };

  return (
    <form onSubmit={handleSubmit} className="intervention-planning-form" style={{ padding: '1.5rem' }}>
      {student && (
        <div style={{ 
          padding: '1rem', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          marginBottom: '1.5rem'
        }}>
          <strong>Student:</strong> {student.user?.firstName} {student.user?.lastName} ({student.id})
        </div>
      )}

      <div className="form-group">
        <label htmlFor="type">Intervention Type *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="academic_support">Academic Support</option>
          <option value="tutoring">Tutoring</option>
          <option value="counseling">Counseling</option>
          <option value="mentoring">Mentoring</option>
          <option value="study_skills">Study Skills Workshop</option>
          <option value="time_management">Time Management</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="form-input"
          placeholder="Describe the intervention plan..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="goals">Goals & Objectives *</label>
        <textarea
          id="goals"
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          required
          rows="3"
          className="form-input"
          placeholder="What do you hope to achieve?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="actionItems">Action Items (one per line) *</label>
        <textarea
          id="actionItems"
          name="actionItems"
          value={formData.actionItems}
          onChange={handleChange}
          required
          rows="4"
          className="form-input"
          placeholder="Schedule weekly meetings&#10;Provide study materials&#10;Monitor progress"
        />
      </div>

      <div className="form-group">
        <label htmlFor="timeline">Timeline *</label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="1_week">1 Week</option>
          <option value="2_weeks">2 Weeks</option>
          <option value="1_month">1 Month</option>
          <option value="2_months">2 Months</option>
          <option value="semester">Full Semester</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority Level *</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
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
          Create Intervention Plan
        </button>
      </div>
    </form>
  );
};

InterventionPlanning.propTypes = {
  student: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InterventionPlanning;
