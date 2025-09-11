const mongoose = require('mongoose');
const AppOffer = require('../models/AppOffer');
const { checkPhoneNumber } = require('../middleware');
const PendingOffer = require('../models/PendingOffer');

// Get all app offers
exports.getAppOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const appOffers = await AppOffer.find();
    res.status(200).json(appOffers);
  } catch (error) {
    console.error('Error fetching app offers:', error);
    res.status(500).json({ message: 'Error fetching app offers' });
  }
}];

// Add a new app offer
exports.addAppOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const appOffer = new AppOffer(req.body);
    await appOffer.save();
    res.status(201).json({ message: 'App offer added successfully', appOffer });
  } catch (error) {
    console.error('Error adding app offer:', error);
    res.status(500).json({ message: 'Error adding app offer' });
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

// Get details of a specific app offer by ID
exports.getAppOfferDetails = [checkPhoneNumber, async (req, res) => {
  try {
    const { id } = req.body;
    const appOffer = await AppOffer.findById(id);
    if (!appOffer) {
      return res.status(404).json({ message: 'App offer not found' });
    }
    res.status(200).json(appOffer);
  } catch (error) {
    console.error('Error fetching app offer details:', error);
    res.status(500).json({ message: 'Error fetching app offer details' });
  }
}];

// Delete an app offer
exports.deleteAppOffer = [async (req, res) => {
  try {
    const { id } = req.body;
    const appOffer = await AppOffer.findByIdAndDelete(id);
    if (!appOffer) {
      return res.status(404).json({ message: 'App offer not found' });
    }
    res.status(200).json({ message: 'App offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting app offer:', error);
    res.status(500).json({ message: 'Error deleting app offer' });
  }
}];

// Complete an app offer and grant coins to the user
exports.reviewCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the app offer by ID
    const appOffer = await AppOffer.findById(taskId);
        // const appOffer = await AppOffer.findById(id);
        console.log("App Offer Link:", appOffer);

    if (!appOffer) {
      return res.status(404).json({ message: 'App offer not found' });
    }

    // Check if a PendingOffer already exists
    const existingPendingOffer = await PendingOffer.findOne({ offerId: taskId, phone: phone, offerType: 'app' });
    if (existingPendingOffer) {
      return res.status(400).json({ message: 'Pending offer already exists for this user and app offer' });
    }

    // Create a new PendingOffer
    const pendingOffer = new PendingOffer({
      offerId: taskId,
      phone: phone,
      offerType: 'app',
    });
    await pendingOffer.save();

    res.status(200).json({ message: 'App offer review requested', appOffer });
  } catch (error) {
    console.error('Error reviewing app offer:', error);
    res.status(500).json({ message: 'Error reviewing app offer' });
  }
}];

// Approve complete offer, grant coins to the user, and set as complete
exports.approveCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the app offer by ID
    const appOffer = await AppOffer.findById(taskId);
    if (!appOffer) {
      return res.status(404).json({ message: 'App offer not found' });
    }

    // Find the user by phone number
    const User = require('../models/User'); // Import the User model
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already completed the app offer
    if (appOffer.completedBy.includes(phone)) {
      return res.status(400).json({ message: 'User has already completed this app offer' });
    }

    // Find and delete the PendingOffer
    const pendingOffer = await PendingOffer.findOneAndDelete({ offerId: taskId, phone: phone, offerType: 'app' });
    if (!pendingOffer) {
      return res.status(404).json({ message: 'Pending offer not found' });
    }

    // Add the user's phone to the completedBy array
    appOffer.completedBy.push(phone);
    appOffer.status = 'completed';
    await appOffer.save();

    // Grant the user coins based on the app offer's earning field
    user.coins += appOffer.earning;
    await user.save();

    // Update or create Earning document
    const Earning = require('../models/Earning');
    const earning = await Earning.findOneAndUpdate(
      { phone: phone },
      { $inc: { availableNow: appOffer.earning, totalEarning: appOffer.earning } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'App offer completed successfully, and coins granted to user', appOffer, user, earning });
  } catch (error) {
    res.status(500).json({ message: 'Error completing app offer' });
  }
}];

// Complete a app offer
exports.completeAppOffer = [checkPhoneNumber, async (req, res) => {
  res.status(200).json({ message: 'App offer review completed successfully' });
}];
