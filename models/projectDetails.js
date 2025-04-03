const mongoose = require('mongoose');

const ProjectDetailsSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  }, // Reference to the Project

  fromDate: { type: Date, required: true },  // Add fromDate field
  toDate: { type: Date, required: true },    // Add toDate field

  dependencies: { type: String, required: true }, // Text Area Input
  hoursSpent: { type: Number, required: true },
  utilization: { type: String, required: true },
  status: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

const ProjectDetails = mongoose.model('ProjectDetails', ProjectDetailsSchema);
module.exports = ProjectDetails;
