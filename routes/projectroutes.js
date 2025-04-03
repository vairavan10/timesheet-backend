const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectcontroller');

router.get('/', projectController.getProject);

router.post('/', projectController.createProject);

router.get('/:projectId', projectController.getProjectById);

// You can add these later if needed
// router.put('/:id', teamController.updateTeam);
// router.delete('/:id', teamController.deleteTeam);

module.exports = router;
