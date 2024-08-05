const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.googleAuth = (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.redirect(url);
};

exports.googleAuthCallback = async (req, res) => {
  const code = req.query.code || req.body.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email;
    const picture = payload.picture;

    // Check if the user already exists
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    if (existingUsers.length === 0) {
      // Insert the new user
      await pool.query('INSERT INTO users (email, password, role, google_access_token, google_picture_url) VALUES ($1, $2, $3, $4, $5)', [userEmail, '', 'user', tokens.access_token, picture]);
    } else {
      // Update the existing user's Google access token and picture
      await pool.query('UPDATE users SET google_access_token = $1, google_picture_url = $2 WHERE email = $3', [tokens.access_token, picture, userEmail]);
    }

    // Create JWT token for your application
    const jwtToken = jwt.sign({ sub: payload.sub, email: userEmail, role: 'user', picture }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: jwtToken, role: 'user' });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ error: 'Failed to exchange code for tokens' });
  }
};

exports.verifyToken = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed', error: err.message });
    }

    const { email } = decoded;
    const { rows } = await pool.query('SELECT role FROM users WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = rows[0].role;
    const newAccessToken = jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: newAccessToken, role });
  });
};

exports.makeStaff = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email, picture } = decoded;

    // Update the user's role to 'staff'
    await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['staff', email]);

    // Create a new JWT token with the updated role
    const newToken = jwt.sign({ email, role: 'staff', picture }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: newToken });
  } catch (error) {
    console.error('Error making user staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;

    // Fetch user profile information
    const { rows: userRows } = await pool.query('SELECT email, role, google_picture_url AS picture FROM users WHERE email = $1', [email]);
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
    `, [decoded.sub]);

    res.json({ profile, eventHistory: eventRows });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;
    const { name, picture } = req.body;

    await pool.query('UPDATE users SET name = $1, picture = $2 WHERE email = $3', [name, picture, email]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};