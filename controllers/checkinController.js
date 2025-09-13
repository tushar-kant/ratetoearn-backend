const User = require('../models/User');
const Earning = require('../models/Earning'); // Import the Earning model

const checkinLocks = new Map(); // To prevent race conditions

exports.dailyCheckin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (checkinLocks.has(phone)) {
      return res.status(429).json({ message: 'Please wait, processing previous check-in request.' });
    }

    checkinLocks.set(phone, true); // Acquire lock

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastCheckin = user.lastCheckin;

    if (lastCheckin) {
      const diff = now.getTime() - new Date(lastCheckin).getTime();
      const diffInHours = diff / (1000 * 60 * 60);

      console.log(`Last check-in: ${lastCheckin}, Current time: ${now}, Difference: ${diffInHours} hours`);

      if (diffInHours < 24) {
        return res.status(400).json({ message: 'Wait for the next day to checkin again' });
      }
    }

    user.coins += 1;
    user.lastCheckin = now; // Store as Date object

    console.log(`Before save: user.lastCheckin = ${user.lastCheckin}`);

    await user.save();

    console.log(`After save: user.lastCheckin = ${user.lastCheckin}`);

    // Add check-in earning
    const earning = await Earning.findOne({ phone });
    if (earning) {
      earning.checkinEarning += 1;
      earning.totalEarning += 1;
      earning.availableNow = earning.totalEarning - earning.totalWithdrawn;
      await earning.save();
    }

    res.status(200).json({ message: 'Check-in successful. You have received 1 coin.', coins: user.coins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    checkinLocks.delete(phone); // Release lock
  }
};

exports.adsCheckin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let earning = await Earning.findOne({ phone });
    if (earning) {
      earning.adsEarning += 1;
      earning.totalEarning += 1;
      earning.availableNow = earning.totalEarning - earning.totalWithdrawn;
      await earning.save();
    }
 
    res.status(200).json({ message: 'Ads check-in successful.', earning });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
