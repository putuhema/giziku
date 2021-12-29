const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Member = sequelize.define("member", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nik: DataTypes.STRING,
  password: DataTypes.STRING,
  mothername: DataTypes.STRING,
  childname: DataTypes.STRING,
  address: DataTypes.STRING,
  role: DataTypes.STRING,
  imgsrc: DataTypes.STRING,
});

module.exports = Member;
