const express = require('express');
const router = express.Router();
const { getStaffEvents, getSignups } = require('../controllers/staffController');

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Endpoints for staff members
 */

/**
 * @swagger
 * /staff/events:
 *   get:
 *     summary: Get all events managed by staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved staff events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Event ID
 *                   name:
 *                     type: string
 *                     description: Event name
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Event date
 *                   description:
 *                     type: string
 *                     description: Event description
 *                   location:
 *                     type: string
 *                     description: Event location
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/events', getStaffEvents);

/**
 * @swagger
 * /staff/events/{eventId}/signups:
 *   get:
 *     summary: Get signups for a specific event managed by staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Successfully retrieved event signups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Signup ID
 *                   event_id:
 *                     type: integer
 *                     description: Event ID
 *                   user_id:
 *                     type: integer
 *                     description: User ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/events/:eventId/signups', getSignups);

module.exports = router;
