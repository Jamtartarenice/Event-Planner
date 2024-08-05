const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const staffRoutes = require('./routes/staffRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { serve, setup } = require('./utils/swagger'); 
const profileRoutes = require('./routes/profileRoutes');

dotenv.config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || 'development'}`,
});

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONT_END,
  credentials: true
}));

// Use routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/google-calendar', googleCalendarRoutes); 
app.use('/staff', staffRoutes);
app.use('/contacts', contactRoutes);
app.use('/profile', profileRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Setup Swagger
app.use('/api-docs', serve, setup);

app.get('/', (req, res) => {
  res.send('Event Planner Backend');
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

module.exports = app;