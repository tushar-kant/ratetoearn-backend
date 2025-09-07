const mongoose = require('mongoose');
const TaskOffer = require('../models/TaskOffer');

// Get all task offers
exports.getTaskOffer = async (req, res) => {
  try {
    const taskOffers = await TaskOffer.find();
    res.status(200).json(taskOffers);
  } catch (error) {
    console.error('Error fetching task offers:', error);
    res.status(500).json({ message: 'Error fetching task offers' });
  }
};

// Add a new task offer
exports.addTaskOffer = async (req, res) => {
  try {
    const taskOffer = new TaskOffer(req.body);
    await taskOffer.save();
    res.status(201).json({ message: 'Task offer added successfully', taskOffer });
  } catch (error) {
    console.error('Error adding task offer:', error);
    res.status(500).json({ message: 'Error adding task offer' });
  }
};

// Get details of a specific task offer by ID
exports.getTaskOfferDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const taskOffer = await TaskOffer.findById(id);

    if (!taskOffer) {
      return res.status(404).json({ message: 'Task offer not found' });
    }

    // Ensure breakdown is always present with default values
    const breakdown = taskOffer.breakdown || {
      installation: { value: '', icon: '', color: '' },
      usage: { value: '', icon: '', color: '' },
      retention: { value: '', icon: '', color: '' }
    };

    const taskOfferWithBreakdown = {
      ...taskOffer.toObject(),
      breakdown: {
        installation: { ...(breakdown.installation || { value: '', icon: '', color: '' }) },
        usage: { ...(breakdown.usage || { value: '', icon: '', color: '' }) },
        retention: { ...(breakdown.retention || { value: '', icon: '', color: '' }) }
      }
    };

    // Ensure instructions and badges are always present
    const instructions = taskOffer.instructions || [];
    const badges = taskOffer.badges || [];

    const taskOfferWithAllFields = {
      ...taskOfferWithBreakdown,
      instructions: instructions,
      badges: badges
    };

    res.status(200).json(taskOfferWithAllFields);
  } catch (error) {
    console.error('Error fetching task offer details:', error);
    res.status(500).json({ message: 'Error fetching task offer details' });
  }
};
