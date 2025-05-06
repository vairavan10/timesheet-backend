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
exports.getManagerById = async (req, res) => {
    try {
      const manager = await Manager.findById(req.params.id).select("name email  team role");
  
      if (!manager) {
        return res.status(404).json({ success: false, message: "Manager not found" });
      }
  
      res.status(200).json({ success: true, manager });
    } catch (error) {
      console.error("Error fetching manager by ID:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // In your managerController.js

exports.updateManager = async (req, res) => {
    try {
      const updatedManager = await Manager.findByIdAndUpdate(
        req.params.id, // Manager ID from the request params
        req.body, // The data to update (from the request body)
        { new: true } // Return updated document and validate
      );
  
      if (!updatedManager) {
        return res.status(404).json({ success: false, message: "Manager not found" });
      }
  
      res.status(200).json({ success: true, manager: updatedManager });
    } catch (error) {
      console.error("Error updating manager:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  exports.deleteManager = async (req, res) => {
    try {
      // Find the manager by ID and remove
      const manager = await Manager.findByIdAndDelete(req.params.id);
      
      if (!manager) {
        return res.status(404).json({ success: false, message: "Manager not found" });
      }
      
      // Return success response if manager was deleted
      res.status(200).json({ success: true, message: "Manager deleted successfully" });
    } catch (error) {
      console.error("Error deleting manager:", error);
      res.status(500).json({ success: false, message: "Server Error" });
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
exports.deleteTeam = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeam = await Team.findByIdAndDelete(id);

        if (!deletedTeam) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, message: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
        console.error('Error updating team:', error);
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


// ✅ Change Manager Password
exports.changeManagerPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const managerId = req.params.id;

        // 🔎 Find the manager by ID
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).json({ success: false, message: 'Manager not found' });
        }

        // 🔒 Check if current password matches
        if (manager.password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        // 🚫 Prevent using the same password again
        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: 'New password must be different from the current password' });
        }

        // ✅ Update password
        manager.password = newPassword; // 🔐 Hashing should be applied in production
        await manager.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing manager password:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
