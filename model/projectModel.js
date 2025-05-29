const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Projects = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    amountRaised: { type: DataTypes.FLOAT, defaultValue: 0 },
    goal: { type: DataTypes.FLOAT },
    deadline: { type: DataTypes.DATE },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }   
})

module.exports = Projects