const express = require('express');
const router = express.Router();
const { addProjectDetails,getProjectReport,getAvailableDateRanges } = require('../controller/projectDetailsController');

router.post('/:projectId/details', addProjectDetails);
router.get("/:projectId/available-dates",getAvailableDateRanges);
router.get("/:projectId/details",getProjectReport);


module.exports = router;
