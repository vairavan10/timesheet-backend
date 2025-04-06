const express = require("express");
const {
  createTimeSheet,
  getAllTimeSheets,
  getUserTimeSheets,
  getUserTotalHours,
  getProjectTotalHours,
  getProjectUtilization,
  getUserProjectHours,
} = require("../controller/timesheetcontroller");

const router = express.Router();

// ✅ Create a new timesheet
router.post("/addtimesheet", createTimeSheet);

// ✅ Fetch all timesheets (Admin only)
router.get("/getalltimesheets", getAllTimeSheets);

// ✅ Fetch user-specific timesheets (Based on email)
router.get("/getusertimesheets", getUserTimeSheets);

router.get("/getusertotalhours",getUserTotalHours);
router.get("/getuserprojecthours",getUserProjectHours)
router.get('/total-hours/:projectId', getProjectTotalHours);
router.get('/utilization-project/:projectId', getProjectUtilization);


module.exports = router;
