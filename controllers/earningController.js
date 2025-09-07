const mongoose = require('mongoose');
const Earning = require('../models/Earning');

exports.getEarning = async (req, res) => {
  try {
    const { phone } = req.body;

    const earning = await Earning.findOne({ phone });

    if (!earning) {
      return res.status(404).json({ message: 'Earning data not found for this phone number' });
    }

    res.status(200).json(earning);
  } catch (error) {
    console.error('Error fetching earning data:', error);
    res.status(500).json({ message: 'Error fetching earning data' });
  }
};
