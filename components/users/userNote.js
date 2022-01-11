const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Note = sequelize.define('note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  text: DataTypes.STRING,
  state: DataTypes.BOOLEAN,
});

module.exports = Note;
