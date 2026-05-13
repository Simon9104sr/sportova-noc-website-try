const express = require('express');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all events with sport type info
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [events] = await conn.query(`
      SELECT e.*, st.name as sport_type, u.username as creator_name
      FROM events e
      JOIN sport_types st ON e.sport_type_id = st.id
      JOIN users u ON e.creator_id = u.id
      ORDER BY e.event_date ASC
    `);
    conn.release();

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Get single event with participants
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    const [events] = await conn.query(`
      SELECT e.*, st.name as sport_type, u.username as creator_name, u.id as creator_id
      FROM events e
      JOIN sport_types st ON e.sport_type_id = st.id
      JOIN users u ON e.creator_id = u.id
      WHERE e.id = ?
    `, [id]);

    if (events.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Event not found' });
    }

    const [participants] = await conn.query(`
      SELECT u.id, u.username, u.full_name
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = ? AND ep.status = 'joined'
    `, [id]);

    conn.release();

    res.json({
      ...events[0],
      participants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
});

// Create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, sport_type_id, location, event_date, duration_minutes, max_participants, difficulty_level } = req.body;

    if (!title || !sport_type_id || !location || !event_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO events (title, description, sport_type_id, creator_id, location, event_date, duration_minutes, max_participants, difficulty_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, sport_type_id, req.userId, location, event_date, duration_minutes || 60, max_participants || 20, difficulty_level || 'intermediate']
    );

    // Creator automatically joins the event
    await conn.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)',
      [result[0].insertId, req.userId]
    );

    conn.release();

    res.status(201).json({
      message: 'Event created successfully',
      eventId: result[0].insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// Update event (creator only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, event_date, max_participants, difficulty_level, status } = req.body;

    const conn = await pool.getConnection();
    
    // Check if user is event creator
    const [event] = await conn.query('SELECT creator_id FROM events WHERE id = ?', [id]);
    if (event.length === 0 || event[0].creator_id !== req.userId) {
      conn.release();
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    await conn.query(
      `UPDATE events SET title = ?, description = ?, location = ?, event_date = ?, max_participants = ?, difficulty_level = ?, status = ? WHERE id = ?`,
      [title, description, location, event_date, max_participants, difficulty_level, status, id]
    );

    conn.release();

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// Join event
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    // Check if event exists
    const [event] = await conn.query('SELECT current_participants, max_participants FROM events WHERE id = ?', [id]);
    if (event.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event[0].current_participants >= event[0].max_participants) {
      conn.release();
      return res.status(400).json({ message: 'Event is full' });
    }

    // Add participant
    try {
      await conn.query(
        'INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)',
        [id, req.userId]
      );

      // Update current participants count
      await conn.query(
        'UPDATE events SET current_participants = current_participants + 1 WHERE id = ?',
        [id]
      );

      conn.release();
      res.json({ message: 'Successfully joined event' });
    } catch (error) {
      conn.release();
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Already joined this event' });
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to join event', error: error.message });
  }
});

// Leave event
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    // Check if user is participant
    const [participant] = await conn.query(
      'SELECT * FROM event_participants WHERE event_id = ? AND user_id = ? AND status = "joined"',
      [id, req.userId]
    );

    if (participant.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'Not a participant of this event' });
    }

    // Remove participant
    await conn.query(
      'DELETE FROM event_participants WHERE event_id = ? AND user_id = ?',
      [id, req.userId]
    );

    // Update current participants count
    await conn.query(
      'UPDATE events SET current_participants = current_participants - 1 WHERE id = ?',
      [id]
    );

    conn.release();
    res.json({ message: 'Successfully left event' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to leave event', error: error.message });
  }
});

module.exports = router;