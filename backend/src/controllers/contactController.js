const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.handleContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ error: 'Failed to handle contact form' });
  }
};

exports.getContacts = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { role } = decoded;
  
      if (role !== 'staff') {
        return res.status(403).json({ message: 'Forbidden: Staff access required' });
      }
  
      const result = await pool.query('SELECT * FROM contacts');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  };