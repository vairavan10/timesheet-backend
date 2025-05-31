const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDatabase = require('./config/connectdatabase');
const fs = require("fs"); 

dotenv.config({ path: path.join(__dirname, 'config', "config.env") });


connectDatabase();
// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.use(express.json()); 
app.use(cors()); 
app.get('/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});


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


app.listen(process.env.PORT, () => {
  console.log(`Server Listening on Port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
