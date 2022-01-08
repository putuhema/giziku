const BBPB = require('../model/BBPB');
const BBTB = require('../model/BBTB');
const BBU = require('../model/BBU');
const Member = require('../model/Member');
const TBU = require('../model/TBU');

/**
 * get all the data from DB and render it to html
 */
async function getTable(req, res, index, link, type) {
  const activeMember = await Member.findOne({
    where: { id: req.session.memberId },
  });
  const indexes = await index.findAll();

  res.render('admin/antro/table', {
    activeMember,
    indexes,
    type,
    link,
    edit: false,
    title: 'BB/U',
  });
}

async function getAddForm(req, res, link, type, label) {
  const activeMember = await Member.findOne({
    where: { id: req.session.memberId },
  });
  res.render('admin/antro/antropometry-form', {
    activeMember,
    type,
    link,
    label,
    edit: false,
  });
}

async function postDatatoDB(req, res, model, link) {
  try {
    const { age: X, gender, min3sd, min2sd, min1sd, median, plus1sd, plus2sd, plus3sd } = req.body;

    await model.create({
      X,
      gender,
      MIN3SD: min3sd,
      MIN2SD: min2sd,
      MIN1SD: min1sd,
      MEDIAN: median,
      PLUS1SD: plus1sd,
      PLUS2SD: plus2sd,
      PLUS3SD: plus3sd,
    });
    res.redirect(`/admin/add-${link}`);
  } catch (err) {
    console.log(err);
  }
}

async function postDeleteData(req, res, model, link) {
  try {
    const { id } = req.body;
    await model.destroy({ where: { id } });
    res.redirect(`/admin/${link}`);
  } catch (err) {
    console.log(err);
  }
}

/** TB/U handlers */
exports.getBBU = async (req, res) => {
  await getTable(req, res, BBU, 'bbu', 'BB/U');
};

exports.getAddBBU = async (req, res) => {
  await getAddForm(req, res, 'bbu', 'BB/U', 'Umur (bulan)');
};

exports.postAddBBU = async (req, res) => {
  await postDatatoDB(req, res, BBU, 'bbu');
};

exports.postDeleteBBU = async (req, res) => {
  await postDeleteData(req, res, BBU, 'bbu');
};

/** TB/U handlers */

exports.getTBU = async (req, res) => {
  await getTable(req, res, TBU, 'tbu', 'TB/U');
};

exports.getAddTBU = async (req, res) => {
  await getAddForm(req, res, 'tbu', 'TB/U', 'Umur (bulan)');
};

exports.postAddTBU = async (req, res) => {
  await postDatatoDB(req, res, TBU, 'tbu');
};

exports.postDeleteTBU = async (req, res) => {
  await postDeleteData(req, res, TBU, 'tbu');
};

/** BB/PB handlers */
exports.getBBPB = async (req, res) => {
  await getTable(req, res, BBPB, 'bbpb', 'BB/PB');
};

exports.getAddBBPB = async (req, res) => {
  await getAddForm(req, res, 'bbpb', 'BB/PB', 'Panjang Badan (cm)');
};

exports.postAddBBPB = async (req, res) => {
  await postDatatoDB(req, res, BBPB, 'bbpb');
};

exports.postDeleteBBPB = async (req, res) => {
  await postDeleteData(req, res, BBPB, 'bbtb');
};

/** BB/TB handlers */
exports.getBBTB = async (req, res) => {
  await getTable(req, res, BBTB, 'bbtb', 'BB/TB');
};

exports.getAddBBTB = async (req, res) => {
  await getAddForm(req, res, 'bbtb', 'BB/TB', 'Tinggi Badan (cm)');
};

exports.postAddBBTB = async (req, res) => {
  await postDatatoDB(req, res, BBTB, 'bbtb');
};

exports.postDeleteBBTB = async (req, res) => {
  await postDeleteData(req, res, BBTB, 'bbtb');
};
