module.exports = [
    {
      name: "Civil Hospital (Mock)",
      location: {
        type: "Point",
        coordinates: [72.5811, 23.0225] // longitude, latitude
      },
      departments: ["Emergency", "General"],
      waitTimes: {
        emergency: 30,
        general: 60
      }
    },
    {
      name: "Apollo Hospitals (Mock)",
      location: {
        type: "Point", 
        coordinates: [72.5522, 23.0330]
      },
      departments: ["Pediatrics", "Cardiology"],
      waitTimes: {
        emergency: 20,
        general: 45
      }
    }
  ];