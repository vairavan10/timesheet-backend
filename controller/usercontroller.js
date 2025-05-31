const User = require("../models/user");
const ADMIN = require("../config/admin"); 
const Manager=require("../models/manager");
const Employee=require("../models/employees");

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password, role,name });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name:user.name,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (email === ADMIN?.email && password === ADMIN?.password) {
      return res.status(200).json({
        message: "Admin login successful",
        user: {
          name: ADMIN.name,
          email: ADMIN.email,
          role: "admin",
        },
      });
    }

    const user = await User.findOne({ email });
    const manager = await Manager.findOne({ email });
    const employee = await Employee.findOne({ email }); 

    if (!user && !manager && !employee) {
      return res.status(404).json({ message: "User not found" });
    }


    if (
      (user && user.password !== password) ||
      (manager && manager.password !== password) ||
      (employee && employee.password !== password)
    ) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const userName = user?.name ?? manager?.name ?? employee?.name;
    console.log("User name:", userName);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user?._id ?? manager?._id ?? employee._id, 
        email: user?.email ?? manager?.email ?? employee.email,
        role: user?.role ?? manager?.role ?? employee?.role ?? "user", 
        name: user?.name ?? manager?.name ?? employee?.name,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
