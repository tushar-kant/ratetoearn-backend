const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model('User', userSchema);

userSchema.add({
  lastCheckin: {
    type: Date,
    default: null,
  },
  coins: {
    type: Number,
    default: 0,
  }
});

module.exports = User;
