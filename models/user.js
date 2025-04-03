const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['ceo', 'manager', 'hr', 'employee'],  
    required: true,
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
