// backend/src/utils/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const serverUrl = process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : 'http://localhost:3000';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Planner API',
      version: '1.0.0',
      description: 'API for managing events'
    },
    servers: [
      {
        url: serverUrl
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { serve: swaggerUi.serve, setup: swaggerUi.setup(swaggerDocs) };
