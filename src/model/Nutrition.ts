import { DataTypes, ModelAttributes } from "sequelize";

import sequelize from "../util/database";

export type NutritionAttributes = ModelAttributes & {
  weight: number;
  height: number;
  age: number;
  month: string;
};

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

export default Nutrition;
