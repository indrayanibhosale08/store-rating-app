const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const { protect } = require('../middleware/authMiddleware');

// Route to add a store (Only Admins)
router.post('/add-store', protect(['Admin']), async (req, res) => {
    try {
        const newStore = new Store(req.body);
        await newStore.save();
        res.status(201).json({ message: "Store added successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;