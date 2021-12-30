// @ts-check
const sequelize = require('sequelize');
const Member = require('../model/Member');
const Note = require('../model/Note');
const Nutrition = require('../model/Nutrition');
const {
  selectedMonth,
  selectedOption,
  monthById,
  zScore,
} = require('../util/helper');

exports.getMain = async (req, res) => {
  try {
    const members = await Member.findAll({
      where: { role: { [sequelize.Op.not]: 'admin' } },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/main', {
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
    res.render('admin/member-form', {
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
  const { id, edit } = req.query;
  try {
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    const member = await Member.findOne({
      where: {
        id,
      },
    });

    res.render('admin/member-form', {
      activeMember,
      member,
      fn: selectedOption,
      edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddData = async (req, res) => {
  try {
    const { id } = req.query;
    const member = await Member.findOne({
      where: {
        id,
      },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/antropometry', {
      activeMember,
      member,
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
    const { id, edit } = req.query.id;

    const nutrition = await Nutrition.findOne({
      where: {
        id,
      },
    });

    const member = await Member.findOne({
      where: {
        id: nutrition.getDataValue('memberId'),
      },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/antropometry', {
      activeMember,
      edit,
      nutrition,
      member,
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
    const { id } = req.query.id;
    const member = await Member.findOne({
      where: {
        id,
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
      weight.weight.push(nutrition.getDataValue('weight'));
      height.height.push(nutrition.getDataValue('height'));
      month.push(nutrition.getDataValue('month').toString().slice(0, 3));

      const zWeight = await zScore(
        +nutrition.get('age'),
        nutrition.get('weight'),
        'BBU'
      );
      const zHeight = await zScore(
        +nutrition.get('age'),
        nutrition.get('height'),
        'TBU'
      );

      height.hZScore.push(zHeight);
      weight.wZScore.push(zWeight);
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
        res.render('admin/individual-report', {
          activeMember,
          member,
          nutritions,
          notes,
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
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/admin-profile', {
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
exports.postNewMember = async (req, res) => {
  const { nik, mothername, childname, address } = req.body;
  const value = {
    nik,
    mothername,
    childname,
    address,
    password: nik,
    role: 'kader',
    imgsrc: '/assets/img/ava-1.png',
  };

  try {
    await Member.create(value);
    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

exports.postEditMember = async (req, res) => {
  const { id, nik, mothername, childname, address } = req.body;

  const value = {
    nik,
    password: nik,
    mothername,
    childname,
    address,
  };
  try {
    await Member.update(value, {
      where: {
        id,
      },
    });

    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteMember = async (req, res) => {
  const { id } = req.body;
  try {
    await Nutrition.destroy({
      where: {
        memberId: id,
      },
    });
    await Member.destroy({
      where: {
        id,
      },
    });

    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

// nutrition data
exports.postNutritionData = async (req, res) => {
  try {
    const {
      id,
      weight,
      height,
      age,
      month: monthId,
      notesValue: notesInput,
    } = req.body;
    const currentMonth = monthById(monthId);
    const notes = notesInput.split(';').filter((note) => note.length !== 0);

    const nutrition = await Nutrition.create({
      weight,
      height,
      age,
      month: currentMonth,
      memberId: id,
    });

    notes.forEach(async (note) => {
      await Note.create({
        text: note,
        state: false,
        memberId: id,
        nutritionId: nutrition.getDataValue('id'),
      });
    });

    res.redirect(`/admin/add-data?id=${id}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postEditNutrition = async (req, res) => {
  try {
    const {
      nutritionId,
      id: memberId,
      weight,
      height,
      age,
      month: monthId,
    } = req.body;
    const currentMonth = monthById(monthId);
    const value = {
      weight,
      height,
      age,
      month: currentMonth,
    };

    await Nutrition.update(value, {
      where: {
        id: nutritionId,
      },
    });

    res.redirect(`/admin/nutrition-report?id=${memberId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteNutritionData = async (req, res) => {
  try {
    const { id } = req.body;
    const nutrition = await Nutrition.findOne({
      where: {
        id,
      },
    });

    await Nutrition.destroy({
      where: {
        id,
      },
    });

    await Note.destroy({
      where: { nutritionId: nutrition.getDataValue('id') },
    });

    res.redirect(
      `/admin/nutrition-report?id=${nutrition.getDataValue('memberId')}`
    );
  } catch (err) {
    console.log(err);
  }
};

exports.postUpdateSetting = async (req, res) => {
  try {
    const { memberId } = req.session;
    const { nik, password, mothername, childname, address, imgsrc } = req.body;

    const value = {
      nik,
      password,
      mothername,
      childname,
      address,
      imgsrc,
    };

    await Member.update(value, { where: { id: memberId } });

    res.redirect('/admin/profile');
  } catch (err) {
    console.log(err);
  }
};
