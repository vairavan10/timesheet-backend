const express = require('express');
const router = express.Router();
const managerController = require('../controller/managercontroller');

// ===================== MANAGER ROUTES =====================

// ➕ Create a manager ➡️ POST /api/managers
router.post('/', managerController.createManager);

// 📄 Get all managers ➡️ GET /api/managers
router.get('/', managerController.getAllManagers);

// (Optional) ➡️ GET /api/managers/getmanager (if you really need it)
router.get('/', managerController.getAllManagers);
router.put('/:id/change-password', managerController.changeManagerPassword);
router.get("/:id",managerController.getManagerById);


router.patch("/:id", managerController.updateManager);

router.delete("/:id", managerController.deleteManager);


// ===================== TEAM ROUTES =====================

// 📄 Get all teams ➡️ GET /api/managers/teams
router.get('/teams', managerController.getTeams);

// ➕ Create a new team ➡️ POST /api/managers/teams
router.post('/teams', managerController.createTeam);

// 📄 Get team name of a manager ➡️ GET /api/managers/:managerId/team
router.get('/:managerId/team', managerController.getTeamByManager);


module.exports = router;
