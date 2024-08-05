const fs = require('fs');
const path = require('path');

const seed = async (pool) => {
  const sqlFilePath = path.join(__dirname, '../../init_db.sql');
  const sql = fs.readFileSync(sqlFilePath).toString();

  try {
    await pool.query(sql);
  } catch (err) {
    throw new Error('Error executing query: ' + err.stack);
  }
};

module.exports = seed;
