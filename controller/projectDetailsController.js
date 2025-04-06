const ProjectDetails = require('../models/projectDetails');
const Project = require('../models/project');

// Add project details
exports.addProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { fromDate, toDate, dependencies, hoursSpent, utilization, status } = req.body;

        // Validate input
        if (!fromDate || !toDate || !dependencies || !hoursSpent || !utilization || !status) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if project exists
        const projectExists = await Project.findById(projectId);
        if (!projectExists) {
            return res.status(404).json({ error: "Project not found." });
        }

        // Create new project details entry
        const newProjectDetails = new ProjectDetails({
            projectId,
            fromDate,
            toDate,
            dependencies,
            hoursSpent,
            utilization,
            status
        });

        await newProjectDetails.save();
        res.status(201).json({ message: "Project details added successfully.", data: newProjectDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.getAvailableDateRanges = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Find all records and return only fromDate & toDate
      const dateRanges = await ProjectDetails.find({ projectId }).select("fromDate toDate -_id").sort({ fromDate: 1 });
  
      if (!dateRanges.length) {
        return res.status(200).json({ message: "No available date ranges found for this project." });
      }
  
      res.status(200).json(dateRanges);
    } catch (error) {
      console.error("Error fetching available date ranges:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  exports.getAllAvailableDateRanges = async (req, res) => {
    try {
      // Find all unique fromDate & toDate pairs across all project details
      const dateRanges = await ProjectDetails.find({})
        .select("fromDate toDate -_id")
        .sort({ fromDate: -1 });
  
      if (!dateRanges.length) {
        return res.status(200).json({ message: "No available date ranges found." });
      }
  
      // Optional: Remove duplicates (if needed)
      const uniqueDates = Array.from(
        new Set(dateRanges.map(JSON.stringify)) // Convert objects to strings
      ).map(JSON.parse); // Convert back to objects
  
      res.status(200).json({ dates: uniqueDates });
    } catch (error) {
      console.error("Error fetching available date ranges:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  // 🔹 Fetch report for a selected date range
  exports.getProjectReport = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { fromDate, toDate } = req.query;
  
      if (!fromDate || !toDate) {
        return res.status(400).json({ message: "Both fromDate and toDate are required." });
      }
  
      const from = new Date(fromDate);
      const to = new Date(toDate);
  
      console.log("Searching for projectId:", projectId);
      console.log("From Date:", from);
      console.log("To Date:", to);
  
      // Find the report with an exact date match
      const report = await ProjectDetails.findOne({
        projectId,
        fromDate: from,
        toDate: to,
      });
  
      console.log("Query result:", report);
  
      if (!report) {
        return res.status(200).json({ message: "No report found for the selected date range." });
      }
  
      res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching project report:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  // 🔹 Fetch the latest report for a project
exports.getLatestProjectReport = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the latest report by sorting toDate in descending order
    const latestReport = await ProjectDetails.findOne({ projectId }).sort({ toDate: -1 });

    if (!latestReport) {
      return res.status(200).json({ message: "No reports found for this project." });
    }

    res.status(200).json(latestReport);
  } catch (error) {
    console.error("Error fetching latest project report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Regular function in the same file
const getWeekOptions = (allReports) => {
  const weekSet = new Set();
  const weekMap = {};
  let count = 1;

  for (const reports of Object.values(allReports)) {
    for (const report of reports) {
      const from = new Date(report.fromDate);
      const to = new Date(report.toDate);
      const label = `Week ${count} (${from.toLocaleDateString()} - ${to.toLocaleDateString()})`;

      const key = `${from.toISOString()}_${to.toISOString()}`;
      if (!weekSet.has(key)) {
        weekSet.add(key);
        weekMap[`week${count}`] = {
          label,
          start: from,
          end: to,
        };
        count++;
      }
    }
  }

  return weekMap;
};

// ✅ Get all reports for a project with computed week numbers
exports.getAllProjectDetailsWithWeeks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const reports = await ProjectDetails.find({ projectId: new mongoose.Types.ObjectId(projectId) }).sort({ fromDate: 1 });

    if (!reports.length) {
      return res.status(404).json({ message: "No reports found for this project." });
    }

    const reportsWithWeeks = reports.map((report, index) => ({
      ...report._doc,
      week: `Week ${index + 1}`
    }));

    res.status(200).json(reportsWithWeeks);
  } catch (error) {
    console.error("Error fetching all project details with weeks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.generateWeekOptions = (req, res) => {
  try {
    const allReports = req.body; // should be object of arrays per projectId
    const weeks = getWeekOptions(allReports); // use your helper function
    res.status(200).json(weeks);
  } catch (error) {
    console.error("Error generating week options:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getReportByDate = async (req, res) => {
  const { id } = req.params;
  const { fromDate, toDate } = req.query;

  try {
    const report = await ProjectDetails.find({
      projectId: id,
      fromDate: { $gte: new Date(fromDate) },
      toDate: { $lte: new Date(toDate) }
    }).sort({ fromDate: 1 });

    if (!report || report.length === 0) {
      return res.status(404).json({ message: 'No reports found in given date range' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error in getReportByDate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
