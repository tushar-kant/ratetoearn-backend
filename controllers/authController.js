const mongoose = require('mongoose');
const User = require('../models/User');
const Earning = require('../models/Earning');

exports.register = async (req, res) => {
  try {
    const { phone, password, referralCode: providedReferralCode } = req.body;
    let referralCode = providedReferralCode;

    // Generate unique referral code if not provided
    if (!referralCode) {
      referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      // Ensure referral code is unique
      let existingUser = await User.findOne({ referralCode });
      while (existingUser) {
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        existingUser = await User.findOne({ referralCode });
      }
    }

    const user = new User({
      phone,
      password,
      referralCode,
    });

    await user.save();

    // Create a new Earning document for the user
    const earning = new Earning({
      phone: user.phone,
    });

    await earning.save();

    // Add referral bonus if referral code is valid
    if (providedReferralCode) {
      const referrer = await User.findOne({ referralCode: providedReferralCode });
      if (referrer) {
        // Add 10 points to the referrer's earning
        const referrerEarning = await Earning.findOne({ phone: referrer.phone });
        if (referrerEarning) {
          referrerEarning.referralEarning += 10;
          referrerEarning.totalEarning += 10;
          referrerEarning.availableNow = referrerEarning.totalEarning - referrerEarning.totalWithdrawn;
          await referrerEarning.save();
        }

        // Add 10 points to the new user's earning
        earning.totalEarning += 10;
        earning.availableNow = earning.totalEarning - earning.totalWithdrawn;
        await earning.save();
      }
    }

    res.status(201).json({ message: 'User registered successfully', referralCode });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};
