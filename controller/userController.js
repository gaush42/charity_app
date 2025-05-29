const { User, Donation, Organization, Project } = require('../model');

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // set in authenticate middleware

    const { fullname, email, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      fullname: fullname || user.fullname,
      email: email || user.email,
      password: password || user.password // make sure to hash it if needed
    });

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Get donation history for logged-in user
exports.getUserDonations = async (req, res) => {
  try {
    const userId = req.userId;

    const donations = await Donation.findAll({
      where: { userId },
      include: [
        { model: Organization, attributes: ['id', 'orgName'] },
        { model: Project, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations", error: err.message });
  }
};
