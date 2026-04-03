const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user._id })
      .populate('project', 'name color')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, user: req.user._id })
      .populate('project', 'name color');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const entry = await Entry.create({ ...req.body, user: req.user._id });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;