const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 20, maxlength: 60 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true, maxlength: 400 },
    role: { type: String, enum: ['Admin', 'User', 'StoreOwner'], default: 'User' }
});
module.exports = mongoose.model('User', userSchema);