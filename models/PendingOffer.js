const mongoose = require('mongoose');

const pendingOfferSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  offerType: {
    type: String,
    enum: ['task', 'review', 'app'],
    required: true,
  },
});

const PendingOffer = mongoose.model('PendingOffer', pendingOfferSchema);

module.exports = PendingOffer;
