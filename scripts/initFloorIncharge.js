const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function initFloorIncharge() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create users collection if it doesn't exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.find(c => c.name === 'users')) {
      await mongoose.connection.db.createCollection('users');
    }

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const floorInchargeData = {
      email: "floorincharge@kietgroup.com",
      password: await bcrypt.hash("FloorIncharge@2026", 10),
      role: "floor-incharge",
      name: "Floor Incharge",
      rollNumber: "FLOORINCHARGE",
      phoneNumber: "7498873464",
      parentPhoneNumber: "7498873464",
      hostelBlock: "D-Block",
      floor: [],
      roomNumber: "212",
      branch: "N/A",
      semester: "N/A",
      assignedBlock: "D-Block",
      assignedFloor: ["1", "2", "3", "4"],
      createdAt: new Date()
    };

    const existingUser = await User.findOne({ email: floorInchargeData.email });
    
    if (!existingUser) {
      await User.create(floorInchargeData);
      console.log('Floor Incharge admin created successfully');
    } else {
      console.log('Floor Incharge admin already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initFloorIncharge();
