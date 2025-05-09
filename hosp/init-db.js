/**
 * @typedef {Object} Doctor
 * @property {string} name
 * @property {string} specialty 
 * @property {string[]} availability
 */

/**
 * @typedef {Object} Hospital
 * @property {string} name
 * @property {Object} location
 * @property {string} location.type
 * @property {number[]} location.coordinates
 * @property {string[]} departments
 * @property {Doctor[]} doctors
 * @property {string[]} emergencyContacts
 * @property {Object} waitTimes
 * @property {number} waitTimes.emergency
 * @property {number} waitTimes.general
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection (replace with your actual credentials)
const atlasUri = 'mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/hospitalnav?retryWrites=true&w=majority';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || atlasUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    console.log('Connected to MongoDB Atlas');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
}

// Define Hospital Schema
const hospitalSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  departments: [String],
  doctors: [{
    name: String,
    specialty: String, 
    availability: [String]
  }],
  emergencyContacts: [String],
  waitTimes: {
    emergency: Number,
    general: Number
  }
});

// Create Hospital model
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Sample data for Ahmedabad, India
const sampleHospitals = [
  {
    name: "Civil Hospital",
    location: {
      coordinates: [72.5811, 23.0225]
    },
    departments: ["Emergency", "Cardiology", "General Medicine"],
    doctors: [
      { name: "Dr. Patel", specialty: "Cardiology", availability: ["Mon", "Wed", "Fri"] },
      { name: "Dr. Sharma", specialty: "Emergency", availability: ["Tue", "Thu", "Sat"] }
    ],
    emergencyContacts: ["108", "102"],
    waitTimes: {
      emergency: 20,
      general: 45
    }
  },
  {
    name: "Apollo Hospitals",
    location: {
      coordinates: [72.5522, 23.0330]
    },
    departments: ["Pediatrics", "Neurology", "Orthopedics"],
    doctors: [
      { name: "Dr. Gupta", specialty: "Pediatrics", availability: ["Mon", "Tue", "Thu"] },
      { name: "Dr. Joshi", specialty: "Neurology", availability: ["Wed", "Fri"] }
    ],
    emergencyContacts: ["108", "102"],
    waitTimes: {
      emergency: 15,
      general: 30
    }
  }
];

// Initialize database
async function initDB() {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('Using in-memory data instead of database');
    return sampleHospitals;
  }

  try {
    await Hospital.deleteMany({});
    await Hospital.insertMany(sampleHospitals);
    console.log('Database initialized with sample data');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return sampleHospitals;
  } finally {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
    }
  }
}

// Export initialization function and sample data
module.exports = {
  Hospital,
  initDB,
  sampleHospitals
};
