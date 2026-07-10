const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  nationality: { type: String, default: '' },
  urls: { type: [String], default: [] },
  backupCode: { type: String, default: '' },
  remarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entry', entrySchema);
