import { Request, Response, NextFunction } from "express";
import { Identifier } from "sequelize/dist";

import Member, { MemberType } from "../model/Member";
import Nutrition, { NutritionAttributes } from "../model/Nutrition";
import {
  addressById,
  monthById,
  selectedMonth,
  selectedOption,
} from "../util/helper";

export const getReport = async (_req: Request, res: Response) => {
  try {
    const members = await Member.findAll();
    res.render("admin/report", {
      members: members,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAddNewMember = async (_req: Request, res: Response) => {
  try {
    res.render("admin/add-new-member", {
      edit: false,
      user: {},
      fn: () => {},
    });
  } catch (err) {
    console.log(err);
  }
};

export const getEditMember = async (req: Request, res: Response) => {
  const id = req.query.id;
  const edit = req.query.edit == "true" ? true : false;
  try {
    const member = await Member.findOne({
      where: {
        id: id,
      },
    });

    res.render("admin/add-new-member", {
      edit: edit,
      user: member,
      fn: selectedOption,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAddData = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const member = await Member.findOne({
      where: {
        id: id,
      },
    });
    res.render("admin/individual-data", {
      member: member,
      nutrition: {},
      edit: false,
      fn: () => {},
    });
  } catch (err) {
    console.log(err);
  }
};

export const getEditData = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const edit = req.query.edit == "true" ? true : false;

    const nutrition = await Nutrition.findOne({
      where: {
        id: id,
      },
    });

    const member = await Member.findOne({
      where: {
        id: nutrition?.getDataValue("memberId"),
      },
    });

    res.render("admin/individual-data", {
      edit: edit,
      nutrition: nutrition,
      member: member,
      fn: selectedMonth,
    });
  } catch (err) {
    console.log(err);
  }
};

type API = {
  weight: number[];
  height: number[];
  month: string[];
};

let nutritionAPI: API = {
  weight: [],
  height: [],
  month: [],
};

export const getIndividualReport = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const member = await Member.findOne({
      where: {
        id: id,
      },
    });

    const nutritions = await Nutrition.findAll({
      where: {
        memberId: id,
      },
    });

    const weight: number[] = [];
    const height: number[] = [];
    const month: string[] = [];

    nutritions.forEach((nutrition) => {
      weight.push(nutrition.getDataValue("weight"));
      height.push(nutrition.getDataValue("height"));
      month.push(nutrition.getDataValue("month"));
    });
    nutritionAPI = {
      weight,
      height,
      month,
    };
    res.render("admin/individual-report", {
      member: member,
      nutritions: nutritions,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getWeightApi = async (req: Request, res: Response) => {
  try {
    res.status(200).json(nutritionAPI);
  } catch (err) {
    console.log(err);
  }
};

// member
export const postNewMember = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const nik = req.body.nik;
  const namaibu = req.body.namaibu;
  const namabalita = req.body.namabalita;
  const umur = req.body.umur;
  const id = req.body.address;
  const address = addressById(id);
  const value: MemberType = {
    nik: nik,
    password: nik,
    namaibu: namaibu,
    namabalita: namabalita,
    umur: umur,
    alamat: address,
  };

  try {
    await Member.create(value);
    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
  }
};

export const postEditMember = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    const nik = req.body.nik;
    const password = req.body.password;
    const namaibu = req.body.namaibu;
    const namabalita = req.body.namabalita;
    const umur = req.body.umur;
    const addressId = req.body.address;
    const address = addressById(addressId);

    const value: MemberType = {
      nik: nik,
      password: password,
      namaibu: namaibu,
      namabalita: namabalita,
      umur: umur,
      alamat: address,
    };

    await Member.update(value, {
      where: {
        id: id,
      },
    });

    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    await Nutrition.destroy({
      where: {
        memberId: id,
      },
    });
    await Member.destroy({
      where: {
        id: id,
      },
    });

    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
  }
};

// nutrition data

export const postNutritionData = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const weight = req.body.berat;
    const height = req.body.tinggi;
    const age = req.body.umur;
    const monthId = req.body.bulan;
    const month = monthById(monthId);
    console.log({ weight, height });

    const value: NutritionAttributes = {
      weight: weight,
      height: height,
      age: age,
      month: month,
      memberId: id,
    };

    await Nutrition.create(value);

    res.redirect(`/admin/nutrition-report?id=${id}`);
  } catch (err) {
    console.log(err);
  }
};

export const postEditNutrition = async (req: Request, res: Response) => {
  try {
    const id = req.body.nutritionId;
    const memberId = req.body.id;
    const weight = req.body.berat;
    const height = req.body.tinggi;
    const age = req.body.umur;
    const monthId = req.body.bulan;
    const month = monthById(monthId);

    const value: NutritionAttributes = {
      weight: weight,
      height: height,
      age: age,
      month: month,
    };

    await Nutrition.update(value, {
      where: {
        id: id,
      },
    });

    res.redirect(`/admin/nutrition-report?id=${memberId}`);
  } catch (err) {
    console.log(err);
  }
};

export const postDeleteNutritionData = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const nutrition = await Nutrition.findOne({
      where: {
        id: id,
      },
    });

    await Nutrition.destroy({
      where: {
        id: id,
      },
    });

    res.redirect(
      `/admin/nutrition-report?id=${nutrition?.getDataValue("memberId")}`
    );
  } catch (err) {
    console.log(err);
  }
};
