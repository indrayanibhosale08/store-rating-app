const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.getMyStoreStats = async (req, res) => {
    try {
        // Find the store owned by the logged-in user
        const store = await Store.findOne({ owner: req.user.id });
        
        if (!store) {
            return res.status(404).json({ message: "Store not found for this owner" });
        }

        // Get all ratings for this store and include user names
        const raters = await Rating.find({ store: store._id })
            .populate('user', 'name') // Only get the name of the user
            .sort({ createdAt: -1 });

        res.json({ store, raters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};