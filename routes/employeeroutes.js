const express = require('express');
const upload = require('../helper/multer'); 
const router = express.Router();

const {
  addEmployee,getEmployees,
  getEmployeeCount,
  getEmployeeById,
  changeEmployeePassword,
  getFullEmployees,
} = require('../controller/employeecontroller');

router.post('/addemployee',upload.single('image'), addEmployee);
router.get('/list', getEmployees);
router.get('/fulllist', getFullEmployees);

router.get('/employee-count',getEmployeeCount);
router.get("/:id", getEmployeeById);
router.put('/:id/change-password', changeEmployeePassword);

module.exports = router;
