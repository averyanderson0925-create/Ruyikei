const { randomUUID } = require('crypto');
const { getPool } = require('../config/db');

const toDbRow = (data) => ({
  phone_number: data.phoneNumber,
  name: data.name,
  email: data.email?.toLowerCase(),
  password: data.password,
  nationality: data.nationality || '',
  urls: data.urls || [],
  backup_code: data.backupCode || '',
  remarks: data.remarks || '',
});

const toResponseRow = (row) => ({
  id: row.id,
  phoneNumber: row.phone_number,
  name: row.name,
  email: row.email,
  password: row.password,
  nationality: row.nationality || '',
  urls: row.urls || [],
  backupCode: row.backup_code || '',
  remarks: row.remarks || '',
  createdAt: row.created_at,
});

const Entry = {
  async find({ search, nationality, page = 1, limit = 10 } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    let query = 'SELECT * FROM entries';
    const values = [];
    const conditions = [];

    if (search) {
      conditions.push('(LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($2) OR LOWER(phone_number) LIKE LOWER($3))');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (nationality) {
      conditions.push('nationality = $' + (values.length + 1));
      values.push(nationality);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(Number(limit), offset);

    const result = await getPool().query(query, values);
    const entries = result.rows.map(toResponseRow);

    const countResult = await getPool().query(
      `SELECT COUNT(*)::int AS count FROM entries${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`,
      values.slice(0, values.length - 2)
    );

    const countriesResult = await getPool().query("SELECT DISTINCT nationality FROM entries WHERE nationality IS NOT NULL AND nationality <> ''");

    return {
      entries,
      count: countResult.rows[0].count,
      countries: countriesResult.rows.map((row) => row.nationality),
    };
  },

  async findById(id) {
    const result = await getPool().query('SELECT * FROM entries WHERE id = $1', [id]);
    return result.rows[0] ? toResponseRow(result.rows[0]) : null;
  },

  async create(data) {
    const id = randomUUID();
    const row = toDbRow(data);
    await getPool().query(
      `INSERT INTO entries (id, phone_number, name, email, password, nationality, urls, backup_code, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, row.phone_number, row.name, row.email, row.password, row.nationality, row.urls, row.backup_code, row.remarks]
    );
    return { ...toResponseRow({ id, ...row, created_at: new Date() }) };
  },

  async findByIdAndUpdate(id, data) {
    const row = toDbRow(data);
    const fields = [];
    const values = [id];

    if (row.phone_number !== undefined) { fields.push(`phone_number = $${values.length + 1}`); values.push(row.phone_number); }
    if (row.name !== undefined) { fields.push(`name = $${values.length + 1}`); values.push(row.name); }
    if (row.email !== undefined) { fields.push(`email = $${values.length + 1}`); values.push(row.email); }
    if (row.password !== undefined) { fields.push(`password = $${values.length + 1}`); values.push(row.password); }
    if (row.nationality !== undefined) { fields.push(`nationality = $${values.length + 1}`); values.push(row.nationality); }
    if (row.urls !== undefined) { fields.push(`urls = $${values.length + 1}`); values.push(row.urls); }
    if (row.backup_code !== undefined) { fields.push(`backup_code = $${values.length + 1}`); values.push(row.backup_code); }
    if (row.remarks !== undefined) { fields.push(`remarks = $${values.length + 1}`); values.push(row.remarks); }

    if (!fields.length) return null;

    const result = await getPool().query(`UPDATE entries SET ${fields.join(', ')} WHERE id = $1 RETURNING *`, values);
    return result.rows[0] ? toResponseRow(result.rows[0]) : null;
  },

  async findByIdAndDelete(id) {
    const result = await getPool().query('DELETE FROM entries WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ? toResponseRow(result.rows[0]) : null;
  },
};

module.exports = Entry;
