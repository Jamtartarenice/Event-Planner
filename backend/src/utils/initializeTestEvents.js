// backend/src/utils/initializeTestEvents.js
const pool = require('../config/db');

async function initializeTestEvents() {
  try {
    const { rowCount } = await pool.query('SELECT * FROM events');
    if (rowCount === 0) {
      const testEvents = [
        { name: 'Test Event 1', date: '2024-07-20' },
        { name: 'Test Event 2', date: '2024-08-15' },
        { name: 'Test Event 3', date: '2024-09-10' },
      ];

      for (const event of testEvents) {
        await pool.query(
          'INSERT INTO events (name, date) VALUES ($1, $2)',
          [event.name, event.date]
        );
      }
      console.log('Test events added to the database.');
    } else {
      console.log('Test events already exist in the database.');
    }
  } catch (error) {
    console.error('Failed to initialize test events:', error);
  }
}

module.exports = initializeTestEvents;