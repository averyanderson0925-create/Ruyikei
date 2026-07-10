const { Pool } = require('pg');

let pool;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/secure_data_vault',
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
};

const initializeDatabase = async () => {
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id VARCHAR(36) PRIMARY KEY,
        phone_number VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        nationality VARCHAR(255) DEFAULT '',
        urls TEXT[] DEFAULT '{}',
        backup_code VARCHAR(255) DEFAULT '',
        remarks TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
};

const connectDB = async () => {
  try {
    const client = await getPool().connect();
    await client.query('SELECT NOW()');
    client.release();
    await initializeDatabase();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.getPool = getPool;
