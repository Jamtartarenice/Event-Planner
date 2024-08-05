const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The event ID
 *                   name:
 *                     type: string
 *                     description: The event name
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the event
 *                   description:
 *                     type: string
 *                     description: The event description
 *                   location:
 *                     type: string
 *                     description: The location of the event
 *       500:
 *         description: Internal server error
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The event name
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the event
 *               description:
 *                 type: string
 *                 description: The event description
 *               location:
 *                 type: string
 *                 description: The location of the event
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The event ID
 *                 name:
 *                   type: string
 *                   description: The event name
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The date of the event
 *                 description:
 *                   type: string
 *                   description: The event description
 *                 location:
 *                   type: string
 *                   description: The location of the event
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', eventController.createEvent);

/**
 * @swagger
 * /events/{id}/signup:
 *   post:
 *     summary: Sign up for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The event ID
 *     responses:
 *       201:
 *         description: Successfully signed up for the event
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/:id/signup', eventController.signUpForEvent);

module.exports = router;
