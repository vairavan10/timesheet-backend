const express = require('express');
const router = express.Router();
const { getEmployeeLogs } = require('../controller/employeeSummaryController');

router.get('/', getEmployeeLogs);

module.exports = router;
