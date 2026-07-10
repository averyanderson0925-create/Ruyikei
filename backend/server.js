const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3000'] : true,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Secure Data Vault API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, dbState: 'connected' });
});

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.create({ email: process.env.ADMIN_EMAIL.toLowerCase(), password: hashedPassword });
      console.log('Admin user seeded:', process.env.ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('Unable to seed admin user:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!process.env.JWT_SECRET) {
        console.warn('Warning: JWT_SECRET is not set. Authentication may fail or produce invalid tokens. Set JWT_SECRET in Railway variables.');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
