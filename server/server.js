const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Allows the server to read JSON from the frontend
app.use(cors()); // Allows the frontend to talk to the backend

// Import Routes (We will create these files next)
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.log("DB Connection Error: ", err));