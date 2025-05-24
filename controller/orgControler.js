const { Organisation, Donation } = require('../models');

exports.createOrganisation = async (req, res) => {
  const { name, description, mission, goalAmount, location } = req.body;
  const organisation = await Organisation.create({ name, description, mission, goalAmount, location, createdBy: req.user.userId });
  res.status(201).json(organisation);
};

exports.getOrganisations = async (req, res) => {
  const orgs = await Organisation.findAll({ where: { isApproved: true } });
  res.json(orgs);
};

exports.getOrganisation = async (req, res) => {
  const org = await Organisation.findByPk(req.params.id, { include: ['owner'] });
  if (!org || !org.isApproved) return res.status(404).json({ message: 'Not found' });
  res.json(org);
};

exports.updateOrganisation = async (req, res) => {
  const org = await Organisation.findByPk(req.params.id);
  if (!org) return res.status(404).json({ message: 'Organisation not found' });

  const isOwner = req.user.userId === org.createdBy;
  if (!isOwner && !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

  await org.update(req.body);
  res.json({ message: 'Organisation updated' });
};

exports.getOrganisationDonations = async (req, res) => {
  const donations = await Donation.findAll({
    where: { OrganisationId: req.params.id },
    include: ['User']
  });
  res.json(donations);
};
