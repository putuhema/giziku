// @ts-nocheck
const moment = require('moment');
const R = require('r-integration');
const { validationResult } = require('express-validator');
const { hash } = require('bcrypt');
const { User, Note, Measurement, Fuzzy: FuzzyModel } = require('../users');
const Admin = require('./admin');
const Standard = require('./standar');
const { rules, antropometri } = require('../../data');
const {
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
    const users = await User.findAll();
    const activeUser = await Admin.findOne({
      where: { id: req.session.userId },
    });
    moment.locale('id');
    res.render('admin/views/index', {
      users,
      activeUser,
      moment,
      title: 'Home',
      ssColor,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddUser = async (req, res) => {
  try {
    const activeUser = await Admin.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/user-form', {
      activeUser,
      edit: false,
      error: undefined,
      oldValue: {},
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
    const { nik, mothername, toddlername, address, gender, dateOfBirth } = req.body;
    const hashPassword = await hash(nik, 10);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      console.log(error);
      const activeUser = await Admin.findOne({
        where: { id: req.session.userId },
      });
      return res.render('admin/views/user-form', {
        activeUser,
        edit: false,
        error,
        user: {},
        oldValue: {
          nik,
          mothername,
          toddlername,
          address,
          gender,
          dateOfBirth,
        },
        fn: () => {},
        title: 'Tambah Kader',
      });
    }

    await User.create({
      nik,
      mothername,
      toddlername,
      address,
      gender,
      status: '-',
      imgSeed: toddlername,
      dateOfBirth,
      password: hashPassword,
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
    await Note.destroy({
      where: {
        userId: id,
      },
    });
    await FuzzyModel.destroy({
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
    const activeUser = await Admin.findOne({
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

exports.getAdminForm = async (req, res) => {
  try {
    const { userId } = req.session;
    const activeUser = await Admin.findOne({ where: { id: userId } });
    res.render('admin/views/admin-form', {
      activeUser,
      oldValue: {},
      error: undefined,
      edit: false,
      title: 'Tambah Admin',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddAdmin = async (req, res) => {
  try {
    const { username, name, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const { userId } = req.session;
      const activeUser = await Admin.findOne({ where: { id: userId } });
      return res.render('admin/views/admin-form', {
        activeUser,
        error,
        oldValue: { username, name, password },
        edit: false,
        title: 'Tambah Admin',
      });
    }
    const hashPassword = await hash(password, 10);
    await Admin.create({
      username,
      name,
      password: hashPassword,
      imgSeed: username,
      role: 'admin',
    });

    res.redirect('/admin/add-admin');
  } catch (err) {
    console.log(err);
  }
};

exports.getEditAdmin = async (req, res) => {
  try {
    const { userId } = req.session;
    const activeUser = await Admin.findOne({ where: { id: userId } });
    res.render('admin/views/admin-form', {
      activeUser,
      edit: true,
      title: 'Edit Profile',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditAdmin = async (req, res) => {
  try {
    const { username, admin, oldPassword, password } = req.body;
    let hashPassword = '';
    if (password) {
      hashPassword = await hash(password, 10);
    } else {
      hashPassword = oldPassword;
    }

    await Admin.update(
      {
        username,
        admin,
        password: hashPassword,
      },
      {
        where: { id: req.session.userId },
      }
    );

    res.redirect('/admin/edit-admin');
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
    const activeUser = await Admin.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/measurement-form', {
      activeUser,
      user,
      oldValue: {},
      error: undefined,
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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const user = await User.findOne({
        where: {
          id,
        },
      });
      const activeUser = await Admin.findOne({
        where: { id: req.session.userId },
      });
      return res.render('admin/views/measurement-form', {
        activeUser,
        user,
        error,
        oldValue: { weight, height, date },
        measurement: {},
        edit: false,
        fn: () => {},
        title: 'Tambah Pengukuran',
      });
    }

    const notes = noteResult.split(';').filter(note => note.length !== 0);
    const user = await User.findOne({ where: { id } });

    const currentDate = new Date(date);
    const userDate = new Date(user.dateOfBirth);
    const dif = new Date(currentDate.getTime() - userDate.getTime());
    const age = (dif.getUTCFullYear() - 1970) * 12 + dif.getUTCMonth();

    let sex = 0;
    if (user.gender === 'Laki - Laki') {
      sex = 1;
    } else if (user.gender === 'Perempuan') {
      sex = 2;
    }

    const result = R.callMethod('./script/anthro.r', 'anthro', {
      sex,
      age,
      weight: +weight,
      height: +height,
    });

    const { zlen, zwei, zwfl } = result[0][0];

    const measurement = await Measurement.create({
      weight,
      height,
      age,
      date,
      wZScore: zwei,
      hZScore: zlen,
      whZScore: zwfl,
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

    await Standard.create({
      age,
      sex,
      value: +height,
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
        id,
      },
    });
    const notes = await Note.findAll({ where: { measurementId: id } });
    const user = await User.findOne({
      where: {
        id: measurement.get('userId'),
      },
    });
    const activeUser = await Admin.findOne({
      where: { id: req.session.userId },
    });
    res.render('admin/views/measurement-form', {
      activeUser,
      edit,
      notes,
      measurement,
      user,
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

    const currentDate = new Date(date);
    const userDate = new Date(user.dateOfBirth);
    const dif = new Date(currentDate.getTime() - userDate.getTime());
    const age = (dif.getUTCFullYear() - 1970) * 12 + dif.getUTCMonth();

    let sex = '';
    if (user.gender === 'Laki - Laki') {
      sex = 1;
    } else if (user.gender === 'Perempuan') {
      sex = 2;
    }

    const result = await R.callMethodAsync('./script/anthro.r', 'anthro', {
      sex,
      age,
      weight: +weight,
      height: +height,
    });

    const { zlen, zwei, zwfl } = result[0][0];

    await Measurement.update(
      {
        weight,
        height,
        age,
        date,
        wZScore: zwei,
        hZScore: zlen,
        whZScore: zwfl,
        userId,
      },
      {
        where: {
          id: measurementId,
        },
      }
    );

    res.redirect(`/admin/add-measurement?id=${userId}`);
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
    const activeUser = await Admin.findOne({ where: { id: userId } });
    const measurements = await Measurement.findAll({ where: { userId: id } });
    const { height, nutrition, defuzzification } = generateFuzzy(measurements);
    const status = stuntingStatus(defuzzification);
    res.render('admin/views/fuzzy', {
      id,
      activeUser,
      defuzzification,
      status,
      height: { ...height, fuzzy: JSON.stringify(height.fuzzy) },
      nutrition: { ...nutrition, fuzzy: JSON.stringify(nutrition.fuzzy) },
      rules,
      title: 'Fuzzy',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.query;
    moment.locale('id');
    const user = await User.findOne({ where: { id } });
    const measurements = await Measurement.findAll({ where: { userId: id } });
    const notes = await Note.findAll({ where: { userId: id } });
    const activeUser = await Admin.findOne({ where: { id: req.session.userId } });
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
        nutritionalStatus: nutritionalStatus(measurements[measurements.length - 1].whZScore),
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
      moment,
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
    const activeUser = await Admin.findOne({
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

exports.getAntropometriIndex = async (req, res) => {
  try {
    const { index, gender } = req.params;
    const { antropometri: antro } = antropometri;
    const activeUser = await Admin.findOne({ where: { id: req.session.userId } });
    let currentAntro = {};
    let title = '';
    let indexTitle = '';
    let tableTitle1 = '';
    let tableTitle2 = '';
    let NSCategory = [];
    switch (index) {
      case 'bbu': {
        currentAntro = antro.bbu;
        title = 'bbu';
        indexTitle = 'Berat Badan menurut Umur (BB/U)';
        tableTitle1 = 'Umur (Bulan)';
        tableTitle2 = 'Berat Badan (Kg)';
        NSCategory = [
          { title: 'Berat Badan Sangat Kurang', value: '< -3 SD' },
          { title: 'Berat Badan Kurang', value: '-3 SD sd < -2 SD' },
          { title: 'Berat Badan Normal', value: '-2 SD sd +1 SD' },
          { title: 'Resiko Berat Badan Lebih', value: '> +1 SD' },
        ];
        break;
      }
      case 'pbu': {
        currentAntro = antro.pbu;
        title = 'pbu';
        indexTitle = 'Panjang Badan / Tinggi Badan Menurut Umur (PB/U/TB/U)';
        tableTitle1 = 'Umur (Bulan)';
        tableTitle2 = 'Tinggi Badan (Cm)';
        NSCategory = [
          { title: 'Sangat Pendek', value: '< -3 SD' },
          { title: 'Pendek', value: '-3 SD sd < -2 SD' },
          { title: 'Normal', value: '-2 SD sd +3 SD' },
          { title: 'Tinggi', value: '> +3 SD' },
        ];
        break;
      }
      case 'bbpb': {
        currentAntro = antro.bbpb;
        title = 'bbpb';
        indexTitle = 'Berat Badan menurut Panjang Badan (BB/PB)';
        tableTitle1 = 'Panjang Badan (Cm)';
        tableTitle2 = 'Berat Badan (Kg)';
        NSCategory = [
          { title: 'Gizi Buruk', value: '< -3 SD' },
          { title: 'Gizi Kurang', value: '-3 SD sd < -2 SD' },
          { title: 'Gizi Baik', value: '-2 SD sd +1 SD' },
          { title: 'Beresiko Gizi Lebih', value: '> +1 SD sd +2 SD' },
          { title: 'Gizi Lebih', value: '>+2 SD sd +3 SD' },
          { title: 'Obesitas', value: '> +3 SD' },
        ];
        break;
      }
      case 'bbtb': {
        currentAntro = antro.bbtb;
        title = 'bbtb';
        indexTitle = 'Berat Badan menurut Tinggi Badan (BB/TB)';
        tableTitle1 = 'Tinggi Badan (Cm)';
        tableTitle2 = 'Berat Badan (Kg)';
        NSCategory = [
          { title: 'Gizi Buruk', value: '< -3 SD' },
          { title: 'Gizi Kurang', value: '-3 SD sd < -2 SD' },
          { title: 'Gizi Baik', value: '-2 SD sd +1 SD' },
          { title: 'Beresiko Gizi Lebih', value: '> +1 SD sd +2 SD' },
          { title: 'Gizi Lebih', value: '>+2 SD sd +3 SD' },
          { title: 'Obesitas', value: '> +3 SD' },
        ];
        break;
      }
      default: {
        currentAntro = antro.bbu;
      }
    }
    let currentGender = '';
    if (gender === 'L') {
      currentAntro = currentAntro.L;
      currentGender = 'Laki - Laki';
    } else if (gender === 'P') {
      currentAntro = currentAntro.P;
      currentGender = 'Perempuan';
    }

    res.render('admin/views/table', {
      activeUser,
      index,
      title,
      indexTitle,
      tableTitle1,
      tableTitle2,
      NSCategory,
      gender: currentGender,
      antro: currentAntro,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getFuzzyDetails = async (req, res) => {
  try {
    const activeUser = await Admin.findOne({ where: { id: req.session.userId } });

    res.render('admin/views/fuzzyTsukamoto', {
      activeUser,
      rules,
      title: 'Fuzzy Inference System',
    });
  } catch (err) {
    console.log(err);
  }
};
