const User = require('../models/User');

exports.dailyCheckin = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastCheckin = user.lastCheckin;

    if (lastCheckin) {
      const diff = now.getTime() - lastCheckin.getTime();
      const diffInHours = diff / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return res.status(400).json({ message: 'You can only check in once every 24 hours' });
      }
    }

    user.coins += 1;
    user.lastCheckin = now;

    await user.save();

    res.status(200).json({ message: 'Check-in successful. You have received 1 coin.', coins: user.coins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
