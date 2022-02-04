const { hash } = require('bcrypt');
const moment = require('moment');

const User = require('./user');
const Note = require('./userNote');
const Measurement = require('./userMeasurement');
const { getMeasurementInfo } = require('../../util/helper');
const { ssColor } = require('../../util/helper');

let MEASUREMENT_API = {
  weight: {},
  height: {},
  month: [],
};

exports.getIndex = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await User.findOne({ where: { id: userId } });
    const measurementDESC = await Measurement.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
    });
    const measurements = await Measurement.findAll({ where: { userId } });
    const notes = await Note.findAll({ where: { state: false } });

    let gender = '';
    if (user.gender === 'Laki - Laki') {
      gender = 'L';
    } else if (user.gender === 'Perempuan') {
      gender = 'P';
    }
    MEASUREMENT_API = await getMeasurementInfo(measurements, user.dateOfBirth, gender);
    moment.locale('id');
    res.render('users/views/index', {
      user,
      notes,
      ssColor,
      moment,
      title: 'Home',
      measurement: measurementDESC[measurementDESC.length - 1] || [],
      measurements: measurementDESC,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getWeightApi = async (_req, res) => {
  try {
    res.status(200).json(MEASUREMENT_API);
  } catch (err) {
    console.log(err);
  }
};

exports.getUserSetting = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await User.findOne({ where: { id: userId } });
    res.render('users/views/setting', {
      title: 'Setting',
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSimulation = async (req, res) => {
  const { id, g } = req.query;
  const user = await User.findOne({ where: { id } });
  let gender = '';
  switch (g) {
    case 'Laki - Laki': {
      gender = 'L';
      break;
    }
    case 'Perempuan': {
      gender = 'P';
      break;
    }
    default: {
      gender = '';
    }
  }
  try {
    res.render('users/views/simulation', {
      user,
      gender,
      title: 'simulasi',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNoteState = async (req, res) => {
  try {
    const { state } = req.body;

    if (typeof state === 'object') {
      state.forEach(async id => {
        await Note.update(
          {
            state: true,
          },
          {
            where: {
              id: +id,
            },
          }
        );
      });
    } else {
      await Note.update(
        {
          state: true,
        },
        {
          where: {
            id: +state,
          },
        }
      );
    }

    res.redirect(`/home`);
  } catch (err) {
    console.log(err);
  }
};

exports.postUserSetting = async (req, res) => {
  try {
    const { id, mothername, childname, nik, password, oldPassword, imgsrc } = req.body;
    let hashPassword = '';
    if (password) {
      hashPassword = await hash(password.toString().trim(), 10);
    } else {
      hashPassword = oldPassword;
    }
    await User.update(
      {
        nik,
        mothername,
        childname,
        password: hashPassword,
        imgsrc,
      },
      {
        where: {
          id,
        },
      }
    );

    res.redirect('/setting');
  } catch (err) {
    console.log(err);
  }
};
