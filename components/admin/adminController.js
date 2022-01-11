// @ts-nocheck
const sequelize = require('sequelize');
const { User, Note, Measurement, Fuzzy: FuzzyModel } = require('../users');
const rules = require('../../data/rules.json');
const {
  selectedMonth,
  selectedOption,
  getMeasurementInfo,
  zScore,
  zScoreAge,
  stuntingStatus,
  nutritionalStatus,
  generateFuzzy,
  ssColor,
} = require('../../util/helper');

let MEASUREMENT_API = {};

exports.getIndex = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: { [sequelize.Op.not]: 'admin' } },
    });
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/index', {
      users,
      activeUser,
      title: 'Home',
      ssColor,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddUser = async (req, res) => {
  try {
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/user-form', {
      activeUser,
      edit: false,
      user: {},
      fn: () => {},
      title: 'Tambah Kader',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddUser = async (req, res) => {
  try {
    const { nik, mothername, toddlername, address, gender, placeOfBirth, dateOfBirth } = req.body;
    await User.create({
      nik,
      mothername,
      toddlername,
      address,
      gender,
      status: '-',
      imgSeed: toddlername,
      placeOfBirth,
      dateOfBirth,
      password: nik,
      role: 'kader',
    });
    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    await Measurement.destroy({
      where: {
        userId: id,
      },
    });
    await User.destroy({
      where: {
        id,
      },
    });

    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

exports.getEditUser = async (req, res) => {
  const { id, edit } = req.query;
  try {
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    const user = await User.findOne({
      where: {
        id,
      },
    });

    res.render('admin/views/user-form', {
      activeUser,
      user,
      edit,
      fn: selectedOption,
      title: 'Edit Kader',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditUser = async (req, res) => {
  try {
    const { id, nik, mothername, gender, dateOfBirth, placeOfBirth, date, childname, address } =
      req.body;
    await User.update(
      {
        nik,
        gender,
        mothername,
        childname,
        address,
        dateOfBirth,
        placeOfBirth,
        date,
      },
      {
        where: {
          id,
        },
      }
    );

    res.redirect('/admin/');
  } catch (err) {
    console.log(err);
  }
};

exports.getAddMeasurement = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findOne({
      where: {
        id,
      },
    });
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/measurement-form', {
      activeUser,
      user,
      measurement: {},
      edit: false,
      fn: () => {},
      title: 'Tambah Pengukuran',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddMeasurement = async (req, res) => {
  try {
    const { id, weight, height, date, notes: noteResult } = req.body;
    const notes = noteResult.split(';').filter(note => note.length !== 0);

    const user = await User.findOne({ where: { id } });
    const months = +user.dateOfBirth.split('-')[1];
    const measurementMonth = +date.split('-')[1];

    const age = measurementMonth - months;
    let gender = '';
    if (user.gender === 'Laki - Laki') {
      gender = 'L';
    } else if (user.gender === 'Perempuan') {
      gender = 'P';
    }

    const wZScore = zScore(age, +weight, 'BBU', gender);
    const hZScore = zScore(age, +height, 'PBU', gender);
    const whZScore = zScoreAge(+height, +weight, 'BBPB', gender, age);

    await Measurement.create({
      weight,
      height,
      age,
      date,
      wZScore,
      hZScore,
      whZScore,
      userId: id,
    });

    notes.forEach(async note => {
      await Note.create({
        text: note,
        state: false,
        userId: id,
        measurementId: measurement.getDataValue('id'),
      });
    });

    res.redirect(`/admin/add-measurement?id=${id}`);
  } catch (err) {
    console.log(err);
  }
};

exports.getEditMeasurement = async (req, res) => {
  try {
    const { id, edit } = req.query;

    const measurement = await Measurement.findOne({
      where: {
        userId: id,
      },
    });

    console.log(id, measurement);

    const notes = await Note.findAll({ where: { measurementId: id } });

    const user = await User.findOne({
      where: {
        id: measurement.get('userId'),
      },
    });
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/measurement-form', {
      activeUser,
      edit,
      notes,
      measurement,
      user,
      fn: selectedMonth,
      title: 'Edit Pengukuran',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditMeasurement = async (req, res) => {
  try {
    const { measurementId, id: userId, weight, height, date } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    const months = +user.dateOfBirth.split('-')[1];
    const measurementMonth = +date.split('-')[1];
    const age = measurementMonth - months;

    let gender = '';
    if (user.gender === 'Laki - Laki') {
      gender = 'L';
    } else if (user.gender === 'Perempuan') {
      gender = 'P';
    }

    const wZScore = zScore(age, +weight, 'BBU', gender);
    const hZScore = zScore(age, +height, 'PBU', gender);
    const whZScore = zScoreAge(+height, +weight, 'BBPB', gender, age);

    await Measurement.update(
      {
        weight,
        height,
        age,
        date,
        wZScore,
        hZScore,
        whZScore,
        userId,
      },
      {
        where: {
          id: measurementId,
        },
      }
    );

    res.redirect(`/admin/edit-measurement?id=${userId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteMeasurement = async (req, res) => {
  try {
    const { id } = req.body;
    const measurement = await Measurement.findOne({
      where: {
        id,
      },
    });

    await Measurement.destroy({
      where: {
        id,
      },
    });

    await Note.destroy({
      where: { measurementId: measurement.get('id') },
    });

    res.redirect(`/admin/detail?id=${measurement.get('userId')}`);
  } catch (err) {
    console.log(err);
  }
};

exports.getFuzzy = async (req, res) => {
  try {
    const { id } = req.query;
    const { userId } = req.session;
    const activeUser = await User.findOne({ where: { id: userId } });
    const measurements = await Measurement.findAll({ where: { userId: id } });
    const { height, nutrition, defuzzification } = generateFuzzy(measurements);
    const status = stuntingStatus(defuzzification);
    res.render('admin/views/fuzzy', {
      id,
      rules,
      activeUser,
      height: { ...height, fuzzy: JSON.stringify(height.fuzzy) },
      nutrition: { ...nutrition, fuzzy: JSON.stringify(nutrition.fuzzy) },
      defuzzification,
      status,
      title: 'Fuzzy',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({ where: { id } });
    const measurements = await Measurement.findAll({ where: { userId: id } });
    const notes = await Note.findAll({ where: { userId: id } });
    const activeUser = await User.findOne({ where: { id: req.session.userId } });
    const { stuntingStatus: ss } = user.get();
    const status = ssColor(ss);

    if (measurements.length > 0) {
      const fuzzydb = await FuzzyModel.findOne({ where: { userId: id } });
      const { height: fh, nutrition: fn, defuzzification } = generateFuzzy(measurements);
      const nutritionJSON = JSON.stringify(fn.fuzzy);
      const heightJSON = JSON.stringify(fh.fuzzy);

      if (!fuzzydb) {
        await FuzzyModel.create({
          defuzzification,
          fHeight: heightJSON,
          fNutrition: nutritionJSON,
          userId: id,
        });
      } else {
        await FuzzyModel.update(
          {
            defuzzification,
            fHeight: heightJSON,
            fNutrition: nutritionJSON,
          },
          { where: { userId: id } }
        );
      }
      await user.update({
        nutritionalStatus: nutritionalStatus(measurements[0].wZScore),
        stuntingStatus: stuntingStatus(defuzzification),
      });
    }

    let gender = '';
    if (user.gender === 'Laki - Laki') {
      gender = 'L';
    } else if (user.gender === 'Perempuan') {
      gender = 'P';
    }

    MEASUREMENT_API = await getMeasurementInfo(measurements, gender);
    res.render('admin/views/detail', {
      activeUser,
      user,
      measurements,
      notes,
      title: 'Detail',
      value: status.value,
      color: status.color,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const activeUser = await User.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/admin-profile', {
      activeUser,
      title: 'Pengaturan',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getWeightApi = (_req, res) => {
  try {
    res.status(200).json(MEASUREMENT_API);
  } catch (err) {
    console.log(err);
  }
};

exports.postUpdateSetting = async (req, res) => {
  try {
    const { userId } = req.session;
    const { nik, password, mothername, childname, address, imgsrc } = req.body;

    const value = {
      nik,
      password,
      mothername,
      childname,
      address,
      imgsrc,
    };

    await User.update(value, { where: { id: userId } });

    res.redirect('/admin/profile');
  } catch (err) {
    console.log(err);
  }
};
