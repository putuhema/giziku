const { DataTypes } = require('sequelize');

const sequelize = require('../../config/db');

const Fuzzy = sequelize.define('fuzzy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  fHeight: DataTypes.STRING,
  fNutrition: DataTypes.STRING,
  defuzzification: DataTypes.FLOAT,
});

module.exports = Fuzzy;
