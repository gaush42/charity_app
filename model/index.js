const User = require('./userModel')
const Organization = require('./organizationModel')
const Project = require('./projectModel')
const Donation = require('./donationModel')
const Impact = require('./impactModel')

// --- Associations ---

// User - Donation
User.hasMany(Donation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Donation.belongsTo(User, { foreignKey: 'userId' });

// Organization - Donation
Organization.hasMany(Donation, { foreignKey: 'orgId', onDelete: 'CASCADE' });
Donation.belongsTo(Organization, { foreignKey: 'orgId' });

// Organization - Project
Organization.hasMany(Project, { foreignKey: 'orgId', onDelete: 'CASCADE' });
Project.belongsTo(Organization, { foreignKey: 'orgId' });

// Project - Donation (optional project-level donations)
Project.hasMany(Donation, { foreignKey: 'projectId' });
Donation.belongsTo(Project, { foreignKey: 'projectId' });

// Organization - Impact
Organization.hasMany(Impact, { foreignKey: 'orgId', onDelete: 'CASCADE' });
Impact.belongsTo(Organization, { foreignKey: 'orgId' });

module.exports = {
    User,
    Organization,
    Project,
    Donation,
    Impact
}