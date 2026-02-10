// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Store = require('../models/Store');
// const Rating = require('../models/Rating');
// const { protect } = require('../middleware/authMiddleware');

// // Get Stats
// router.get('/stats', protect(['Admin']), async (req, res) => {
//     const totalUsers = await User.countDocuments();
//     const totalStores = await Store.countDocuments();
//     const totalRatings = await Rating.countDocuments();
//     res.json({ totalUsers, totalStores, totalRatings });
// });

// // Get All Users (with Filter & Sort)
// router.get('/users', protect(['Admin']), async (req, res) => {
//     const { role, search } = req.query;
//     let query = {};
//     if (role) query.role = role;
//     if (search) query.name = { $regex: search, $options: 'i' };

//     const users = await User.find(query).select('-password');
//     res.json(users);
// });

// // Get All Stores
// router.get('/stores', protect(['Admin']), async (req, res) => {
//     const stores = await Store.find();
//     res.json(stores);
// });

// // Add New Store
// router.post('/add-store', protect(['Admin']), async (req, res) => {
//     try {
//         const { name, email, address } = req.body;

//         // Validation for Name (20-60 chars) as per your requirements
//         if (name.length < 20 || name.length > 60) {
//             return res.status(400).json({ message: "Store name must be 20-60 characters" });
//         }

//         const newStore = new Store({ name, email, address });
//         await newStore.save();
//         res.status(201).json({ message: "Store added successfully!" });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const { protect } = require("../middleware/authMiddleware");

// 1. Get Stats (Make sure we count ALL users)
router.get("/stats", protect(["Admin"]), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Counts everyone
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Get Users (Ensure it returns the data for the table)
router.get("/users", protect(["Admin"]), async (req, res) => {
  try {
    // Find all users except their passwords
    const users = await User.find({}).select("-password");
    console.log("Users found:", users.length); // DEBUG: check your server terminal
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Get Stores (Ensure it returns data)
router.get("/stores", protect(["Admin"]), async (req, res) => {
  try {
    const stores = await Store.find({});
    console.log("Stores found:", stores.length); // DEBUG: check terminal
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
