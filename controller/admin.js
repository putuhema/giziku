// @ts-check
const Member = require("../model/Member");
const Nutrition = require("../model/Nutrition");
const {
  selectedMonth,
  selectedOption,
  monthById,
  addressById,
} = require("../util/helper");

exports.getReport = async (_req, res) => {
  try {
    const members = await Member.findAll();
    res.render("admin/report", {
      members: members,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddNewMember = async (_req, res) => {
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

exports.getEditMember = async (req, res) => {
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

exports.getAddData = async (req, res) => {
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

exports.getEditData = async (req, res) => {
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

let nutritionAPI = {
  weight: [],
  height: [],
  month: [],
};

exports.getIndividualReport = async (req, res) => {
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

    const weight = [];
    const height = [];
    const month = [];

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

/**
 *
 * Send Nutrition data to frontend js
 */
exports.getWeightApi = async (_req, res) => {
  try {
    res.status(200).json(nutritionAPI);
  } catch (err) {
    console.log(err);
  }
};

// member
exports.postNewMember = async (req, res, _next) => {
  const nik = req.body.nik;
  const namaibu = req.body.namaibu;
  const namabalita = req.body.namabalita;
  const umur = req.body.umur;
  const id = req.body.address;
  const address = addressById(id);
  const value = {
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

exports.postEditMember = async (req, res) => {
  try {
    const id = req.body.id;

    const nik = req.body.nik;
    const password = req.body.password;
    const namaibu = req.body.namaibu;
    const namabalita = req.body.namabalita;
    const umur = req.body.umur;
    const addressId = req.body.address;
    const address = addressById(addressId);

    const value = {
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

exports.deleteMember = async (req, res) => {
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

exports.postNutritionData = async (req, res) => {
  try {
    const id = req.body.id;
    const weight = req.body.berat;
    const height = req.body.tinggi;
    const age = req.body.umur;
    const monthId = req.body.bulan;
    const month = monthById(monthId);
    console.log({ weight, height });

    const value = {
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

exports.postEditNutrition = async (req, res) => {
  try {
    const id = req.body.nutritionId;
    const memberId = req.body.id;
    const weight = req.body.berat;
    const height = req.body.tinggi;
    const age = req.body.umur;
    const monthId = req.body.bulan;
    const month = monthById(monthId);

    const value = {
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

exports.postDeleteNutritionData = async (req, res) => {
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
