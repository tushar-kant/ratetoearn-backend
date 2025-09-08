const mongoose = require('mongoose');
const AppOffer = require('../models/AppOffer');
const { checkPhoneNumber } = require('../middleware');

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
