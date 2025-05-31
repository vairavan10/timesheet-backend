const mongoose = require('mongoose');

const ProjectDetailsSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  }, 

  fromDate: { type: Date, required: true }, 
  toDate: { type: Date, required: true },    

  dependencies: { type: String, required: true }, 
  hoursSpent: { type: Number, required: true },
  utilization: { type: String, required: true },
  status: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

const ProjectDetails = mongoose.model('ProjectDetails', ProjectDetailsSchema);
module.exports = ProjectDetails;
