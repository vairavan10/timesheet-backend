const Employee = require('../models/employees');

// Add a new employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, designation, joiningDate, experience, skills, certification,password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !role || !designation || !joiningDate || experience === undefined||password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new employee record
    const newEmployee = await Employee.create({
      name,
      email,
      phone,
      role,
      designation,
      joiningDate,
      experience,
      skills,
      certification,
      password,
    });

    res.status(201).json({
      message: 'Employee added successfully',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error });
  }
};
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employee data", details: error.message });
  }
};
// Fetch all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).json({
      message: 'Employees fetched successfully',
      data: employees
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// Fetch total employee count
const getEmployeeCount = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.status(200).json({
      message: 'Employee count fetched successfully',
      count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee count', error });
  }
};

module.exports = { addEmployee, getEmployees, getEmployeeCount,getEmployeeById };
