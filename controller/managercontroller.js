const mongoose = require('mongoose');
const Manager = require('../models/manager');
const Team = require('../models/teams');

// ✅ Create Manager
exports.createManager = async (req, res) => {
    try {
        const { name, email, password, team } = req.body;

        // 🔎 Basic field validation
        if (!name || !email || !password || !team) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // ✅ Validate team is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(team)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID format',
            });
        }

        // ✅ Check if team exists
        const teamExists = await Team.findById(team);
        if (!teamExists) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        // ✅ Check if email already exists
        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(400).json({
                success: false,
                message: 'Manager with this email already exists',
            });
        }

        // ✅ Check if team already has a manager assigned
        const teamHasManager = await Manager.findOne({ team });
        if (teamHasManager) {
            return res.status(400).json({
                success: false,
                message: 'This team already has a manager assigned',
            });
        }

        // 📝 Create a new manager
        const manager = new Manager({
            name,
            email,
            password, // 🔐 Hash the password in production!
            team,
            role: 'manager',
        });

        await manager.save();

        res.status(201).json({
            success: true,
            message: 'Manager created successfully',
            manager,
        });
    } catch (error) {
        console.error('Error creating manager:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// ✅ Get all managers
exports.getAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find().populate('team'); // Populating team if you have team reference
        res.status(200).json({ success: true, managers });
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ✅ Get Teams
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find({});
        res.status(200).json({ success: true, teams });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ✅ Create Team
exports.createTeam = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    try {
        const newTeam = new Team({ name });
        await newTeam.save();

        res.status(201).json({ success: true, message: 'Team created successfully!' });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ✅ Get Team by Manager




exports.getTeamByManager = async (req, res) => {
  try {
      const { managerId } = req.params;

      // ✅ Validate managerId format
      if (!mongoose.Types.ObjectId.isValid(managerId)) {
          return res.status(400).json({ error: "Invalid manager ID format" });
      }

      // ✅ Find the manager and populate the `team` field
      const manager = await Manager.findById(managerId).populate('team');

      if (!manager || !manager.team) {
          return res.status(404).json({ error: "Manager or team not found" });
      }

      res.status(200).json({ teamName: manager.team.name });
  } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ error: "Server error" });
  }
};
