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
      order: [['createdAt', 'DESC']],
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

    res.render('users/views/index', {
      user,
      notes,
      title: 'Home',
      measurement: measurementDESC[0] || [],
      measurements: measurementDESC,
      ssColor,
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
  const { id } = req.query;
  const user = await User.findOne({ where: { id } });
  try {
    res.render('users/views/simulation', {
      user,
      title: 'simulasi',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNoteState = async (req, res) => {
  try {
    const { memberId } = req.session;
    const states = req.body.state;

    if (typeof states === 'object') {
      states.forEach(async id => {
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
            id: +states,
          },
        }
      );
    }

    res.redirect(`/home?id=${memberId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.postUserSetting = async (req, res) => {
  try {
    const { id, mothername, childname, nik, password, imgsrc } = req.body;

    await User.update(
      {
        nik,
        mothername,
        childname,
        password: password.toString().trim(),
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
