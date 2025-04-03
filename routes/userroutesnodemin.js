// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModelnodemin');

// // LOGIN ROUTE
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // 1. Find user in the database
//     const user = await User.findOne({ email: email });

//     // 2. If no user found
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // 3. If password does not match (plain comparison)
//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     // 4. If successful login
//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
