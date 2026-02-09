const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 20, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true, maxlength: 400 },
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Store', storeSchema);