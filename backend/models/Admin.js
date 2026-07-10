const { randomUUID } = require('crypto');
const { getPool } = require('../config/db');

const Admin = {
  async findOne(query = {}) {
    const email = query.email;
    if (!email) return null;

    const result = await getPool().query('SELECT * FROM admins WHERE LOWER(email) = LOWER($1)', [email]);
    return result.rows[0] || null;
  },

  async countDocuments() {
    const result = await getPool().query('SELECT COUNT(*)::int AS count FROM admins');
    return result.rows[0].count;
  },

  async create(data) {
    const id = randomUUID();
    const email = data.email.toLowerCase();
    const password = data.password;

    await getPool().query('INSERT INTO admins (id, email, password) VALUES ($1, $2, $3)', [id, email, password]);
    return { id, email, password };
  },
};

module.exports = Admin;
