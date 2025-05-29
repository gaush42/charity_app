const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authJWT');
const { isAdmin }= require('../middleware/isAdmin');
const { getPendingOrganizations, approveOrganization, rejectOrganization } = require('../controller/adminController');


// All routes below require admin
router.use(authenticate, isAdmin);

// Get all pending organizations
router.get('/organization/pending', getPendingOrganizations);
//router.get('/organizations/all', getAllOrganizations);

// Approve organization
router.post('/organization/:id/approve', approveOrganization);

// Reject organization
router.delete('/organization/:id/reject', rejectOrganization);

module.exports = router;