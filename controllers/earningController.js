const mongoose = require('mongoose');
const Earning = require('../models/Earning');
const User = require('../models/User');

exports.getEarning = async (req, res) => {
  try {
    const { phone } = req.body;

    const earning = await Earning.findOne({ phone });

    if (!earning) {
      return res.status(404).json({ message: 'Earning data not found for this phone number' });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this phone number' });
    }

    const referralCode = user.referralCode;

    res.status(200).json({ ...earning.toObject(), referralCode });
  } catch (error) {
    console.error('Error fetching earning data:', error);
    res.status(500).json({ message: 'Error fetching earning data' });
  }
};
