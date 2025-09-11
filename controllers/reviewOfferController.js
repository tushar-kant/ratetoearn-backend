const mongoose = require('mongoose');
const ReviewOffer = require('../models/ReviewOffer');
const { checkPhoneNumber } = require('../middleware');
const PendingOffer = require('../models/PendingOffer');

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

// Complete a review offer and grant coins to the user
exports.reviewCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the review offer by ID
    const reviewOffer = await ReviewOffer.findById(taskId);
    if (!reviewOffer) {
      return res.status(404).json({ message: 'Review offer not found' });
    }

    // Check if a PendingOffer already exists
    const existingPendingOffer = await PendingOffer.findOne({ offerId: taskId, phone: phone, offerType: 'review' });
    if (existingPendingOffer) {
      return res.status(400).json({ message: 'Pending offer already exists for this user and review offer' });
    }

    // Create a new PendingOffer
    const pendingOffer = new PendingOffer({
      offerId: taskId,
      phone: phone,
      offerType: 'review',
    });
    await pendingOffer.save();

    res.status(200).json({ message: 'Review offer review requested', pendingOffer });
  } catch (error) {
    console.error('Error reviewing review offer:', error);
    res.status(500).json({ message: 'Error reviewing review offer' });
  }
}];

// Approve complete offer, grant coins to the user, and set as complete
exports.approveCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the review offer by ID
    const reviewOffer = await ReviewOffer.findById(taskId);
    if (!reviewOffer) {
      return res.status(404).json({ message: 'Review offer not found' });
    }

    // Check if the user has already completed the review offer
    if (reviewOffer.completedBy.includes(phone)) {
      return res.status(400).json({ message: 'User has already completed this review offer' });
    }

    // Find and delete the PendingOffer
    const pendingOffer = await PendingOffer.findOneAndDelete({ offerId: taskId, phone: phone, offerType: 'review' });
    if (!pendingOffer) {
      return res.status(404).json({ message: 'Pending offer not found' });
    }

    // Add the user's phone to the completedBy array
    reviewOffer.completedBy.push(phone);
    reviewOffer.status = 'completed';
    await reviewOffer.save();

    // Find the user by phone number
    const User = require('../models/User'); // Import the User model
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Grant the user coins based on the review offer's earning field
    user.coins += reviewOffer.earning;
    await user.save();
    console.log('approveCompleteOffer: user after update =', user);

    // Update or create Earning document
    const Earning = require('../models/Earning');
    const earning = await Earning.findOneAndUpdate(
      { phone: phone },
      { $inc: { availableNow: reviewOffer.earning, totalEarning: reviewOffer.earning } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Review offer completed successfully, and coins granted to user', reviewOffer, user, earning });
  } catch (error) {
    res.status(500).json({ message: 'Error completing review offer' });
  }
}];

// Complete a review offer
exports.completeReviewOffer = [checkPhoneNumber, async (req, res) => {
  res.status(200).json({ message: 'Review offer review completed successfully' });
}];
