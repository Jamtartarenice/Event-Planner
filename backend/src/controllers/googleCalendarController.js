const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.addEvent = async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('No authorization header provided');
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    // Get the user's Google access token from the database
    const { rows: users } = await pool.query('SELECT google_access_token FROM users WHERE email = $1', [decoded.email]);
    if (users.length === 0 || !users[0].google_access_token) {
      console.error('User not authenticated with Google');
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }

    const googleAccessToken = users[0].google_access_token;
    oauth2Client.setCredentials({ access_token: googleAccessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: new Date(startDateTime).toISOString(), // Ensure ISO 8601 format
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(), // Ensure ISO 8601 format
        timeZone: 'America/Los_Angeles',
      },
    };

    console.log('Creating event:', event);

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event created:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating calendar event:', error.message);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};
