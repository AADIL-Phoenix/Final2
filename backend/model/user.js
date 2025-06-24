const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    
    default: 'member'
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true, collection: 'users' }); // `timestamps: true` handles createdAt and updatedAt

const User = mongoose.model('User', userSchema);
module.exports = User;
