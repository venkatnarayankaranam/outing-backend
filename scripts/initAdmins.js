const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const adminUsers = [
  {
    email: "floorincharge@kietgroup.com",
    password: "FloorIncharge@2026",
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
    assignedFloor: []
  },
  {
    email: "hostelincharge@kietgroup.com",
    password: "HostelIncharge@2026",
    role: "hostel-incharge",
    name: "Hostel Incharge",
    rollNumber: "HOSTELINCHARGE",
    phoneNumber: "7498873464",
    parentPhoneNumber: "7498873464",
    hostelBlock: "D-Block",
    roomNumber: "101",
    branch: "N/A",
    semester: "N/A",
    assignedBlock: "D-Block"
  },
  {
    email: "maingate@kietgroup.com",
    password: "MainGate@2026",
    role: "gate",
    name: "Main Gate Security",
    rollNumber: "MAINGATE",
    phoneNumber: "7498873464",
    parentPhoneNumber: "7498873464",
    hostelBlock: "N/A",
    roomNumber: "N/A",
    branch: "N/A",
    semester: "N/A"
  },
  {
    email: "warden@kietgroup.com",
    password: "Warden@2026",
    role: "warden",
    name: "Hostel Warden",
    rollNumber: "WARDEN",
    phoneNumber: "7498873464",
    parentPhoneNumber: "7498873464",
    hostelBlock: "D-Block",
    roomNumber: "001",
    branch: "N/A",
    semester: "N/A",
    assignedBlock: "D-Block"
  }
];

async function initializeAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create users collection if it doesn't exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.find(c => c.name === 'users')) {
      await mongoose.connection.db.createCollection('users');
    }

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    for (const admin of adminUsers) {
      const existingUser = await User.findOne({ email: admin.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await User.create({
          ...admin,
          password: hashedPassword,
          createdAt: new Date()
        });
        console.log(`Created admin user: ${admin.email}`);
      } else {
        console.log(`Admin user already exists: ${admin.email}`);
      }
    }

    console.log('Admin initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initializeAdmins();
