const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ExamData = require('../models/ExamData');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Nodemailer transport setup for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper function to send email with simulated fallback
const sendMail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`===================================================`);
    console.log(`[MAIL SIMULATOR] To: ${to}`);
    console.log(`[MAIL SIMULATOR] Subject: ${subject}`);
    console.log(`[MAIL SIMULATOR] Content (HTML):`);
    console.log(html);
    console.log(`===================================================`);
    return { simulated: true, html };
  }

  const mailOptions = {
    from: `"Catalyst Suite" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};

// POST /api/auth/signup - Signup new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    // Create JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'catalyst_super_secret_jwt_key_123456', { expiresIn: '7d' });

    // Send Welcome Email (asynchronously, non-blocking)
    const welcomeHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e1b4b;">
        <h2 style="color: #4f46e5; text-align: center; font-weight: 900; margin-bottom: 20px;">Welcome to Catalyst! 🚀</h2>
        <p>Dear ${name},</p>
        <p>Thank you for creating an account with Catalyst. Your journey to master and conquer your exam syllabus has officially begun!</p>
        <p>Use your syllabus tracker, mock analytics, and revision schedules daily to build learning consistency.</p>
        <p style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
          <a href="http://localhost:5174" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Go to Dashboard</a>
        </p>
        <p>Best regards,<br><strong>The Catalyst Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        <p style="font-size: 11px; color: #64748b; text-align: center;">This is an automated email from your Catalyst study tracker suite.</p>
      </div>
    `;
    sendMail(email, 'Welcome to Catalyst Study Suite! 🚀', welcomeHtml).catch(err => {
      console.error("Welcome email failed to send:", err);
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarType: user.avatarType,
        emoji: user.emoji,
        picture: user.picture,
        enrolledExams: user.enrolledExams,
        selectedExam: user.selectedExam,
        customExams: user.customExams
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/login - Authenticate credentials and login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'catalyst_super_secret_jwt_key_123456', { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarType: user.avatarType,
        emoji: user.emoji,
        picture: user.picture,
        enrolledExams: user.enrolledExams,
        selectedExam: user.selectedExam,
        customExams: user.customExams
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/auth/me - Retrieve logged in user's profile details & exam summaries
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const examDataList = await ExamData.find({ userId: req.user.id }).select('examName dDay targetScore');
    const examStats = {};
    examDataList.forEach(item => {
      examStats[item.examName] = {
        dDay: item.dDay,
        targetScore: item.targetScore
      };
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarType: user.avatarType,
      emoji: user.emoji,
      picture: user.picture,
      enrolledExams: user.enrolledExams,
      selectedExam: user.selectedExam,
      customExams: user.customExams,
      createdAt: user.createdAt,
      examStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/profile - Update full profile info
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatarType, emoji, picture } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (avatarType) user.avatarType = avatarType;
    if (emoji) user.emoji = emoji;
    if (picture !== undefined) user.picture = picture;

    await user.save();
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarType: user.avatarType,
      emoji: user.emoji,
      picture: user.picture,
      enrolledExams: user.enrolledExams,
      selectedExam: user.selectedExam,
      customExams: user.customExams
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/enrolled - Update enrolled exams list
router.put('/enrolled', auth, async (req, res) => {
  try {
    const { enrolledExams } = req.body;
    if (!enrolledExams || !Array.isArray(enrolledExams)) {
      return res.status(400).json({ msg: 'Invalid enrolledExams array' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.enrolledExams = enrolledExams;
    await user.save();
    res.json({ enrolledExams: user.enrolledExams });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/selected - Update selected active exam
router.put('/selected', auth, async (req, res) => {
  try {
    const { selectedExam } = req.body;
    if (!selectedExam) {
      return res.status(400).json({ msg: 'Selected exam is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.selectedExam = selectedExam;
    await user.save();
    res.json({ selectedExam: user.selectedExam });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/custom-exams - Register a new custom exam template schema
router.post('/custom-exams', auth, async (req, res) => {
  try {
    const { title, desc, icon, color, syllabus } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Custom exam title is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const customExam = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      desc: desc ? desc.trim() : 'Custom Study Plan',
      icon: icon || 'BookOpen',
      color: color || 'bg-gray-50 border-gray-200 hover:border-gray-500',
      syllabus: syllabus || []
    };

    user.customExams.push(customExam);
    await user.save();
    res.json({ customExams: user.customExams });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/forgot-password - Generate and send OTP reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User with this email does not exist' });
    }

    // Generate 6-digit random code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    // Send reset code email
    const resetHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e1b4b;">
        <h2 style="color: #4f46e5; text-align: center; font-weight: 900; margin-bottom: 20px;">Reset Your Catalyst Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Catalyst account.</p>
        <p>Your 6-digit OTP verification code is:</p>
        <div style="background-color: #f8fafc; border: 2px dashed #4f46e5; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 6px; padding: 18px; margin: 25px 0; color: #4f46e5; border-radius: 12px;">
          ${resetCode}
        </div>
        <p style="color: #ef4444; font-weight: bold; text-align: center;">This code will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email; your account credentials will remain safe.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        <p style="font-size: 11px; color: #64748b; text-align: center;">This is an automated security email from your Catalyst study tracker suite.</p>
      </div>
    `;

    const mailStatus = await sendMail(email, 'Your Catalyst Password Reset OTP Code 🔑', resetHtml);
    
    if (mailStatus && mailStatus.simulated) {
      return res.json({ 
        msg: 'OTP generated (SIMULATION)', 
        simulated: true, 
        code: resetCode, 
        info: 'SMTP credentials not configured in backend/.env. Use this simulated code to reset.' 
      });
    }

    res.json({ msg: 'Verification OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/auth/verify-otp - Verify reset code and update password
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User with this email does not exist' });
    }

    if (!user.resetCode || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired verification code' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset code fields
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
