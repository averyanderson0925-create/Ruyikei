const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, {
      expiresIn: '8h',
    });

    res.json({ token, email: admin.email });
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 12);
    await Admin.create({ email: email.toLowerCase(), password: hashed });
    res.status(201).json({ message: 'Admin created' });
  } catch (error) {
    console.error('Auth register error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
