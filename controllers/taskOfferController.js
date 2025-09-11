const mongoose = require('mongoose');
const TaskOffer = require('../models/TaskOffer');
const { checkPhoneNumber } = require('../middleware');
const PendingOffer = require('../models/PendingOffer');

// Get all task offers
exports.getTaskOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const taskOffers = await TaskOffer.find();
    res.status(200).json(taskOffers);
  } catch (error) {
    console.error('Error fetching task offers:', error);
    res.status(500).json({ message: 'Error fetching task offers' });
  }
}];

// Add a new task offer
exports.addTaskOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const taskOffer = new TaskOffer(req.body);
    await taskOffer.save();
    res.status(201).json({ message: 'Task offer added successfully', taskOffer });
  } catch (error) {
    console.error('Error adding task offer:', error);
    res.status(500).json({ message: 'Error adding task offer' });
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

// Get details of a specific task offer by ID
exports.getTaskOfferDetails = [checkPhoneNumber, async (req, res) => {
  try {
    const { id } = req.body;
    const taskOffer = await TaskOffer.findById(id);
    if (!taskOffer) {
      return res.status(404).json({ message: 'Task offer not found' });
    }
    res.status(200).json(taskOffer);
  } catch (error) {
    console.error('Error fetching task offer details:', error);
    res.status(500).json({ message: 'Error fetching task offer details' });
  }
}];

// Delete a task offer
exports.deleteTaskOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { id } = req.body;
    const taskOffer = await TaskOffer.findByIdAndDelete(id);
    if (!taskOffer) {
      return res.status(404).json({ message: 'Task offer not found' });
    }
    res.status(200).json({ message: 'Task offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting task offer:', error);
    res.status(500).json({ message: 'Error deleting task offer' });
  }
}];

// Review complete offer and change status to pending
exports.reviewCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the task offer by ID
    const taskOffer = await TaskOffer.findById(taskId);
    if (!taskOffer) {
      return res.status(404).json({ message: 'Task offer not found' });
    }

    // Check if a PendingOffer already exists
    const existingPendingOffer = await PendingOffer.findOne({ offerId: taskId, phone: phone, offerType: 'task' });
    if (existingPendingOffer) {
      return res.status(400).json({ message: 'Pending offer already exists for this user and task' });
    }

    // Create a new PendingOffer
    const pendingOffer = new PendingOffer({
      offerId: taskId,
      phone: phone,
      offerType: 'task',
    });
    await pendingOffer.save();

    res.status(200).json({ message: 'Task offer review requested', pendingOffer });
  } catch (error) {
    console.error('Error reviewing task offer:', error);
    res.status(500).json({ message: 'Error reviewing task offer' });
  }
}];

// Approve complete offer, grant coins to the user, and set as complete
exports.approveCompleteOffer = [checkPhoneNumber, async (req, res) => {
  try {
    const { taskId, phone } = req.body;

    // Find the task offer by ID
    const taskOffer = await TaskOffer.findById(taskId);
    if (!taskOffer) {
      return res.status(404).json({ message: 'Task offer not found' });
    }

  

    // Check if the user has already completed the task
    if (taskOffer.completedBy.includes(phone)) {
      return res.status(400).json({ message: 'User has already completed this task' });
    }

    // Find and delete the PendingOffer
    const pendingOffer = await PendingOffer.findOneAndDelete({ offerId: taskId, phone: phone, offerType: 'task' });
    if (!pendingOffer) {
      return res.status(404).json({ message: 'Pending offer not found' });
    }

    // Add the user's phone to the completedBy array
    taskOffer.completedBy.push(phone);
    taskOffer.status = 'completed';
    await taskOffer.save();

    // Find the user by phone number
    const User = require('../models/User'); // Import the User model
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Grant the user coins based on the task offer's earning field
    user.coins += taskOffer.earning;
    await user.save();

    // Update or create Earning document
    const Earning = require('../models/Earning');
    const earning = await Earning.findOneAndUpdate(
      { phone: phone },
      { $inc: { availableNow: taskOffer.earning, totalEarning: taskOffer.earning } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Task offer completed successfully, and coins granted to user', taskOffer, user, earning });
  } catch (error) {
    res.status(500).json({ message: 'Error completing task offer' });
  }
}];

// Complete a task offer
exports.completeTaskOffer = [checkPhoneNumber, async (req, res) => {
  res.status(200).json({ message: 'Task offer review completed successfully' });
}];
