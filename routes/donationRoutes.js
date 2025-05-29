const express = require('express');
const { donateToProject, handleDonationWebhook } = require('../controller/donationController');
const { authenticate } = require('../middleware/authJWT');
const router = express.Router();

router.post('/donate', authenticate, donateToProject);
router.post('/webhook', handleDonationWebhook);

module.exports = router;
