const mongoose = require('mongoose');

const extraActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
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


module.exports = mongoose.models.ExtraActivity || mongoose.model('ExtraActivity', extraActivitySchema);

