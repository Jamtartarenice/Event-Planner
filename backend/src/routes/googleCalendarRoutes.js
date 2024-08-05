const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarController');

/**
 * @swagger
 * /google-calendar/add-event:
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
router.post('/add-event', googleCalendarController.addEvent);

module.exports = router;
