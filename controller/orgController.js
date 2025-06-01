const { Organization, Donation, Project, User } = require('../model');

// Update Organization Profile (only for authenticated org)
exports.updateOrgProfile = async (req, res) => {
  try {
    const orgId = req.orgId; // should be set in authenticate middleware for orgs
    const isOrg = req.isOrg;
    if(!isOrg){
        return res.status(401).json({message: 'You are not an Organization'})
    }
    const {
      orgName, description, category, state, city,
      district, locality, pin, email
    } = req.body;

    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await organization.update({
      orgName,
      description,
      category,
      state,
      city,
      district,
      locality,
      pin,
      email
    });

    res.status(200).json({ message: "Profile updated", organization });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Get all donations received by the organization
exports.getOrgDonations = async (req, res) => {
  try {
    const orgId = req.orgId;
    const isOrg = req.isOrg;
    if(!isOrg){
        return res.status(401).json({message: 'You are not an Organization'})
    }

    const donations = await Donation.findAll({
      where: { orgId },
      include: [
        { model: User, attributes: ['id', 'fullname', 'email'] },
        { model: Project, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve donations", error: err.message });
  }
};

exports.getAllOrgs = async (req, res) => {
  try {
    const orgs = await Organization.findAll();
    res.status(200).json({
      message: 'List of all organizations',
      organizations: orgs
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to retrieve organizations',
      error: err.message
    });
  }
};
exports.getOrgs = async (req, res) => {
  try {
    const orgId = req.orgId; // should be set in authenticate middleware for orgs
    const isOrg = req.isOrg;
    //console.log(orgId)
    if(!isOrg){
        return res.status(401).json({message: 'You are not an Organization'})
    }
    const organization = await Organization.findByPk(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json({ message: "Profile", organization });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to retrieve organizations',
      error: err.message
    });
  }
};

