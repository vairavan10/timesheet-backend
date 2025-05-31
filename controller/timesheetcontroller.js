const TimeSheet = require("../models/timesheet");
const mongoose = require("mongoose"); // ✅ Import Mongoose

const createTimeSheet = async (req, res) => {
  try {
    const {
      date,
      name,
      project,
      hours,
      workDone,
      extraActivity,
      email,
      typeOfWork,
      leaveType
    } = req.body;

    console.log("Received request body:", req.body);

    // Validate common fields
    if (!date || !name || !email) {
      return res.status(400).json({ message: "Missing required fields (date, name, email)" });
    }

    const normalizedType = (typeOfWork || "").trim().toLowerCase();
    const normalizedLeaveType = (leaveType || "").trim().toLowerCase();

    // ----------------------
    // 🟥 LEAVE
    // ----------------------
    if (normalizedType === "leave") {
      if (!["half", "full", "half day", "full day"].includes(normalizedLeaveType)) {
        return res.status(400).json({ message: "Leave type must be 'Half Day' or 'Full Day'" });
      }

      const leaveHours = ["half", "half day"].includes(normalizedLeaveType) ? 4 : 8;
      const finalLeaveLabel = leaveHours === 4 ? "Half Day" : "Full Day";

      const newTimeSheet = new TimeSheet({
        date,
        name,
        email,
        hours: 0,
        workDone: workDone || "On Leave",
        typeOfWork: "Leave",
        leaveType: finalLeaveLabel,
        project: null,
        extraActivity: null,
      });

      await newTimeSheet.save();

      return res.status(201).json({
        message: `Timesheet for ${finalLeaveLabel} leave created successfully`,
        data: newTimeSheet,
      });
    }

    // ----------------------
    // 🟩 REGULAR / EXTRA ACTIVITY
    // ----------------------

    let calculatedHours = hours;

if (!hours && req.body.startTime && req.body.endTime) {
  const start = new Date(req.body.startTime);
  const end = new Date(req.body.endTime);

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ message: "Invalid startTime or endTime" });
  }

  const durationInMs = end - start;
  if (durationInMs <= 0) {
    return res.status(400).json({ message: "endTime must be after startTime" });
  }

  calculatedHours = +(durationInMs / (1000 * 60 * 60)).toFixed(2); // in hours
}

if (!calculatedHours || !workDone)
 {
      return res.status(400).json({ message: "Missing hours or workDone for regular entry" });
    }
    
    // ❌ Disallow 0 hours if it's not a leave
    if (Number(hours) <= 0) {
      return res.status(400).json({
        message: "Hours must be greater than 0 for Regular Work or Extra Activity",
      });
    }
    if (!project && !extraActivity) {
      return res.status(400).json({ message: "Either Project or Extra Activity must be filled" });
    }

    let projectId = null;
    if (project) {
      if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({ message: "Invalid project ID format" });
      }
      projectId = new mongoose.Types.ObjectId(project);
    }

    // Dynamically decide the type
    let finalTypeOfWork = "Regular Work";
    if (!project && extraActivity) {
      finalTypeOfWork = "Extra Activity";
    }

    const newTimeSheet = new TimeSheet({
      date,
      name,
      project: projectId,
      hours: calculatedHours,
      workDone,
      extraActivity: extraActivity || null,
      email,
      typeOfWork: finalTypeOfWork,
      leaveType: null,
    });

    await newTimeSheet.save();

    return res.status(201).json({
      message: "Timesheet created successfully",
      data: newTimeSheet,
    });

  } catch (error) {
    console.error("Error creating timesheet:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Fetch All Timesheets (With Pagination & Sorting)
const getAllTimeSheets = async (req, res) => {
  try {
    let { page = 1, limit = 10, fromDate, toDate } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Build a filter object
const matchFilter = {};
if (fromDate && toDate) {
  matchFilter.date = {
    $gte: new Date(fromDate),
    $lte: new Date(toDate),
  };
} else if (fromDate) {
  matchFilter.date = { $gte: new Date(fromDate) };
} else if (toDate) {
  matchFilter.date = { $lte: new Date(toDate) };
}

    const timeSheets = await TimeSheet.aggregate([
      { $match: matchFilter }, // Apply date filter here
      {
        $lookup: {
          from: "employees",
          localField: "email",
          foreignField: "email",
          as: "employeeDetails",
        },
      },
      {
        $unwind: {
          path: "$employeeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      {
        $unwind: {
          path: "$projectDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          isLeave: { $eq: ["$typeOfWork", "Leave"] },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    // Count total matching documents (with date filter)
    const totalCount = await TimeSheet.countDocuments(matchFilter);

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
      .populate("project", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const totalCount = await TimeSheet.countDocuments({ email });

    // ✅ Add isLeave flag
    const enrichedSheets = timeSheets.map((sheet) => {
      const isLeave = sheet.typeOfWork === "Leave";
      return {
        ...sheet._doc,
        isLeave,
        displayHours: isLeave ? (sheet.leaveType || "Leave") : `${sheet.hours} hrs`,
      };
    });
    

    res.status(200).json({
      message: "User's timesheets fetched successfully",
      data: enrichedSheets,
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

    // Include Regular Work and Extra Activity (exclude leaves or others)
    const totalHours = await TimeSheet.aggregate([
      {
        $match: {
          email,
          typeOfWork: { $in: ["Regular Work", "Extra Activity"] } // ✅ include both
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    res.status(200).json({
      message: "Total hours (Regular + Extra Activity) fetched successfully",
      totalHours: totalHours.length > 0 ? totalHours[0].totalHours : 0
    });
  } catch (error) {
    console.error("Error fetching total hours:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getUserProjectHours = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required to fetch total project hours" });
    }

    const totalProjectHours = await TimeSheet.aggregate([
      {
        $match: {
          email,
          typeOfWork: "Regular Work", // ✅ Exclude leaves
          $or: [
            { extraActivity: { $exists: false } },
            { extraActivity: { $in: [null, ""] } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    res.status(200).json({
      message: "Total project hours fetched successfully",
      projectHours: totalProjectHours.length > 0 ? totalProjectHours[0].totalHours : 0
    });
  } catch (error) {
    console.error("Error fetching total project hours:", error);
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
  getUserProjectHours,
};
