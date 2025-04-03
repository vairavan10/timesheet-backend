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
        return res.status(404).json({ message: "No available date ranges found for this project." });
      }
  
      res.status(200).json(dateRanges);
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
        return res.status(404).json({ message: "No report found for the selected date range." });
      }
  
      res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching project report:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };