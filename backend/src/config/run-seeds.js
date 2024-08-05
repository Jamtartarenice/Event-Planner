const { Pool } = require('pg');
const seed = require('./seed');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PGDATABASE}`
};

const pool = new Pool(config);

seed(pool)
  .then(() => {
    console.log('Seeding successful');
    pool.end();
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    pool.end();
  });
