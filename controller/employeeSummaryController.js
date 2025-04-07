const TimeSheet = require('../models/timesheet');

const getEmployeeLogs = async (req, res) => {
  try {
    const timeSheets = await TimeSheet.find()
      .populate('project', 'name') // populate project name

    res.status(200).json(timeSheets);
  } catch (err) {
    console.error('Error fetching employee logs:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getEmployeeLogs };
