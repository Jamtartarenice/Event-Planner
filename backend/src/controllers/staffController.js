const pool = require('../config/db');

const getStaffEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching staff events:', error);
    res.status(500).json({ error: 'Failed to fetch staff events' });
  }
};

const getSignups = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(`
      SELECT es.id, es.event_id, es.user_id, u.email 
      FROM event_signups es
      LEFT JOIN users u ON es.user_id = u.id
      WHERE es.event_id = $1
    `, [eventId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No signups found for this event' });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
};

module.exports = {
  getStaffEvents,
  getSignups,
};
