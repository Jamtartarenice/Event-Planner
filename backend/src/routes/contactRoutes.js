const express = require('express');
const { handleContactForm, getContacts } = require('../controllers/contactController');
const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Handle contact form submission
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the person contacting
 *               email:
 *                 type: string
 *                 description: The email of the person contacting
 *               message:
 *                 type: string
 *                 description: The message from the person contacting
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       500:
 *         description: Internal server error
 */
router.post('/', handleContactForm);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get contact form submissions
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of contact form submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the contact form submission
 *                   name:
 *                     type: string
 *                     description: The name of the person contacting
 *                   email:
 *                     type: string
 *                     description: The email of the person contacting
 *                   message:
 *                     type: string
 *                     description: The message from the person contacting
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The time the contact form submission was created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', getContacts);

module.exports = router;
