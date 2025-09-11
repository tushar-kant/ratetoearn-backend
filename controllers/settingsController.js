// backend/controllers/settingsController.js
const User = require('../models/User');

exports.updateSettings = async (req, res) => {
  try {
    const { phone, settings } = req.body;

    const user = await User.findOne({ phone: phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.settings = settings;
    await user.save();

    res.status(200).json({ message: 'Settings updated successfully', settings: user.settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

exports.getSettingsByPhone = async (req, res) => {
  try {
    const phone = req.body.phone;

    const user = await User.findOne({ phone: phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ settings: user.settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get settings' });
  }
};
