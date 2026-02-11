const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.getMyStoreStats = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user.id });
        
        if (!store) {
            return res.status(404).json({ message: "Store not found for this owner" });
        }

        const raters = await Rating.find({ store: store._id })
            .populate('user', 'name') 
            .sort({ createdAt: -1 });

        res.json({ store, raters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};