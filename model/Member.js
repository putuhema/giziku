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
  namaibu: DataTypes.STRING,
  namabalita: DataTypes.STRING,
  alamat: DataTypes.STRING,
});

module.exports = Member;
