const mongoose = require('mongoose');
const ReviewOffer = require('../models/ReviewOffer');

// Get all review offers
exports.getReview = async (req, res) => {
  try {
    const reviewOffers = await ReviewOffer.find();
    res.status(200).json(reviewOffers);
  } catch (error) {
    console.error('Error fetching review offers:', error);
    res.status(500).json({ message: 'Error fetching review offers' });
  }
};

// Add a new review offer
exports.addReview = async (req, res) => {
  try {
    const reviewOffer = new ReviewOffer(req.body);
    await reviewOffer.save();
    res.status(201).json({ message: 'Review offer added successfully', reviewOffer });
  } catch (error) {
    console.error('Error adding review offer:', error);
    res.status(500).json({ message: 'Error adding review offer' });
  }
};

// Get details of a specific review offer by ID
exports.getReviewDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const reviewOffer = await ReviewOffer.findById(id);

    if (!reviewOffer) {
      return res.status(404).json({ message: 'Review offer not found' });
    }

    // Ensure breakdown is always present with default values
    const breakdown = reviewOffer.breakdown || {
      installation: { value: '', icon: '', color: '' },
      usage: { value: '', icon: '', color: '' },
      retention: { value: '', icon: '', color: '' }
    };

    const reviewOfferWithBreakdown = {
      ...reviewOffer.toObject(),
      breakdown: {
        installation: { ...(breakdown.installation || { value: '', icon: '', color: '' }) },
        usage: { ...(breakdown.usage || { value: '', icon: '', color: '' }) },
        retention: { ...(breakdown.retention || { value: '', icon: '', color: '' }) }
      }
    };

    // Ensure instructions and badges are always present
    const instructions = reviewOffer.instructions || [];
    const badges = reviewOffer.badges || [];

    const reviewOfferWithAllFields = {
      ...reviewOfferWithBreakdown,
      instructions: instructions,
      badges: badges
    };

    res.status(200).json(reviewOfferWithAllFields);
  } catch (error) {
    console.error('Error fetching review offer details:', error);
    res.status(500).json({ message: 'Error fetching review offer details' });
  }
};
