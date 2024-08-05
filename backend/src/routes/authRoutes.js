const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2 consent screen
 */
router.get('/google', authController.googleAuth);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth2 callback (GET)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Google OAuth2 code
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Invalid code or other error
 */
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
  
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
  });

/**
 * @swagger
 * /auth/google/callback:
 *   post:
 *     summary: Handle Google OAuth2 callback (POST)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Google OAuth2 code
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Invalid code or other error
 */
router.post('/google/callback', authController.googleAuthCallback);

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token to verify
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *       401:
 *         description: Invalid token
 */
router.post('/verify-token', authController.verifyToken);

/**
 * @swagger
 * /auth/make-staff:
 *   post:
 *     summary: Make user a staff member
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User promoted to staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token with staff privileges
 *       401:
 *         description: Unauthorized
 */
router.post('/make-staff', authController.makeStaff);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User's email
 *                     role:
 *                       type: string
 *                       description: User's role
 *                     google_access_token:
 *                       type: string
 *                       description: Google access token
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authController.getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               role:
 *                 type: string
 *                 description: User's role
 *               google_access_token:
 *                 type: string
 *                 description: Google access token
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authController.updateProfile);

module.exports = router;
