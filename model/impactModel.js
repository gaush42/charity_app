const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Impact = sequelize.define('Impact',{
    reportTitle: { type: DataTypes.STRING, allowNull: false },
    reportData: { type: DataTypes.TEXT }
})

module.exports = Impact