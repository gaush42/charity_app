const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserDonations } = require('../controller/userController');
const { authenticate } = require('../middleware/authJWT');

router.use(authenticate); // must be logged in

router.put('/profile', updateUserProfile);       // Update profile
router.get('/donations', getUserDonations);      // View donation history

module.exports = router;
