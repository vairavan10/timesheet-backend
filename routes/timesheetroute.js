const express = require("express");
const {
  createTimeSheet,
  getAllTimeSheets,
  getUserTimeSheets,
  getUserTotalHours,
  getProjectTotalHours,
  getProjectUtilization,
  getUserProjectHours,
  uploadTimesheet,
} = require("../controller/timesheetcontroller");

const router = express.Router();


router.post("/addtimesheet", createTimeSheet);
router.post("/upload-timesheet", uploadTimesheet);


router.get("/getalltimesheets", getAllTimeSheets);


router.get("/getusertimesheets", getUserTimeSheets);

router.get("/getusertotalhours",getUserTotalHours);
router.get("/getuserprojecthours",getUserProjectHours)
router.get('/total-hours/:projectId', getProjectTotalHours);
router.get('/utilization-project/:projectId', getProjectUtilization);


module.exports = router;
