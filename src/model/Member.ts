import { DataTypes, ModelAttributes } from "sequelize";
import sequelize from "../util/database";

export type MemberType = ModelAttributes & {
  nik: string;
  password: string;
  namaibu: string;
  namabalita: string;
  umur: number;
  alamat: string;
};

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

export default Member;
