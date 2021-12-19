const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Nutrition = sequelize.define("nutrition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  weight: DataTypes.FLOAT,
  height: DataTypes.FLOAT,
  age: DataTypes.INTEGER,
  month: DataTypes.STRING,
});

module.exports = Nutrition;
