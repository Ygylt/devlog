const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  tags: [{ type: String }],
  mood: { type: String, enum: ['great', 'good', 'okay', 'frustrated', 'stuck'] },
  blockers: [{ type: String }],
  wins: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);