const TimeSheet = require("../models/timesheet");
const mongoose = require("mongoose"); // ✅ Import Mongoose

// ✅ Create Timesheet with Email


const createTimeSheet = async (req, res) => {
  try {
    const { date, name, project, hours, workDone, activity, email } = req.body;

    console.log("Received request body:", req.body);  // 🔍 Log request data

    if (!date || !name || !project || !hours || !workDone || activity || !email) {
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
      activity,
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
    const { fromDate, toDate } = req.query; // Get the selected date range from query params

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    // Build the date filter only if both dates are provided
    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        date: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      };
    }

    // Fetch total hours based on date range
    const totalHours = await TimeSheet.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId), ...dateFilter } },
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

const getProjectUtilization = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { fromDate, toDate } = req.query; // Extract date range

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    // Build the date filter if both dates are provided
    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        date: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      };
    }

    // ✅ Calculate total hours for the specified project
    const projectHours = await TimeSheet.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId), ...dateFilter } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]);

    const totalProjectHours = projectHours.length > 0 ? projectHours[0].totalHours : 0;

    // ✅ Calculate total hours for all projects
    const allProjectsHours = await TimeSheet.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]);

    const totalAllProjectsHours = allProjectsHours.length > 0 ? allProjectsHours[0].totalHours : 0;

    // ✅ Compute Utilization Percentage
    const utilization = totalAllProjectsHours > 0 
      ? ((totalProjectHours / totalAllProjectsHours) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      message: "Project utilization fetched successfully",
      projectId,
      totalProjectHours,
      totalAllProjectsHours,
      utilization: `${utilization}`,
    });
  } catch (error) {
    console.error("Error fetching project utilization:", error);
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
  getProjectUtilization,
};
