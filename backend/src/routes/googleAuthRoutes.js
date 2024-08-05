const express = require('express');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Redirect to Google OAuth 2.0 authentication page
 *     tags: [Google OAuth]
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page
 */
router.get('/', (req, res) => {
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
});

/**
 * @swagger
 * /google/callback:
 *   post:
 *     summary: Handle Google OAuth 2.0 callback and exchange code for tokens
 *     tags: [Google OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code received from Google
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google and received tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for the application
 *       500:
 *         description: Authentication failed
 */
router.post('/callback', async (req, res) => {
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

    // Check if the user already exists
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    if (existingUsers.length === 0) {
      // Insert the new user
      await pool.query('INSERT INTO users (email, password, role, google_access_token) VALUES ($1, $2, $3, $4)', [userEmail, '', 'user', tokens.access_token]);
    } else {
      // Update the existing user's Google access token
      await pool.query('UPDATE users SET google_access_token = $1 WHERE email = $2', [tokens.access_token, userEmail]);
    }

    // Create JWT token for your application
    const jwtToken = jwt.sign({ sub: payload.sub, email: userEmail, role: 'user' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: jwtToken });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
