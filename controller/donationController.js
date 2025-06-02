const { Cashfree } = require('cashfree-pg');
const { Project, Donation, User, Organization } = require('../model');
const sequelize = require('../config/db');
//const sendEmail = require('../utils/email')
const Sib = require('sib-api-v3-sdk');
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
        return_url: `https://6ee8-103-135-228-225.ngrok-free.app/html/user-profile.html?order_id=${orderId}`,
        notify_url: `https://6ee8-103-135-228-225.ngrok-free.app/api/donation/webhook`,
        payment_methods: "cc,dc,upi"
      }
    };

    const response = await cashfree.PGCreateOrder(request);

    await Donation.create({
      transactionId: orderId,
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
  const t = await sequelize.transaction();

  try {
    const orderId = req.body.data.order.order_id;
    console.log(req.body.data.order.order_id)
    const paymentStatus = req.body.data.payment.payment_status;
    console.log(`Order ID: ${orderId}, Payment Status: ${paymentStatus}`);

    const donation = await Donation.findOne({
      where: { transactionId: orderId }
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation record not found" });
    }

    // Idempotency check
    if (donation.paymentStatus === 'SUCCESS' || donation.paymentStatus === 'FAILED') {
      return res.status(200).json({ message: "Already processed" });
    }

    if (paymentStatus === 'SUCCESS') {
      donation.paymentStatus = 'SUCCESS';
      await donation.save({ transaction: t });
      const [project, user, org] = await Promise.all([
        Project.findByPk(donation.projectId, { include: Organization, transaction: t }),
        User.findByPk(donation.userId, { transaction: t }),
        Organization.findByPk(donation.orgId, { transaction: t })
      ]);

      if (project) {
        project.amountRaised += donation.amount;
        await project.save({ transaction: t });
      }

      await t.commit();

      // Send emails (outside transaction for safety)
      try {
        await sendDonationEmails(
          org.email,
          org.orgName,
          project.title,
          donation.amount,
          user.email,
          donation.transactionId
        );
      } catch (emailErr) {
        console.error("Email send error:", emailErr.response?.body || emailErr.message);
        // Do not rollback donation due to email failure
      }
    } else {
      await t.commit(); // Even if failed, commit the status update
    }

    res.status(200).json({ success: true });

  } catch (err) {
    await t.rollback();
    console.error("Donation Webhook Error:", err);
    res.status(500).json({ success: false });
  }
};

/*exports.donateToProject = async (req, res) => {
  const userId = req.userId;
  const { projectId, amount } = req.body;

  if (!projectId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Project ID and valid amount required" });
  }

  const t = await sequelize.transaction();

  try {
    const [project, user] = await Promise.all([
      Project.findByPk(projectId, { include: Organization }),
      User.findByPk(userId)
    ]);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    const orgId = project.orgId;
    const fakeTransactionId = `fake_txn_${Date.now()}`;

    const donation = await Donation.create({
      transactionId: fakeTransactionId,
      paymentStatus: "SUCCESS",
      amount,
      userId,
      orgId,
      projectId
    }, { transaction: t });

    project.amountRaised += amount;
    await project.save({ transaction: t });

    await t.commit();
    // Send email to org
    console.log(
      project.Organization?.email || "No Org Email",
      project.title,
      fakeTransactionId,
      user.email
    );
    try {
      await sendDonationEmails(
        project.Organization.email,
        project.Organization.orgName,
        project.title,
        amount,
        user.email,
        fakeTransactionId
      );
    } catch (emailErr) {
      console.error('Email send error:', emailErr.response?.body || emailErr.message);
    }

    return res.status(201).json({
      message: "Fake donation successful",
      donationId: donation.id,
      fakeTransactionId
    });

  } catch (err) {
    await t.rollback();
    console.error("Fake Donation Error:", err);
    return res.status(500).json({ message: "Donation failed", error: err.message });
  }
};*/
const sendDonationEmails = async (orgEmail, orgName, projectTitle, amount, userEmail, transactionId) => {
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
    subject: `New Donation to ${projectTitle}`,
    htmlContent: `
      <p>Hello <b>${orgName}</b>,</p>
      <p>You have received a new donation:</p>
      <ul>
        <li>Amount: ₹${amount}</li>
        <li>Project: ${projectTitle}</li>
        <li>Donor Email: ${userEmail}</li>
        <li>Transaction ID: ${transactionId}</li>
      </ul>
      <p>Check your dashboard for more details.</p>
    `
  });

  // Email to Donor
  await transEmailApi.sendTransacEmail({
    sender,
    to: [{ email: userEmail }],
    subject: `Thank you for donating to ${projectTitle}`,
    htmlContent: `
      <p>Hello,</p>
      <p>Thank you for your ₹${amount} donation to <b>${projectTitle}</b> by <b>${orgName}</b>.</p>
      <p>Transaction ID: <b>${transactionId}</b></p>
      <p>We appreciate your support!</p>
    `
  });
};

