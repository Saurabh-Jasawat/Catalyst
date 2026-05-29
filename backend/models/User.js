const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatarType: {
    type: String,
    default: 'emoji'
  },
  emoji: {
    type: String,
    default: '👨‍🎓'
  },
  picture: {
    type: String,
    default: ''
  },
  enrolledExams: {
    type: [String],
    default: []
  },
  selectedExam: {
    type: String,
    default: null
  },
  customExams: {
    type: Array,
    default: []
  },
  resetCode: {
    type: String,
    default: null
  },
  resetCodeExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
