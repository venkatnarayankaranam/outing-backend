const User = require('../models/User');

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ name: 1 });
    return res.json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .select('-password')
      .lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};
