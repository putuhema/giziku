// @ts-nocheck
const sequelize = require('sequelize');
const Member = require('../model/Member');
const Note = require('../model/Note');
const Nutrition = require('../model/Nutrition');
const { selectedMonth, selectedOption, monthById, zScore } = require('../util/helper');

exports.getMain = async (req, res) => {
  try {
    const members = await Member.findAll({
      where: { role: { [sequelize.Op.not]: 'admin' } },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/index', {
      members,
      activeMember,
      title: 'Home',
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
      title: 'Tambah Kader',
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
      title: 'Edit Kader',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddMeasurement = async (req, res) => {
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
    res.render('admin/measurement-form', {
      activeMember,
      member,
      nutrition: {},
      edit: false,
      fn: () => {},
      title: 'Tambah Pengukuran',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEditMeasurement = async (req, res) => {
  try {
    const { id, edit } = req.query;

    const nutrition = await Nutrition.findOne({
      where: {
        id,
      },
    });

    const notes = await Note.findAll({ where: { nutritionId: id } });

    const member = await Member.findOne({
      where: {
        id: nutrition.getDataValue('memberId'),
      },
    });
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/measurement-form', {
      activeMember,
      edit,
      notes,
      nutrition,
      member,
      fn: selectedMonth,
      title: 'Edit Pengukuran',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getFuzzy = async (req, res) => {
  try {
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });
    res.render('admin/fuzzy', {
      activeMember,
      title: 'Fuzzy',
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

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.query;
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

    nutritions.forEach(async nutrition => {
      weight.weight.push(nutrition.get('weight'));
      height.height.push(nutrition.get('height'));
      const monthId = nutrition.get('date').split('-')[1];
      month.push(
        monthById(+monthId - 1)
          .toString()
          .slice(0, 3)
      );

      // const zWeight = await zScore(+nutrition.get('age'), nutrition.get('weight'), 'BBU');
      // const zHeight = await zScore(+nutrition.get('age'), nutrition.get('height'), 'TBU');

      // height.hZScore.push(zHeight);
      // weight.wZScore.push(zWeight);
    });

    nutritionAPI = {
      weight,
      height,
      month,
    };
    const activeMember = await Member.findOne({
      where: { id: req.session.memberId },
    });

    const notes = await Note.findAll({ where: { memberId: id } });

    res.render('admin/detail', {
      activeMember,
      member,
      nutritions,
      notes,
      title: 'Detail',
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
      title: 'Pengaturan',
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
  const { nik, mothername, toddlername, address, placeOfBirth, dateOfBirth } = req.body;
  const value = {
    nik,
    mothername,
    toddlername,
    address,
    status: undefined,
    imgSeed: toddlername,
    placeOfBirth,
    dateOfBirth,
    password: nik,
    role: 'kader',
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
exports.postMeasurement = async (req, res) => {
  try {
    const { id, weight, height, age, date, notes: noteResult } = req.body;
    const notes = noteResult.split(';').filter(note => note.length !== 0);

    const nutrition = await Nutrition.create({
      weight,
      height,
      age,
      date,
      memberId: id,
    });

    notes.forEach(async note => {
      await Note.create({
        text: note,
        state: false,
        memberId: id,
        nutritionId: nutrition.getDataValue('id'),
      });
    });

    res.redirect(`/admin/add-measurement?id=${id}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postEditMeasurement = async (req, res) => {
  try {
    const { nutritionId, id: memberId, weight, height, age, date } = req.body;
    const value = {
      weight,
      height,
      age,
      date,
    };

    await Nutrition.update(value, {
      where: {
        id: nutritionId,
      },
    });

    res.redirect(`/admin/edit-measurement?id=${memberId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteMeasurement = async (req, res) => {
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

    res.redirect(`/admin/detail?id=${nutrition.get('memberId')}`);
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
