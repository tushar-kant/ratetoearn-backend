const mongoose = require('mongoose');
const ReviewOffer = require('../models/ReviewOffer');
const { checkPhoneNumber } = require('../middleware');

// Get all review offers
exports.getReview = [checkPhoneNumber, async (req, res) => {
  try {
    const reviewOffers = await ReviewOffer.find();
    res.status(200).json(reviewOffers);
  } catch (error) {
    console.error('Error fetching review offers:', error);
    res.status(500).json({ message: 'Error fetching review offers' });
  }
}];

// Add a new review offer
exports.addReview = [checkPhoneNumber, async (req, res) => {
  try {
    const reviewOffer = new ReviewOffer(req.body);
    await reviewOffer.save();
    res.status(201).json({ message: 'Review offer added successfully', reviewOffer });
  } catch (error) {
    console.error('Error adding review offer:', error);
    res.status(500).json({ message: 'Error adding review offer' });
  }
}];

function applyFallback(link) {
  if (!link) return link;

  let newLink = link;
  if (link.includes("google.com")) {
    newLink = "google.com";
  } else if (link.includes("youtube.com")) {
    newLink = "youtube.com";
  } else if (link.includes("playstore.com")) {
    newLink = "playstore.com";
  }
  return newLink;
}

// Get details of a specific review offer by ID
exports.getReviewDetails = [checkPhoneNumber, async (req, res) => {
  try {
    const { id } = req.body;
    const reviewOffer = await ReviewOffer.findById(id);
    if (!reviewOffer) {
      return res.status(404).json({ message: 'Review offer not found' });
    }
    res.status(200).json(reviewOffer);
  } catch (error) {
    console.error('Error fetching review offer details:', error);
    res.status(500).json({ message: 'Error fetching review offer details' });
  }
}];

// Delete a review offer
exports.deleteReviewOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { id } = req.body;
    const reviewOffer = await ReviewOffer.findByIdAndDelete(id);
    if (!reviewOffer) {
      return res.status(404).json({ message: 'Review offer not found' });
    }
    res.status(200).json({ message: 'Review offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting review offer:', error);
    res.status(500).json({ message: 'Error deleting review offer' });
  }
}];
