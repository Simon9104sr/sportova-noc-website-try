import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateEvent() {
  const navigate = useNavigate();
  const [sportTypes, setSportTypes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport_type_id: '',
    location: '',
    event_date: '',
    duration_minutes: 60,
    max_participants: 20,
    difficulty_level: 'intermediate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSportTypes();
  }, []);

  const fetchSportTypes = async () => {
    try {
      const response = await axios.get('/api/events');
      // Extract unique sport types from events
      const uniqueSports = [...new Set(response.data.map(e => ({ id: e.sport_type_id, name: e.sport_type })))];
      setSportTypes([
        { id: 1, name: 'Football' },
        { id: 2, name: 'Basketball' },
        { id: 3, name: 'Tennis' },
        { id: 4, name: 'Volleyball' },
        { id: 5, name: 'Running' },
        { id: 6, name: 'Cycling' },
        { id: 7, name: 'Swimming' },
        { id: 8, name: 'Badminton' },
        { id: 9, name: 'Table Tennis' },
        { id: 10, name: 'Gym' }
      ]);
    } catch (err) {
      console.error('Failed to fetch sport types');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h2>Create New Event</h2>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Sport Type *</label>
          <select
            name="sport_type_id"
            value={formData.sport_type_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a sport</option>
            {sportTypes.map(sport => (
              <option key={sport.id} value={sport.id}>{sport.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date & Time *</label>
          <input
            type="datetime-local"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="15"
            max="480"
          />
        </div>

        <div className="form-group">
          <label>Max Participants</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="2"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Difficulty Level</label>
          <select
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;