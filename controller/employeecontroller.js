const Employee = require('../models/employees');

// Add a new employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, designation, joiningDate, experience, skills, certification,password ,managerId} = req.body;

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
      managerId,
    });

    res.status(201).json({
      message: 'Employee added successfully',
      data: newEmployee
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error: error.message || error });
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
const getFullEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('managerId', 'name email'); 

    res.status(200).json({
      message: 'Employees fetched successfully',
      data: employees
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};
const getEmployees = async (req, res) => {
  try {
    const managerId = req.query.managerId; // Get managerId from query param

    if (!managerId) {
      return res.status(400).json({ message: 'Manager ID is required' });
    }

    const employees = await Employee.find({ managerId })
      .populate('managerId', 'name email');

    res.status(200).json({
      message: 'Employees fetched successfully',
      data: employees
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};
// const getFullEmployees = async (req, res) => {
//   try {
//     // Fetch all employees and populate the managerId field with name and email
//     const employees = await Employee.find().populate('managerId', 'name email');

//     res.status(200).json({
//       message: 'Employees fetched successfully',
//       data: employees  // Returning employee data inside the 'data' field
//     });
//   } catch (error) {
//     console.error('Error fetching employees:', error);

//     res.status(500).json({
//       message: 'Error fetching employee data',
//       details: error.message || error
//     });
//   }
// };



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
// Change employee password
const changeEmployeePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const employeeId = req.params.id;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check current password
    if (employee.password !== currentPassword) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Prevent using the same password again
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from the current password' });
    }

    // Update password
    employee.password = newPassword;
    await employee.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
};



module.exports = { addEmployee, getEmployees, getEmployeeCount,getEmployeeById,changeEmployeePassword,getFullEmployees };
