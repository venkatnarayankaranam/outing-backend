const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.get('/students', authenticate, async (req, res) => {
  console.log("hello")
  try {
    const students = await User.find({ role: 'student' })
    console.log(students)
      .select('-password')
      .sort({ name: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;