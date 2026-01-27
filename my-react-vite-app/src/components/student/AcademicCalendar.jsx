import { useState, useEffect } from 'react';

const AcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    generateEvents();
  }, []);

  const generateEvents = () => {
    const now = new Date();
    const mockEvents = [
      {
        id: 1,
        title: 'Midterm Exams',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        type: 'exam',
        icon: '📝'
      },
      {
        id: 2,
        title: 'Assignment Due: Math 101',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        type: 'assignment',
        icon: '📚'
      },
      {
        id: 3,
        title: 'Project Presentation',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        type: 'presentation',
        icon: '🎤'
      },
      {
        id: 4,
        title: 'Study Group Session',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        type: 'study',
        icon: '👥'
      },
      {
        id: 5,
        title: 'Advisor Meeting',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        type: 'meeting',
        icon: '👨‍🏫'
      },
      {
        id: 6,
        title: 'Final Exams Begin',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30),
        type: 'exam',
        icon: '📝'
      }
    ];

    setEvents(mockEvents.sort((a, b) => a.date - b.date));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: '#f44336',
      assignment: '#2196f3',
      presentation: '#ff9800',
      study: '#4caf50',
      meeting: '#9c27b0'
    };
    return colors[type] || '#757575';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const upcomingEvents = events.filter(event => event.date >= new Date()).slice(0, 5);

  return (
    <div className="academic-calendar">
      {upcomingEvents.length > 0 ? (
        <div className="event-list">
          {upcomingEvents.map(event => (
            <div 
              key={event.id}
              className="event-item"
              style={{
                padding: '1rem',
                borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                backgroundColor: '#f9f9f9',
                marginBottom: '0.75rem',
                borderRadius: '4px',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{event.icon}</span>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#333' }}>
                      {event.title}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.85rem', 
                      color: '#666' 
                    }}>
                      {event.date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: getEventTypeColor(event.type),
                  color: 'white'
                }}>
                  {formatDate(event.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>📆 No upcoming events.</p>
          <p style={{ fontSize: '0.9rem' }}>Check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default AcademicCalendar;
