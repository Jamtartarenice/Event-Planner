const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProfile = async (req, res) => {
  try {
    const { email } = req.user;

    // Fetch user profile information
    const { rows: userRows } = await pool.query('SELECT email, role, google_access_token, google_picture_url FROM users WHERE email = $1', [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = userRows[0];

    // Fetch event history for the user
    const { rows: eventRows } = await pool.query(`
      SELECT e.id, e.name, e.date 
      FROM events e
      JOIN event_signups es ON e.id = es.event_id
      WHERE es.user_id = $1
    `, [req.user.sub]);

    res.json({ profile, eventHistory: eventRows });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
