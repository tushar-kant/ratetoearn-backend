const mongoose = require('mongoose');

const appOfferSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  earning: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  rating: {
    type: Number,
  },
  difficulty: {
    type: String,
  },
  timeRequired: {
    type: String,
  },
  instructions: {
    type: [String],
    default: [],
  },
  badges: {
    type: [String],
    default: [],
  },
  reviews: {
    type: Number,
  },
  timeEstimate: {
    type: String,
  },
  primaryLink: {
    type: String,
  },
  secondaryLink: {
    type: String,
  },
  completedBy: {
    type: [String],
    default: [],
  },
  pendingBy: {
    type: [String],
    default: [],
  },
});

const AppOffer = mongoose.model('AppOffer', appOfferSchema);

module.exports = AppOffer;
