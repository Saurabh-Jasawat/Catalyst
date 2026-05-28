const express = require('express');
const router = express.Router();
const ExamData = require('../models/ExamData');
const auth = require('../middleware/auth');

// GET /api/exam - Retrieve progress data for all exams of the active user
router.get('/', auth, async (req, res) => {
  try {
    const allExamData = await ExamData.find({ userId: req.user.id });
    res.json(allExamData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/exam/:examName - Retrieve active exam workspace progress
router.get('/:examName', auth, async (req, res) => {
  try {
    const examData = await ExamData.findOne({
      userId: req.user.id,
      examName: req.params.examName
    });

    if (!examData) {
      return res.json({ notFound: true });
    }

    res.json(examData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/exam/:examName - Save or update active exam progress (autosave compatible)
router.put('/:examName', auth, async (req, res) => {
  try {
    const {
      streak,
      points,
      lastLoginDate,
      dDay,
      dDayPhases,
      targetScore,
      syllabusData,
      notes,
      shortNotes,
      mistakes,
      revisions,
      mockTests,
      dailyStudy,
      todos,
      pyqPapers,
      pyqProgress,
      pyqCovered
    } = req.body;

    const updateFields = {
      streak,
      points,
      lastLoginDate,
      dDay,
      dDayPhases,
      targetScore,
      syllabusData,
      notes,
      shortNotes,
      mistakes,
      revisions,
      mockTests,
      dailyStudy,
      todos,
      pyqPapers,
      pyqProgress,
      pyqCovered,
      updatedAt: Date.now()
    };

    // Remove any undefined properties to prevent overwriting existing valid properties with nulls
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const examData = await ExamData.findOneAndUpdate(
      { userId: req.user.id, examName: req.params.examName },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    res.json(examData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
