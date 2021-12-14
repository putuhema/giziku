import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize(
  process.env.DB!,
  process.env.USER!,
  process.env.PASSWORD!,
  {
    dialect: "mysql",
    host: process.env.HOST,
    logging: false,
  }
);

export default sequelize;
