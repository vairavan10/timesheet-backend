const mongoose = require('mongoose');

const timeSheetSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: function () {
      return this.typeOfWork === 'Regular Work' && !this.extraActivity;
    },
  },
  hours: {
    type: Number,
    required: true,
  },
  workDone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  extraActivity: {
    type: String,
    required: function () {
      return this.typeOfWork === 'Regular Work' && !this.project;
    },
  },
  typeOfWork: { 
    type: String, 
    enum: ['Regular Work', 'Leave' ,'Extra Activity'], 
    default: 'Regular Work' 
  },
  leaveType: { 
    type: String, 
    enum: ['Half Day', 'Full Day'], 
    default: null 
  }
});

module.exports = mongoose.model('TimeSheet', timeSheetSchema);
