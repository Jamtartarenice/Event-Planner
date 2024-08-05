const express = require('express');
const router = express.Router();
const verifyTokenController = require('../controllers/verifyTokenController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verify the authenticity of a token
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
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Token validity
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       description: User role
 *                       example: user
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/verify-token', verifyTokenController.verifyToken);

module.exports = router;
