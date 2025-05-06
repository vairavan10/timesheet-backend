const express = require('express');
const router = express.Router();
const teamController = require('../controller/managercontroller');

// GET all teams ➡️ GET /api/teams
router.get('/', teamController.getTeams);

// POST new team ➡️ POST /api/teams
router.post('/', teamController.createTeam);
router.delete('/:id', teamController.deleteTeam);
router.patch('/:id', teamController.updateTeam);

// You can add these later if needed
// router.put('/:id', teamController.updateTeam);
// router.delete('/:id', teamController.deleteTeam);

module.exports = router;
