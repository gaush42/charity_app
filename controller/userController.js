const { User, Donation, Organisation } = require('../models');

exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ['id', 'name', 'email', 'isAdmin'],
    include: [{ model: Organisation, as: 'organisations' }]
  });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  await User.update({ name }, { where: { id: req.user.userId } });
  res.json({ message: 'Profile updated' });
};

exports.getDonationHistory = async (req, res) => {
  const donations = await Donation.findAll({
    where: { UserId: req.user.userId },
    include: ['Organisation']
  });
  res.json(donations);
};
