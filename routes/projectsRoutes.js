const express = require('express');
const router = express.Router();
const {getAllProjects, getOrgProjects, createProject, updateProject, deleteProject} = require('../controller/projectController');
const { authenticate } = require('../middleware/authJWT');

// Public
router.get('/all', getAllProjects);

router.use(authenticate);
// Protected (org only)
router.get('/get',authenticate, getOrgProjects)
router.post('/create',authenticate, createProject);
router.put('/update/:id',authenticate, updateProject);
router.delete('/delete/:id',authenticate, deleteProject);

module.exports = router;