const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  details: { type: Object },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', auditSchema);