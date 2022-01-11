const { DataTypes } = require('sequelize');

const sequelize = require('../../config/db');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nik: DataTypes.STRING,
  nutritionalStatus: DataTypes.STRING,
  stuntingStatus: DataTypes.STRING,
  password: DataTypes.STRING,
  mothername: DataTypes.STRING,
  gender: DataTypes.STRING,
  dateOfBirth: DataTypes.STRING,
  placeOfBirth: DataTypes.STRING,
  toddlername: DataTypes.STRING,
  address: DataTypes.STRING,
  role: DataTypes.STRING,
  imgSeed: DataTypes.STRING,
});

module.exports = User;
