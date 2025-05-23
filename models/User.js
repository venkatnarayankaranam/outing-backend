const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  rollNumber: String,
  phoneNumber: String,
  parentPhoneNumber: String,
  hostelBlock: String,
  floor: [String],
  roomNumber: String,
  branch: String,
  semester: String,
  assignedBlock: String,
  assignedFloor: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);