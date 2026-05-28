const mongoose = require('mongoose');

const ExamDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  streak: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 250
  },
  lastLoginDate: {
    type: String,
    default: ''
  },
  dDay: {
    type: String,
    default: ''
  },
  dDayPhases: {
    type: Array,
    default: []
  },
  targetScore: {
    type: Number,
    default: 0
  },
  syllabusData: {
    type: Array,
    default: []
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  shortNotes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  mistakes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  revisions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  mockTests: {
    type: Array,
    default: []
  },
  dailyStudy: {
    type: Array,
    default: []
  },
  todos: {
    type: Array,
    default: []
  },
  pyqPapers: {
    type: Array,
    default: []
  },
  pyqProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pyqCovered: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure uniqueness per user and exam workspace
ExamDataSchema.index({ userId: 1, examName: 1 }, { unique: true });

module.exports = mongoose.model('ExamData', ExamDataSchema);
