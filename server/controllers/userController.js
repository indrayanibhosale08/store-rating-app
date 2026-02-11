const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        const userRatings = await Rating.find({ user: req.user.id });

        const storeList = stores.map(store => {
            const ratingEntry = userRatings.find(r => r.store.toString() === store._id.toString());
            return {
                ...store._doc,
                myRating: ratingEntry ? ratingEntry.rating : 0 
            };
        });

        res.json(storeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { storeId, ratingValue } = req.body;

       
        await Rating.findOneAndUpdate(
            { user: req.user.id, store: storeId },
            { rating: ratingValue },
            { upsert: true, new: true }
        );

        const allRatings = await Rating.find({ store: storeId });
        const total = allRatings.reduce((sum, item) => sum + item.rating, 0);
        const average = (total / allRatings.length).toFixed(1);

        await Store.findByIdAndUpdate(storeId, { rating: average });

        res.json({ message: "Rating saved successfully", averageRating: average });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};