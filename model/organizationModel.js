const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Organisation = sequelize.define('Organization', {
    orgName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description:{
        type: DataTypes.TEXT,
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    state:{
        type: DataTypes.STRING,
        allowNull: false
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false
    },
    district:{
        type: DataTypes.STRING
    },
    locality:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate: {isEmail: true}
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
    isApproved:{
        type: DataTypes.BOOLEAN, defaultValue: false
    }
})

module.exports = Organisation