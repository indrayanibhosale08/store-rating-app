const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validation for Name (20-60 characters)
    if (!name || name.length < 20 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Name must be 20-60 characters long." });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this to your existing exports
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        // Password Validation (8-16 chars, 1 Upper, 1 Special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: "Password must be 8-16 chars, include 1 uppercase and 1 special character." 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};