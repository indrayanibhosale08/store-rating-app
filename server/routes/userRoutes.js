const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const { getAllStores, submitRating } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Fetch all stores with the user's specific rating
router.get("/stores", protect(["User"]), async (req, res) => {
  try {
    const stores = await Store.find();
    const userRatings = await Rating.find({ user: req.user.id });

    const storeList = stores.map((store) => {
      const myRating = userRatings.find(
        (r) => r.store.toString() === store._id.toString(),
      );
      return {
        ...store._doc,
        myRating: myRating ? myRating.rating : 0,
      };
    });
    res.json(storeList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit/Update Rating
router.post("/rate", protect(["User"]), async (req, res) => {
  const { storeId, ratingValue } = req.body;
  try {
    await Rating.findOneAndUpdate(
      { user: req.user.id, store: storeId },
      { rating: ratingValue },
      { upsert: true },
    );

    // Recalculate Average for Store
    const allRatings = await Rating.find({ store: storeId });
    const avg =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;

    await Store.findByIdAndUpdate(storeId, { rating: avg.toFixed(1) });

    res.json({ message: "Rating submitted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/stores', protect(['User']), getAllStores);
router.post('/rate', protect(['User']), submitRating);

module.exports = router;
