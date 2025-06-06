const { DataTypes } = require('sequelize');
const {sequelize} = require('../Db/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
     email: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            isEmail: true,
          },
         unique: true,
     },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
     role: {
        type: DataTypes.ENUM('client', 'admin'),
        //defaultValue: 'client',  
        allowNull: false,  
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    failedAttempts: { 
        type: DataTypes.INTEGER, 
        default: 0 },
    lockedUntil: { 
        type: DataTypes.DATE, 
        allowNull: true 
    }
}, {
    freezeTableName: true,
});


module.exports = User;
