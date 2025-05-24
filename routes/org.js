const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organisation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, orgController.createOrganisation);
router.get('/', orgController.getOrganisations);
router.get('/:id', orgController.getOrganisation);
router.put('/:id', authenticate, orgController.updateOrganisation);
router.get('/:id/donations', authenticate, orgController.getOrganisationDonations);

module.exports = router;
