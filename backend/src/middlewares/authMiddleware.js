const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }
    req.user = decoded;
    next();
  });
};

const verifyStaffRole = async (req, res, next) => {
  const { email } = req.user;

  try {
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied, staff only' });
    }
    next();
  } catch (error) {
    console.error('Error verifying staff role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  verifyStaffRole,
};
