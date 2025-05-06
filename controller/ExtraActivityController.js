// controller/managercontroller.js
const ExtraActivity = require('../models/ExtraActivity');

// controller/managercontroller.js
exports.addExtraActivity = async (req, res) => {
    try {
      const { name, createdBy } = req.body;
  
      const newActivity = new ExtraActivity({ name, createdBy });
      await newActivity.save();
      res.status(201).json({ message: 'Extra activity added successfully', activity: newActivity });
    } catch (err) {
      res.status(500).json({ message: 'Error adding extra activity', error: err.message });
    }
  };
  

exports.getExtraActivities = async (req, res) => {
  try {
    const activities = await ExtraActivity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching extra activities', error: err.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedActivity = await ExtraActivity.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      message: 'Activity updated successfully',
      activity: updatedActivity,
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
};
exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await ExtraActivity.findByIdAndDelete(req.params.id);

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      message: 'Activity deleted successfully',
      activity: deletedActivity,
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error while deleting activity' });
  }
};
