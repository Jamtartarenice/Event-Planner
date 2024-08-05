const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Controller function to get all events
exports.getAllEvents = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
};

// Controller function to create a new event
exports.createEvent = async (req, res) => {
    const { name, date, description, location } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role !== 'staff') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
      const result = await pool.query('INSERT INTO events (name, date, description, location) VALUES ($1, $2, $3, $4) RETURNING *', [name, date, description, location]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
};

// Controller function to sign up for an event
exports.signUpForEvent = async (req, res) => {
  const eventId = req.params.id;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    const { rows } = await pool.query(
      'INSERT INTO event_signups (event_id, user_id) VALUES ($1, $2) RETURNING *',
      [eventId, decoded.sub]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error signing up for event:', error.message);
    res.status(500).json({ error: 'Failed to sign up for event' });
  }
};
