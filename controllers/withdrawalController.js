const mongoose = require('mongoose');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

const Earning = require('../models/Earning');

const withdrawalController = {
  createWithdrawal: async (req, res) => {
    try {
      const { amount, type, upiid, phoneNumber } = req.body;

      // Validate input
      if (!amount || !type || !phoneNumber) {
        return res.status(400).json({ message: "Amount, type, and phoneNumber are required" });
      }

      if (type === "UPI" && !upiid) {
        return res.status(400).json({ message: "UPI ID is required for UPI withdrawals" });
      }

      // Create a new withdrawal request
      const withdrawal = new Withdrawal({
        phoneNumber,
        amount,
        type,
        upiid,
      });

      await withdrawal.save();

      // Respond to the client
      res.status(201).json({ message: "Withdrawal request created successfully", withdrawal });
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateWithdrawalState: async (req, res) => {
    try {
      const { id } = req.params;
      const { state } = req.body;

      // Validate input
      if (!id || !state) {
        return res.status(400).json({ message: "Withdrawal ID and state are required" });
      }

      if (!['pending', 'rejected', 'success'].includes(state)) {
        return res.status(400).json({ message: "Invalid withdrawal state" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid withdrawal ID" });
      }

      const withdrawal = await Withdrawal.findById(id);

      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }

      withdrawal.state = state;
      await withdrawal.save();

      if (state === 'success') {
        // Deduct coins from user's earning
        const user = await User.findOne({ phone: withdrawal.phoneNumber });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const earning = await Earning.findOne({ phone: withdrawal.phoneNumber });
        if (!earning) {
          return res.status(404).json({ message: "Earning not found" });
        }

        if (earning.availableNow < withdrawal.amount) {
          withdrawal.state = 'rejected';
          await withdrawal.save();
          return res.status(400).json({ message: "Insufficient coins" });
        }

        earning.availableNow -= withdrawal.amount;
        earning.totalWithdrawn += withdrawal.amount;
        await earning.save();
      }

      res.status(200).json({ message: "Withdrawal state updated successfully", withdrawal });
    } catch (error) {
      console.error("Error updating withdrawal state:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = withdrawalController;
