const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // 1. Password Validation (8-16 chars, 1 Upper, 1 Special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be 8-16 chars, include 1 uppercase letter and 1 special character." 
            });
        }

        // 2. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Save User
        const newUser = new User({ name, email, password: hashedPassword, address, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT Token (Includes ID and Role)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};