const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE SCHEMAS (MODELS)
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 20, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true, maxlength: 400 },
    role: {
      type: String,
      enum: ["Admin", "User", "StoreOwner"],
      default: "User",
    },
  }),
);

const Store = mongoose.model(
  "Store",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 20, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true, maxlength: 400 },
    rating: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }),
);

const Rating = mongoose.model(
  "Rating",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true },
  ),
);

// 2. AUTH MIDDLEWARE
const protect =
  (roles = []) =>
  (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Permission denied" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

// 3. AUTH & USER ROUTES

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Strict Password Validation
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 chars, 1 uppercase, 1 special char",
      });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed, address, role });
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({ token, user: { name: user.name, role: user.role } });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Password
app.post("/api/auth/update-password", protect(), async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.newPassword, 12);
    await User.findByIdAndUpdate(req.user.id, { password: hashed });
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ADMIN ROUTES

// Stats
app.get("/api/admin/stats", protect(["Admin"]), async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStores = await Store.countDocuments();
  const totalRatings = await Rating.countDocuments();
  res.json({ totalUsers, totalStores, totalRatings });
});

// List Users
app.get("/api/admin/users", protect(["Admin"]), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// List Stores
app.get("/api/admin/stores", protect(["Admin"]), async (req, res) => {
  const stores = await Store.find();
  res.json(stores);
});

// Admin: Add New Store
app.post("/api/admin/add-store", protect(["Admin"]), async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // 1. Validation Logic
    if (!name || name.length < 20 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Store Name must be between 20 and 60 characters." });
    }
    if (!address || address.length > 400) {
      return res
        .status(400)
        .json({ message: "Address is too long (Max 400 chars)." });
    }

    // 2. Check if store email already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res
        .status(400)
        .json({ message: "A store with this email already exists." });
    }

    // 3. Save Store
    const store = new Store({ name, email, address });
    await store.save();

    res.status(201).json({ message: "Store added successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/add-user", protect(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (name.length < 20 || name.length > 60)
      return res.status(400).json({ message: "Name 20-60 chars required" });
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passRegex.test(password))
      return res.status(400).json({ message: "Invalid Password format" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed, address, role });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/api/admin/users/:id/role", protect(["Admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["Admin", "User", "StoreOwner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 5. STORE RATING LOGIC

app.get("/api/user/stores", protect(["User"]), async (req, res) => {
  const stores = await Store.find();
  const myRatings = await Rating.find({ user: req.user.id });
  const result = stores.map((s) => {
    const found = myRatings.find((r) => r.store.equals(s._id));
    return { ...s._doc, myRating: found ? found.rating : 0 };
  });
  res.json(result);
});

// --- STORE OWNER API ---
app.get("/api/store/my-stats", protect(["StoreOwner"]), async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store) {
      return res
        .status(404)
        .json({ message: "No store linked to this account" });
    }

    const raters = await Rating.find({ store: store._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ store, raters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/user/rate", protect(["User"]), async (req, res) => {
  try {
    const { storeId, ratingValue } = req.body;
    await Rating.findOneAndUpdate(
      { user: req.user.id, store: storeId },
      { rating: ratingValue },
      { upsert: true },
    );

    const ratings = await Rating.find({ store: storeId });
    const avg = (
      ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
    ).toFixed(1);
    await Store.findByIdAndUpdate(storeId, { rating: avg });

    res.json({ message: "Rating updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. STORE OWNER ROUTES

app.get("/api/store/my-stats", protect(["StoreOwner"]), async (req, res) => {
  const store = await Store.findOne({ owner: req.user.id });
  if (!store) return res.json({ store: null, raters: [] });
  const raters = await Rating.find({ store: store._id }).populate(
    "user",
    "name",
  );
  res.json({ store, raters });
});

// 7. START SERVER

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
