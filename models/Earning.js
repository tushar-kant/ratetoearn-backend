const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  totalEarning: {
    type: Number,
    default: 0,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
  },
  availableNow: {
    type: Number,
    default: 0,
  },
  adsEarning: {
    type: Number,
    default: 0,
  },
  referralEarning: {
    type: Number,
    default: 0,
  },
  checkinEarning: {
    type: Number,
    default: 0,
  },
  conversionData: {
    type: Number,
    default: 10,
  },
});

const Earning = mongoose.model('Earning', earningSchema);

module.exports = Earning;
