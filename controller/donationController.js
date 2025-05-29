const { Cashfree } = require('cashfree-pg');
const { Project, Donation, User, Organization } = require('../model');
const sequelize = require('../config/db');
require("dotenv").config();

const cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

exports.donateToProject = async (req, res) => {
  const userId = req.userId;
  const email = req.email;
  const { projectId, amount } = req.body;

  if (!projectId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Project ID and valid amount required" });
  }

  const t = await sequelize.transaction();

  try {
    const project = await Project.findByPk(projectId, { include: Organization });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const orgId = project.orgId;
    const orderId = `donation_${Date.now()}`;

    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `user_${userId}`,
        customer_email: email,
        customer_phone: "9999999999"
      },
      order_meta: {
        return_url: `http://yourdomain.com/html/thankyou.html?order_id=${orderId}`,
        notify_url: `http://yourdomain.com/api/donation/webhook`,
        payment_methods: "cc,dc,upi"
      }
    };

    const response = await cashfree.PGCreateOrder(request);

    await Donation.create({
      transactionId: response.data.payment_session_id,
      paymentStatus: "PENDING",
      amount,
      userId,
      orgId,
      projectId
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Donation initiated",
      paymentSessionId: response.data.payment_session_id
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Donation initiation failed", error: err.message });
  }
};

exports.handleDonationWebhook = async (req, res) => {
  try {
    const { order_id, payment_status, payment_info } = req.body.data.payment;
    const paymentSessionId = payment_info.payment_session_id;

    const donation = await Donation.findOne({ where: { transactionId: paymentSessionId } });
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation record not found" });
    }

    // Idempotency check
    if (donation.paymentStatus === 'SUCCESS' || donation.paymentStatus === 'FAILED') {
      return res.status(200).json({ message: "Already processed" });
    }

    donation.paymentStatus = payment_status;
    await donation.save();

    if (payment_status === 'SUCCESS') {
      // Optional: update project’s amountRaised
      const project = await Project.findByPk(donation.projectId);
      if (project) {
        project.amountRaised += donation.amount;
        await project.save();
      }
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Donation Webhook Error:", err);
    res.status(500).json({ success: false });
  }
};
