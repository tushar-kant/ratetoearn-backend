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

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const lastCheckin = user.lastCheckin; // now will be stored as number

    console.log(`Current time (seconds): ${nowInSeconds}, User's lastCheckin: ${lastCheckin}`);

    if (1) {
      const diffInSeconds = nowInSeconds - lastCheckin;
      const diffInHours = diffInSeconds / 3600;

      console.log(
        `Last check-in: ${lastCheckin}, Current time: ${nowInSeconds}, Difference: ${diffInSeconds} seconds (~${diffInHours} hrs)`
      );

      if (diffInSeconds < (24 * 3600)) {
        return res.status(400).json({ message: 'Wait for the next day to checkin again' });
      }
    } else {
      console.log("First check-in for this user");
    }

    // Update user
    user.coins += 2;
    user.lastCheckin = nowInSeconds; // ✅ store as seconds (number)

    console.log(`Before save: user.lastCheckin = ${user.lastCheckin}`);

    await user.save();

    console.log(`After save: user.lastCheckin = ${user.lastCheckin}`);

    // Update earning
    const earning = await Earning.findOne({ phone });
    if (earning) {
      earning.checkinEarning += 2;
      earning.totalEarning += 2;
      earning.availableNow = earning.totalEarning - earning.totalWithdrawn;
      await earning.save();
    }

    res.status(200).json({
      message: 'Check-in successful. You have received 1 coin.',
      coins: user.coins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    checkinLocks.delete(req.body.phone); // Release lock safely
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
