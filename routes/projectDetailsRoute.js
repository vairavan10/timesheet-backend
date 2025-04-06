const express = require('express');
const router = express.Router();
const { addProjectDetails,getProjectReport,getAvailableDateRanges,getLatestProjectReport,getAllProjectDetailsWithWeeks,
    generateWeekOptions,getAllAvailableDateRanges,getReportByDate } = require('../controller/projectDetailsController');

router.post('/:projectId/details', addProjectDetails);
router.get("/:projectId/available-dates",getAvailableDateRanges);
router.get("/:projectId/details",getProjectReport);
router.get('/:projectId/latest-report',getLatestProjectReport);
router.get('/:projectId/detailsbyweek', getAllProjectDetailsWithWeeks);
router.post('/week-options',generateWeekOptions);
router.get('/available-dates', getAllAvailableDateRanges);
router.get('/:id/report-by-date',getReportByDate);



module.exports = router;
