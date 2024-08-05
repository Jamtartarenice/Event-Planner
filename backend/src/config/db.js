const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

require('dotenv').config({
  path: `${__dirname}/../../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = {
    rejectUnauthorized: false,
  };
} else {
  config.user = process.env.PG_USER;
  config.host = process.env.PG_HOST;
  config.database = process.env.PG_DATABASE;
  config.password = process.env.PG_PASSWORD;
  config.port = process.env.PG_PORT;
}

const pool = new Pool(config);

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the PostgreSQL database', err);
  } else {
    console.log('Connected to the PostgreSQL database');
  }
});

module.exports = pool;
