const express = require("express");
const {
  createTimeSheet,
  getAllTimeSheets,
  getUserTimeSheets,
  getUserTotalHours,
  getProjectTotalHours,
} = require("../controller/timesheetcontroller");

const router = express.Router();

// ✅ Create a new timesheet
router.post("/addtimesheet", createTimeSheet);

// ✅ Fetch all timesheets (Admin only)
router.get("/getalltimesheets", getAllTimeSheets);

// ✅ Fetch user-specific timesheets (Based on email)
router.get("/getusertimesheets", getUserTimeSheets);

router.get("/getusertotalhours",getUserTotalHours);
router.get('/total-hours/:projectId', getProjectTotalHours);

module.exports = router;
