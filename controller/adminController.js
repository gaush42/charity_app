const { User, Organization, Project } = require('../model');

// Get all organizations pending approval
exports.getPendingOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll({ where: { isApproved: false } });
    res.json(orgs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve a charity
exports.approveOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    org.isApproved = true;
    await org.save();

    res.json({ message: 'Organization approved', org });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject (delete) a charity
exports.rejectOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    await org.destroy();
    res.json({ message: 'Organization rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
