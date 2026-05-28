const mongoose = require('mongoose');

const SnapshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  completion: {
    type: Number,
    default: 0
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Snapshot', SnapshotSchema);
