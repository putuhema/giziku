const { DataTypes } = require('sequelize');
const db = require('../../config/db');

module.exports = db.define('standard', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  age: DataTypes.INTEGER,
  value: DataTypes.FLOAT,
  sex: DataTypes.INTEGER,
});
