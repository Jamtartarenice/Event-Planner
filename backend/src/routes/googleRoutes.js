const express = require('express');
const googleController = require('../controllers/googleController');

const router = express.Router();

/**
 * @swagger
 * /google/auth:
 *   get:
 *     summary: Redirect to Google authentication URL
 *     tags: [Google]
 *     responses:
 *       302:
 *         description: Redirect to Google authentication URL
 *       500:
 *         description: Internal server error
 */
router.get('/auth', googleController.googleAuth);

/**
 * @swagger
 * /google/auth/callback:
 *   post:
 *     summary: Handle Google authentication callback
 *     tags: [Google]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Google authorization code
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for accessing the API
 *       500:
 *         description: Authentication failed
 */
router.post('/auth/callback', googleController.googleAuthCallback);

/**
 * @swagger
 * /google/google-calendar/add-event:
 *   post:
 *     summary: Add an event to the user's Google Calendar
 *     tags: [Google Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 description: Event summary
 *               description:
 *                 type: string
 *                 description: Event description
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start date and time of the event
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: End date and time of the event
 *     responses:
 *       200:
 *         description: Event successfully added to Google Calendar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: string
 *                   description: ID of the created event
 *       500:
 *         description: Failed to add event to Google Calendar
 */
router.post('/google-calendar/add-event', googleController.addGoogleCalendarEvent);

module.exports = router;
