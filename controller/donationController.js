const { Donation, Organisation } = require('../models');
// Placeholder for actual integration
const { processPayment } = require('../services/cashfree.service');

exports.donateToOrganisation = async (req, res) => {
  const { amount } = req.body;
  const { orgId } = req.params;

  const organisation = await Organisation.findByPk(orgId);
  if (!organisation || !organisation.isApproved) return res.status(404).json({ message: 'Organisation not found' });

  const donation = await Donation.create({
    amount,
    status: 'PENDING',
    UserId: req.user.userId,
    OrganisationId: orgId
  });

  // Integrate with Cashfree or simulate payment
  const paymentResult = await processPayment(donation.id, amount);
  donation.status = paymentResult.success ? 'SUCCESSFUL' : 'FAILED';
  donation.receiptUrl = paymentResult.receiptUrl;
  await donation.save();

  res.json({ message: 'Donation processed', donation });
};

exports.getReceipt = async (req, res) => {
  const donation = await Donation.findByPk(req.params.id);
  if (!donation || donation.UserId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

  // You could send a file or just the URL
  res.json({ receiptUrl: donation.receiptUrl });
};
