import React from 'react';

const NotificationsList = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return <p>No notifications</p>;

  return (
    <ul className="list-disc pl-5 space-y-2">
      {notifications.map((n) => (
        <li key={n.notification_id} className="bg-gray-100 p-2 rounded">
          {n.message} <span className="text-gray-500 text-sm">({new Date(n.created_at).toLocaleDateString()})</span>
        </li>
      ))}
    </ul>
  );
};

export default NotificationsList;
