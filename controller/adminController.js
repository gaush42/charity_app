const { User, Organisation } = require('../models');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'isAdmin'] });
  res.json(users);
};

exports.getAllOrganisations = async (req, res) => {
  const orgs = await Organisation.findAll({ include: ['owner'] });
  res.json(orgs);
};

exports.approveOrganisation = async (req, res) => {
  const org = await Organisation.findByPk(req.params.id);
  if (!org) return res.status(404).json({ message: 'Organisation not found' });

  await org.update({ isApproved: true });
  res.json({ message: 'Organisation approved' });
};
