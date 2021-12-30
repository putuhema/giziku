const { Sequelize } = require('sequelize');
const { config } = require('dotenv');

config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.HOST,
    logging: false,
  }
);

module.exports = sequelize;
