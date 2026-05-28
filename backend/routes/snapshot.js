const express = require('express');
const router = express.Router();
const Snapshot = require('../models/Snapshot');
const auth = require('../middleware/auth');

// GET /api/snapshots - Get all snapshots for the active user
router.get('/', auth, async (req, res) => {
  try {
    const snaps = await Snapshot.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(snaps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/snapshots - Capture a new snapshot (auto-prunes list to maximum 5)
router.post('/', auth, async (req, res) => {
  try {
    const { id, date, exam, completion, data } = req.body;
    if (!id || !date || !exam || !data) {
      return res.status(400).json({ msg: 'Missing required snapshot parameters' });
    }

    const newSnap = new Snapshot({
      userId: req.user.id,
      id,
      date,
      exam,
      completion: completion || 0,
      data
    });

    await newSnap.save();

    // Check count and prune older snapshots beyond the latest 5
    const snaps = await Snapshot.find({ userId: req.user.id }).sort({ createdAt: -1 });
    if (snaps.length > 5) {
      const olderSnaps = snaps.slice(5);
      for (const old of olderSnaps) {
        await Snapshot.findByIdAndDelete(old._id);
      }
    }

    // Return the fresh list of remaining snapshots
    const updatedSnaps = await Snapshot.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(updatedSnaps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/snapshots/:id - Delete a specific snapshot by its unique text ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const snap = await Snapshot.findOne({ userId: req.user.id, id: req.params.id });
    if (!snap) {
      return res.status(404).json({ msg: 'Snapshot not found' });
    }

    await Snapshot.findByIdAndDelete(snap._id);
    
    const updatedSnaps = await Snapshot.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(updatedSnaps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
