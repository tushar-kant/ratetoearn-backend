const mongoose = require('mongoose');

const taskOfferSchema = new mongoose.Schema({
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
  timeEstimate: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  rating: {
    type: Number,
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
  reviews: {
    type: Number,
  },
  timeRequired: {
    type: String,
  },
});

const TaskOffer = mongoose.model('TaskOffer', taskOfferSchema);

module.exports = TaskOffer;
