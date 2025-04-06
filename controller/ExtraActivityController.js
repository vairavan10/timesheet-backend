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
