import React from 'react';

const ProgressTracker = ({ courses }) => {
  if (!courses || courses.length === 0) return <p>No courses enrolled.</p>;

  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <div key={c.enrollment_id} className="bg-white p-3 rounded shadow">
          <h4 className="font-bold">{c.courses.course_name}</h4>
          <p>Progress: {c.progress || 0}%</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
