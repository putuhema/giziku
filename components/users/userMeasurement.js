const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Measurement = sequelize.define('measurement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  weight: DataTypes.FLOAT,
  height: DataTypes.FLOAT,
  age: DataTypes.INTEGER,
  wZScore: DataTypes.FLOAT,
  hZScore: DataTypes.FLOAT,
  whZScore: DataTypes.FLOAT,
  date: DataTypes.STRING,
});

module.exports = Measurement;
