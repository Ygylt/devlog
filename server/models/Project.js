const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  githubRepo: { type: String },
  color: { type: String, default: '#6366f1' },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);