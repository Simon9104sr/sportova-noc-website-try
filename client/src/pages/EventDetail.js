import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
      if (user && response.data.participants) {
        setIsParticipant(response.data.participants.some(p => p.id === user.id));
      }
    } catch (err) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/events/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/events/${id}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave event');
    }
  };

  if (loading) return <div className="container">Loading event...</div>;
  if (!event) return <div className="container">Event not found</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>← Back</button>

      {error && <div className="error">{error}</div>}

      <div className="event-card" style={{ maxWidth: '800px' }}>
        <div className="event-header">
          <h1 className="event-title">{event.title}</h1>
          <span className="sport-badge">{event.sport_type}</span>
        </div>

        <p className="event-description">{event.description}</p>

        <div className="event-meta">
          <div className="meta-item">📍 {event.location}</div>
          <div className="meta-item">📅 {new Date(event.event_date).toLocaleDateString()} {new Date(event.event_date).toLocaleTimeString()}</div>
          <div className="meta-item">⏱️ {event.duration_minutes} minutes</div>
          <div className="meta-item">👤 Created by: {event.creator_name}</div>
        </div>

        <div className="event-stats">
          <div className="stat">
            <div className="stat-label">Participants</div>
            <div className="stat-value">{event.current_participants}/{event.max_participants}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Level</div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>{event.difficulty_level}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Status</div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>{event.status}</div>
          </div>
        </div>

        <h3>Participants ({event.participants?.length || 0})</h3>
        <ul style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
          {event.participants?.map(p => (
            <li key={p.id}>{p.full_name} (@{p.username})</li>
          ))}
        </ul>

        <div className="card-actions">
          {user ? (
            <>
              {isParticipant ? (
                <button onClick={handleLeaveEvent} className="btn-secondary">Leave Event</button>
              ) : (
                <button onClick={handleJoinEvent} disabled={event.current_participants >= event.max_participants}>
                  {event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
                </button>
              )}
            </>
          ) : (
            <p>Please <a href="/login">login</a> to join this event</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;