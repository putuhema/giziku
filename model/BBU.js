const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const BBU = sequelize.define("BBU", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  X: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  MIN3SD: DataTypes.FLOAT,
  MIN2SD: DataTypes.FLOAT,
  MIN1SD: DataTypes.FLOAT,
  MEDIAN: DataTypes.FLOAT,
  PLUS1SD: DataTypes.FLOAT,
  PLUS2SD: DataTypes.FLOAT,
  PLUS3SD: DataTypes.FLOAT,
});

module.exports = BBU;
