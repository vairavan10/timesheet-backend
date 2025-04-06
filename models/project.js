const mongoose = require('mongoose');

const extraActivitySchema = new mongoose.Schema({
  activityName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityName', // Reference to future model
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExtraActivity', extraActivitySchema);
