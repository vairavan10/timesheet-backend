const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      // enum: ['Developer', 'Animation', 'Testing', 'Intern'],
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    skills: {
      type: [String], // Array of skill names
      default: [],
    },
    certification: {
      type: String, // Store file path or URL
      default: null,
    },
    password: {
      type: String,
      default: '123456', // Default password value
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
