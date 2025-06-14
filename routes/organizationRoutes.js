const express = require('express')
const router = express.Router()
const { getAllOrgs, updateOrgProfile, getOrgDonations, getOrgs } = require('../controller/orgController')
const { authenticate } = require('../middleware/authJWT')

router.get('/all', getAllOrgs)

router.use(authenticate); // must be logged in
router.put('/profile', updateOrgProfile);        // Update org profile
router.get('/donations', getOrgDonations);       // View donation history
router.get('/profile', getOrgs); 

module.exports = router