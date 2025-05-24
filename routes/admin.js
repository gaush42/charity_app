const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.get('/organisations', authenticate, isAdmin, adminController.getAllOrganisations);
router.put('/organisations/:id/approve', authenticate, isAdmin, adminController.approveOrganisation);

module.exports = router;
