const BBPB = require("../model/BBPB");
const BBTB = require("../model/BBTB");
const BBU = require("../model/BBU");
const Member = require("../model/Member");
const TBU = require("../model/TBU");
const { fuzzificationWeightAge } = require("../util/fuzzy");
const { zScore } = require("../util/helper");

/** TB/U handlers */
exports.getBBU = async (req, res) => {
  await getTable(req, res, BBU, "bbu", "BB/U");
};

exports.getAddBBU = async (req, res) => {
  await getAddForm(req, res, "bbu", "BB/U", "Umur (bulan)");
};

exports.postAddBBU = async (req, res) => {
  await postDatatoDB(req, res, BBU, "bbu");
};

exports.postDeleteBBU = async (req, res) => {
  await postDeleteData(req, res, BBU, "bbu");
};

/** TB/U handlers */

exports.getTBU = async (req, res) => {
  await getTable(req, res, TBU, "tbu", "TB/U");
};

exports.getAddTBU = async (req, res) => {
  await getAddForm(req, res, "tbu", "TB/U", "Umur (bulan)");
};

exports.postAddTBU = async (req, res) => {
  await postDatatoDB(req, res, TBU, "tbu");
};

exports.postDeleteTBU = async (req, res) => {
  await postDeleteData(req, res, TBU, "tbu");
};

/** BB/PB handlers */
exports.getBBPB = async (req, res) => {
  await getTable(req, res, BBPB, "bbpb", "BB/PB");
};

exports.getAddBBPB = async (req, res) => {
  await getAddForm(req, res, "bbpb", "BB/PB", "Panjang Badan (cm)");
};

exports.postAddBBPB = async (req, res) => {
  await postDatatoDB(req, res, BBPB, "bbpb");
};

exports.postDeleteBBPB = async (req, res) => {
  await postDeleteData(req, res, BBPB, "bbtb");
};

/** BB/TB handlers */
exports.getBBTB = async (req, res) => {
  await getTable(req, res, BBTB, "bbtb", "BB/TB");
};

exports.getAddBBTB = async (req, res) => {
  await getAddForm(req, res, "bbtb", "BB/TB", "Tinggi Badan (cm)");
};

exports.postAddBBTB = async (req, res) => {
  await postDatatoDB(req, res, BBTB, "bbtb");
};

exports.postDeleteBBTB = async (req, res) => {
  await postDeleteData(req, res, BBTB, "bbtb");
};

/**
 * get all the data from DB and render it to html
 */
async function getTable(req, res, index, link, type) {
  const activeMember = await Member.findOne({
    where: { id: req.session.memberId },
  });
  const bbus = await index.findAll();

  res.render("admin/antro/standard-antropometry", {
    activeMember,
    indexes: bbus,
    type: type,
    link: link,
    edit: false,
  });
}

async function getAddForm(req, res, link, type, label) {
  const activeMember = await Member.findOne({
    where: { id: req.session.memberId },
  });
  res.render("admin/antro/antropometry-form", {
    activeMember,
    type: type,
    link: link,
    edit: false,
    label: label,
  });
}

async function postDatatoDB(req, res, model, link) {
  try {
    const X = req.body.age;
    const gender = req.body.gender;
    const min3 = req.body.min3sd;
    const min2 = req.body.min2sd;
    const min1 = req.body.min1sd;
    const median = req.body.median;
    const plus1 = req.body.plus1sd;
    const plus2 = req.body.plus2sd;
    const plus3 = req.body.plus3sd;

    await model.create({
      X,
      gender,
      MIN3SD: min3,
      MIN2SD: min2,
      MIN1SD: min1,
      MEDIAN: median,
      PLUS1SD: plus1,
      PLUS2SD: plus2,
      PLUS3SD: plus3,
    });
    res.redirect("/admin/add-" + link);
  } catch (err) {
    console.log(err);
  }
}

async function postDeleteData(req, res, model, link) {
  try {
    const id = req.body.id;
    await model.destroy({ where: { id: id } });
    res.redirect("/admin/" + link);
  } catch (err) {
    console.log(err);
  }
}
