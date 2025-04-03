const mongoose = require('mongoose');

const timeSheetSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // ⬅️ Use ObjectId
  hours: {
    type: Number,
    required: true
  },
  workDone: {
    type: String,
    required: true
  },
  email: {  // ✅ Added email field
    type: String,
    
  }
});

module.exports = mongoose.model('TimeSheet', timeSheetSchema);
