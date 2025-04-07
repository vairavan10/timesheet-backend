const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDatabase = require('./config/connectdatabase');

// Load env vars (Good practice!)
dotenv.config({ path: path.join(__dirname, 'config', "config.env") });

// Connect to database
connectDatabase();

// Middleware
app.use(express.json()); // Parses incoming JSON
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.get('/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});


// Routes
const userRoutes = require('./routes/userroutes');
app.use('/api/users', userRoutes);

const employeeRoutes = require('./routes/employeeroutes');
app.use('/api/employees', employeeRoutes);

const teamRoutes = require('./routes/teamroutes');
app.use('/api/teams', teamRoutes);

const managerRoutes = require('./routes/managerroutes');
app.use('/api/managers', managerRoutes);


const timesheetRoutes = require('./routes/timesheetroute');
app.use('/api/timesheet', timesheetRoutes);

const projectRoutes = require('./routes/projectroutes');
app.use('/api/project', projectRoutes);

const projectDetailsRoute = require('./routes/projectDetailsRoute');
app.use('/api/projectdetails',projectDetailsRoute);

const extraActivityRoutes = require('./routes/ExtraActivityRoutes');
app.use('/api/extra-activities', extraActivityRoutes);
const employeeLogRoutes = require('./routes/employeeSummaryRoute');

app.use('/api/employeelog', employeeLogRoutes);

// Server listener
app.listen(process.env.PORT, () => {
  console.log(`✅ Server Listening on Port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
