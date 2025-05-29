const { Project, Organization } = require('../model');

// Get all projects (optional filter by org)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};
exports.getOrgProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { orgId: req.orgId },
      order: [['createdAt', 'DESC']],
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your projects', error: err.message });
  }
};

// Create new project (org must be authenticated)
exports.createProject = async (req, res) => {
  try {
    const { title, description, goal, deadline } = req.body;

    // Get the orgId from the authenticated org user
    const orgId = req.orgId;
    const organization = await Organization.findByPk(orgId);

    // Check if organization exists and is approved
    if (!organization || !organization.isApproved) {
      return res.status(401).json({
        message: 'Organization not approved or not found'
      });
    }

    const project = await Project.create({
      title,
      description,
      goal,
      deadline,
      orgId
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

// Update a project (only org that owns it can update)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.orgId !== req.orgId) return res.status(403).json({ message: 'Unauthorized' });

    const { title, description, goal, deadline, isActive } = req.body;
    await project.update({ title, description, goal, deadline, isActive });

    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete project (only org that owns it can delete)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.orgId !== req.orgId) return res.status(403).json({ message: 'Unauthorized' });

    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
