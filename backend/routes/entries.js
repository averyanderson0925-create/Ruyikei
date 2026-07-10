const express = require('express');
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { search, nationality, page = 1, limit = 10 } = req.query;
    const { entries, count, countries } = await Entry.find({ search, nationality, page, limit });

    const decryptedEntries = entries.map((entry) => ({
      ...entry,
      password: entry.password ? decrypt(entry.password) : '',
    }));

    const totalUrls = decryptedEntries.reduce((sum, entry) => sum + (entry.urls?.length || 0), 0);

    res.json({
      entries: decryptedEntries,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
      stats: {
        totalEntries: count,
        totalUrls,
        countries: countries.length,
        lastAdded: decryptedEntries.length ? decryptedEntries[0].createdAt : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load entries' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ ...entry, password: entry.password ? decrypt(entry.password) : '' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load entry' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password = encrypt(data.password);
    }
    const entry = await Entry.create(data);
    res.status(201).json({ ...entry, password: req.body.password || '' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create entry' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password = encrypt(data.password);
    }
    const entry = await Entry.findByIdAndUpdate(req.params.id, data);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ ...entry, password: req.body.password || decrypt(entry.password) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update entry' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete entry' });
  }
});

module.exports = router;
