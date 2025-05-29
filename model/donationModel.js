const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Donation = sequelize.define('Donation',{
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
    transactionId: { type: DataTypes.STRING },
})

module.exports = Donation