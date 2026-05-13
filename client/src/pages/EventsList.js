import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EventsList({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading events...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Sports Events</h1>
        {user && <Link to="/create-event" style={{ padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', borderRadius: '4px' }}>+ Create Event</Link>}
      </div>

      {error && <div className="error">{error}</div>}

      {events.length === 0 ? (
        <p>No events available yet. {user ? 'Create one!' : 'Login to create an event.'}</p>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h2 className="event-title">{event.title}</h2>
                <span className="sport-badge">{event.sport_type}</span>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-meta">
                <div className="meta-item">📍 {event.location}</div>
                <div className="meta-item">📅 {new Date(event.event_date).toLocaleDateString()}</div>
                <div className="meta-item">⏱️ {event.duration_minutes} min</div>
                <div className="meta-item">👤 {event.creator_name}</div>
              </div>
              <div className="event-stats">
                <div className="stat">
                  <div className="stat-label">Participants</div>
                  <div className="stat-value">{event.current_participants}/{event.max_participants}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Level</div>
                  <div className="stat-value">{event.difficulty_level}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Status</div>
                  <div className="stat-value">{event.status}</div>
                </div>
              </div>
              <div className="card-actions">
                <Link to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
                  <button>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;