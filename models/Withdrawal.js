const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['UPI', 'Crypto'],
  },
  upiid: {
    type: String,
  },
  state: {
    type: String,
    enum: ['pending', 'rejected', 'success'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
