const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

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
  const { code } = req.body;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Tokens received from Google:', tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email;

    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    if (existingUsers.length === 0) {
      await pool.query('INSERT INTO users (email, password, role, google_access_token) VALUES ($1, $2, $3, $4)', [userEmail, '', 'user', tokens.access_token]);
    } else {
      await pool.query('UPDATE users SET google_access_token = $1 WHERE email = $2', [tokens.access_token, userEmail]);
    }

    const jwtToken = jwt.sign({ sub: payload.sub, email: userEmail, role: 'user' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: jwtToken });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Authentication failed');
  }
};

exports.addEventToGoogleCalendar = async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Get the user's Google access token from the database
    const { rows: users } = await pool.query('SELECT google_access_token FROM users WHERE email = $1', [decoded.email]);
    if (users.length === 0 || !users[0].google_access_token) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }

    const googleAccessToken = users[0].google_access_token;
    oauth2Client.setCredentials({ access_token: googleAccessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime, // Ensure this is in ISO 8601 format
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endDateTime, // Ensure this is in ISO 8601 format
        timeZone: 'America/Los_Angeles',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating calendar event:', error.message);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};