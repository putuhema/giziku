// @ts-check
const sequelize = require("sequelize");
const Member = require("../model/Member");
const Note = require("../model/Note");
const Nutrition = require("../model/Nutrition");
const { fuzzificationWeightAge } = require("../util/fuzzy");
const {
  selectedMonth,
  selectedOption,
  monthById,
  zScore,
} = require("../util/helper");

exports.getMain = async (req, res) => {
  try {
    const members = await Member.findAll({
      where: { role: { [sequelize.Op.not]: "admin" } },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render("admin/main", {
      members,
      activeMember,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddNewMember = async (req, res) => {
  try {
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render("admin/member-form", {
      activeMember,
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
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    const member = await Member.findOne({
      where: {
        id: id,
      },
    });

    res.render("admin/member-form", {
      activeMember,
      edit: edit,
      member: member,
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
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render("admin/antropometry", {
      activeMember,
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
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render("admin/antropometry", {
      activeMember,
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
  weight: {},
  height: {},
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

    const weight = { weight: [], wZScore: [] };
    const height = { height: [], hZScore: [] };
    const month = [];

    nutritions.forEach(async (nutrition) => {
      weight.weight.push(nutrition.getDataValue("weight"));
      height.height.push(nutrition.getDataValue("height"));
      month.push(nutrition.getDataValue("month").toString().slice(0, 3));

      const zWeight = await zScore(
        +nutrition.get("age"),
        nutrition.get("weight"),
        "BBU"
      );
      const zHeight = await zScore(
        +nutrition.get("age"),
        nutrition.get("height"),
        "TBU"
      );

      height.hZScore.push(zHeight);
      weight.wZScore.push(zWeight);

      const f = fuzzificationWeightAge(zWeight);
    });

    nutritionAPI = {
      weight,
      height,
      month,
    };
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });

    Note.findAll({ where: { memberId: id } })
      .then((notes) => {
        res.render("admin/individual-report", {
          activeMember,
          member: member,
          nutritions: nutritions,
          notes: notes,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.session.memberId;

    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render("admin/admin-profile", {
      activeMember,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * Send Nutrition data to frontend js
 */
exports.getWeightApi = (_req, res) => {
  try {
    res.status(200).json(nutritionAPI);
  } catch (err) {
    console.log(err);
  }
};

// member
exports.postNewMember = async (req, res, _next) => {
  const nik = req.body.nik;
  const mothername = req.body.mothername;
  const childname = req.body.childname;
  const address = req.body.address;
  const village = req.body.village;
  const subregency = req.body.subregency;
  const regency = req.body.regency;
  const province = req.body.province;
  const role = req.body.role;
  const value = {
    nik,
    password: nik,
    mothername,
    childname,
    address,
    village,
    subregency,
    regency,
    province,
    role: "kader",
    imgsrc: "/assets/img/ava-1.png",
  };

  try {
    await Member.create(value);
    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
  }
};

exports.postEditMember = async (req, res) => {
  const id = req.body.id;
  const nik = req.body.nik;
  const mothername = req.body.mothername;
  const childname = req.body.childname;
  const address = req.body.address;
  const village = req.body.village;
  const subregency = req.body.subregency;
  const regency = req.body.regency;
  const province = req.body.province;
  const role = req.body.role;
  const value = {
    nik,
    password: nik,
    mothername,
    childname,
    address,
    village,
    subregency,
    regency,
    province,
    role,
  };
  try {
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
    const notesInput = req.body.notesValue;
    const notes = notesInput.split(";").filter((note) => note.length != 0);

    const nutrition = await Nutrition.create({
      weight: weight,
      height: height,
      age: age,
      month: month,
      memberId: id,
    });

    notes.forEach(async (note) => {
      await Note.create({
        text: note,
        state: false,
        memberId: id,
        nutritionId: nutrition.getDataValue("id"),
      });
    });

    res.redirect(`/admin/add-data?id=${id}`);
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

    await Note.destroy({
      where: { nutritionId: nutrition.getDataValue("id") },
    });

    res.redirect(
      `/admin/nutrition-report?id=${nutrition?.getDataValue("memberId")}`
    );
  } catch (err) {
    console.log(err);
  }
};

exports.postUpdateSetting = async (req, res) => {
  try {
    const id = req.session.memberId;
    const nik = req.body.nik;
    const password = req.body.password;
    const mothername = req.body.mothername;
    const childname = req.body.childname;
    const address = req.body.address;
    const village = req.body.village;
    const subregency = req.body.subregency;
    const regency = req.body.regency;
    const province = req.body.province;
    const role = req.body.role;
    const imgsrc = req.body.imgsrc;
    const value = {
      nik,
      password,
      mothername,
      childname,
      address,
      village,
      subregency,
      regency,
      province,
      role,
      imgsrc,
    };

    await Member.update(value, { where: { id: id } });

    res.redirect("/admin/profile");
  } catch (err) {
    console.log(err);
  }
};
