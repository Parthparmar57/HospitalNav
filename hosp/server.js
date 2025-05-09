const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { initDB, sampleHospitals } = require('./init-db');

// Initialize database or use in-memory data
let hospitalsData = sampleHospitals;
initDB().then(result => {
  if (result !== true) {
    hospitalsData = result; // Use returned sample data if DB failed
  }
});

// Database connection for API
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/hospitalnav?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Hospital model from init-db
const { Hospital } = require('./init-db');

// API Endpoints
app.get('/api/hospitals/nearby', async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;
  
  const hospitals = await Hospital.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    }
  }).limit(10);

  res.json(hospitals);
});

app.post('/api/emergency', async (req, res) => {
  const { location, emergencyType } = req.body;
  // In real implementation, this would notify hospital staff
  res.json({ message: 'Emergency alert received, help is on the way' });
});

// Serve static files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));