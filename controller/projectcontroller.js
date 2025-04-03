const Project = require("../models/project");

// Create a new project
exports.createProject = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    try {
        const newProject = new Project({ name }); // Capitalized Model Name
        await newProject.save();

        res.status(201).json({ success: true, message: 'Project created successfully!' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all projects
exports.getProject = async (req, res) => {
    try {
        const projects = await Project.find(); // Renamed variable to "projects"

        res.status(200).json({
            message: 'Projects fetched successfully',
            data: projects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: 'Error fetching projects', error });
    }

};
exports.getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params; // Extract projectId from request URL
        const project = await Project.findById(projectId); // Find project by ID

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project fetched successfully',
            data: project
        });
    } catch (error) {
        console.error("Error fetching project", error);
        res.status(500).json({ message: 'Error fetching project', error });
    }
};


