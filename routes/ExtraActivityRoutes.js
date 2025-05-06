const express = require('express');
const router = express.Router();
const ExtraActivity = require('../controller/ExtraActivityController');

// ===================== EXTRA ACTIVITIES ROUTES =====================

// ➕ Add new extra activity ➡️ POST /api/extra-activities
router.post('/', ExtraActivity.addExtraActivity);

// 📄 Get all extra activities ➡️ GET /api/extra-activities
router.get('/', ExtraActivity.getExtraActivities);


// PUT /api/extra-activities/:id
router.put('/:id',ExtraActivity .updateActivity);
router.delete('/:id', ExtraActivity.deleteActivity);



module.exports = router;
