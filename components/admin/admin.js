const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const Admin = db.define('admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: DataTypes.STRING,
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  imgSeed: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = Admin;
