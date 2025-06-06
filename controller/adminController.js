const { User, Organization, Project, Donation } = require('../model');
const sequelize = require('../config/db');
const Sib = require('sib-api-v3-sdk');
require("dotenv").config();


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
    sendStatusEmails(
      org.email,
      org.orgName,
      'Approved'
    )

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
    sendStatusEmails(
      org.email,
      org.orgName,
      'Rejected'
    )
    await org.destroy();
    res.json({ message: 'Organization rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Get all organizations (approved & unapproved)
exports.getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll();
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching organizations', error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ include: Organization });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      include: [User, Organization, Project]
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations', error: err.message });
  }
};

// Get donation summary
exports.getDonationSummary = async (req, res) => {
  try {
    const totalDonations = await Donation.sum('amount', {
      where: { paymentStatus: 'SUCCESS' }
    });

    const donationsByProject = await Donation.findAll({
      where: { paymentStatus: 'SUCCESS' },
      attributes: ['projectId', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      group: ['projectId'],
      include: [Project]
    });

    const donationsByOrg = await Donation.findAll({
      where: { paymentStatus: 'SUCCESS' },
      attributes: ['orgId', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      group: ['orgId'],
      include: [Organization]
    });

    const donationsByUser = await Donation.findAll({
      where: { paymentStatus: 'SUCCESS' },
      attributes: ['userId', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      group: ['userId'],
      include: [User]
    });

    res.json({
      totalDonations,
      donationsByProject,
      donationsByOrg,
      donationsByUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating donation summary', error: err.message });
  }
};

// Admin dashboard summary
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrganizations = await Organization.count();
    const totalProjects = await Project.count();
    const totalDonations = await Donation.count({ where: { paymentStatus: 'SUCCESS' } });

    const totalRaised = await Donation.sum('amount', {
      where: { paymentStatus: 'SUCCESS' }
    });

    res.json({
      totalUsers,
      totalOrganizations,
      totalProjects,
      totalDonations,
      totalRaised
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};
const sendStatusEmails = async (orgEmail, orgName, status) => {
  const client = Sib.ApiClient.instance;
  client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;

  const transEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: 'aahil5074@gmail.com', // Must be a verified sender in Brevo
    name: 'Charity Donation Platform'
  };

  // Email to Organization
  await transEmailApi.sendTransacEmail({
    sender,
    to: [{ email: orgEmail }],
    subject: 'Approval Status',
    htmlContent: `
      <p>Hello <b>${orgName}</b>,</p>
      <p>You Organization has been ${status}. Please email us for more detail</p>
    `
  });
};
