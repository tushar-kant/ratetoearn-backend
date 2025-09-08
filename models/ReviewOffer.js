const mongoose = require('mongoose');

const reviewOfferSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
  },
  reviews: {
    type: Number,
  },
  timeEstimate: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  category: {
    type: String,
  },
  primaryLink: {
    type: String,
  },
  secondaryLink: {
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
  timeRequired: {
    type: String,
  },
});

const ReviewOffer = mongoose.model('ReviewOffer', reviewOfferSchema);

module.exports = ReviewOffer;
