const mongoose = require('mongoose');
const AppOffer = require('../models/AppOffer');

// Get all app offers
exports.getAppOffer = async (req, res) => {
  try {
    const appOffers = await AppOffer.find();
    res.status(200).json(appOffers);
  } catch (error) {
    console.error('Error fetching app offers:', error);
    res.status(500).json({ message: 'Error fetching app offers' });
  }
};

// Add a new app offer
exports.addAppOffer = async (req, res) => {
  try {
    const appOffer = new AppOffer(req.body);
    await appOffer.save();
    res.status(201).json({ message: 'App offer added successfully', appOffer });
  } catch (error) {
    console.error('Error adding app offer:', error);
    res.status(500).json({ message: 'Error adding app offer' });
  }
};

// Get details of a specific app offer by ID
exports.getAppOfferDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const appOffer = await AppOffer.findById(id);

    if (!appOffer) {
      return res.status(404).json({ message: 'App offer not found' });
    }

    // Ensure breakdown is always present with default values
    const breakdown = appOffer.breakdown || {
      installation: { value: '', icon: '', color: '' },
      usage: { value: '', icon: '', color: '' },
      retention: { value: '', icon: '', color: '' }
    };

    const appOfferWithBreakdown = {
      ...appOffer.toObject(),
      breakdown: {
        installation: { ...(breakdown.installation || { value: '', icon: '', color: '' }) },
        usage: { ...(breakdown.usage || { value: '', icon: '', color: '' }) },
        retention: { ...(breakdown.retention || { value: '', icon: '', color: '' }) }
      }
    };

    // Ensure instructions and badges are always present
    const instructions = appOffer.instructions || [];
    const badges = appOffer.badges || [];

    const appOfferWithAllFields = {
      ...appOfferWithBreakdown,
      instructions: instructions,
      badges: badges
    };

    res.status(200).json(appOfferWithAllFields);
  } catch (error) {
    console.error('Error fetching app offer details:', error);
    res.status(500).json({ message: 'Error fetching app offer details' });
  }
};
