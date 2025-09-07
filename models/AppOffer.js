const mongoose = require('mongoose');

const appOfferSchema = new mongoose.Schema({
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
  shortDesc: {
    type: String,
  },
  instructions: {
    type: Array,
  },
  breakdown: {
    type: Object,
  },
  badges: {
    type: Array,
  },
  completions: {
    type: Number,
  },
});

const AppOffer = mongoose.model('AppOffer', appOfferSchema);

module.exports = AppOffer;
