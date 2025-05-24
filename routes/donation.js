const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/:orgId', authenticate, donationController.donateToOrganisation);
router.get('/receipt/:id', authenticate, donationController.getReceipt);

module.exports = router;
