const TimeSheet = require("../models/timesheet");
const mongoose = require("mongoose"); // ✅ Import Mongoose

// ✅ Create Timesheet with Email


const createTimeSheet = async (req, res) => {
  try {
    const { date, name, project, hours, workDone, email } = req.body;

    console.log("Received request body:", req.body);  // 🔍 Log request data

    if (!date || !name || !project || !hours || !workDone || !email) {
      return res.status(400).json({ message: "All fields are required, including email" });
    }

    // 🔍 Log project ID before validation
    console.log("Received Project ID:", project);

    // ✅ Validate and Convert Project ID
    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    // ✅ Convert project ID to ObjectId
    const projectId = new mongoose.Types.ObjectId(project);

    const newTimeSheet = new TimeSheet({
      date,
      name,
      project: projectId,  // ✅ Store as ObjectId
      hours,
      workDone,
      email,
    });

    await newTimeSheet.save();

    res.status(201).json({
      message: "Timesheet created successfully",
      data: newTimeSheet,
    });
  } catch (error) {
    console.error("Error creating timesheet:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Fetch All Timesheets (With Pagination & Sorting)
const getAllTimeSheets = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Fetch all timesheets and populate project details
    const timeSheets = await TimeSheet.find()
      .populate("project", "name") // ✅ Populating Project Name
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const totalCount = await TimeSheet.countDocuments();

    res.status(200).json({
      message: "All timesheets fetched successfully",
      data: timeSheets,
      total: totalCount,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching all timesheets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch Timesheets by User Email (With Pagination)
const getUserTimeSheets = async (req, res) => {
  try {
    const { email, page = 1, limit = 10 } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required to fetch user timesheets" });
    }

    const skip = (page - 1) * limit;

    const timeSheets = await TimeSheet.find({ email })
    
      .populate("project", "name") // ✅ Populate Project Details
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const totalCount = await TimeSheet.countDocuments({ email });

    res.status(200).json({
      message: "User's timesheets fetched successfully",
      data: timeSheets,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching user timesheets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get User's Total Hours Worked
const getUserTotalHours = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required to fetch total hours" });
    }

    // Aggregate total hours worked by the user
    const totalHours = await TimeSheet.aggregate([
      { $match: { email } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]);

    res.status(200).json({
      message: "Total hours fetched successfully",
      totalHours: totalHours.length > 0 ? totalHours[0].totalHours : 0,
    });
  } catch (error) {
    console.error("Error fetching total hours:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Project's Total Hours Worked
const getProjectTotalHours = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    const totalHours = await TimeSheet.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]);

    res.status(200).json({
      message: "Total hours fetched successfully",
      totalHours: totalHours.length > 0 ? totalHours[0].totalHours : 0,
    });
  } catch (error) {
    console.error("Error fetching total hours:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Export Controllers
module.exports = {
  createTimeSheet,
  getAllTimeSheets,
  getUserTimeSheets,
  getUserTotalHours,
  getProjectTotalHours,
};
