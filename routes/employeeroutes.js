const express = require('express');
const router = express.Router();

const {
  addEmployee,getEmployees,
  getEmployeeCount,
  getEmployeeById,
} = require('../controller/employeecontroller');

router.post('/addemployee', addEmployee);
router.get('/list', getEmployees);
router.get('/employee-count',getEmployeeCount);
router.get("/:id", getEmployeeById);

module.exports = router;
