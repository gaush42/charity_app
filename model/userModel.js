const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
    fullname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate: {isEmail: true}
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin:{
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }
})
module.exports = User