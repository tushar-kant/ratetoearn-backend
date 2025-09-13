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
    lastCheckin: {
    type: Number,
    default: null,
  },
});

const User = mongoose.model('User', userSchema);

userSchema.add({

  coins: {
    type: Number,
    default: 0,
  },
  settings: {
    type: Object,
    default: {}
  }
});

module.exports = User;
