// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, address, role } = req.body;

//     // Validation for Name (20-60 characters)
//     if (!name || name.length < 20 || name.length > 60) {
//       return res
//         .status(400)
//         .json({ message: "Name must be 20-60 characters long." });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       address,
//       role,
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" },
//     );

//     res.json({
//       token,
//       user: { id: user._id, name: user.name, role: user.role },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const express = require('express');
const router = express.Router();
const { getMyStoreStats } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-stats', protect(['StoreOwner']), getMyStoreStats);

module.exports = router;