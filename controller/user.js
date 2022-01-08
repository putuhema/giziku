const Member = require('../model/Member');
const Note = require('../model/Note');
const Nutrition = require('../model/Nutrition');
const { zScore, monthById } = require('../util/helper');

let nutritionAPI = {
  weight: {},
  height: {},
  month: [],
};

exports.getUserMainPage = async (req, res) => {
  try {
    const { memberId } = req.session;
    const member = await Member.findOne({ where: { id: memberId } });
    const nutritionsInOrder = await Nutrition.findAll({
      where: {
        memberId,
      },
      order: [['createdAt', 'DESC']],
    });
    const nutritions = await Nutrition.findAll({
      where: {
        memberId,
      },
    });

    const notes = await Note.findAll({
      where: {
        state: false,
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

    res.render('index', {
      title: 'Home',
      member,
      notes,
      nutrition: nutritionsInOrder[0] || [],
      nutritions: nutritionsInOrder,
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

exports.getUserSetting = async (req, res) => {
  try {
    const { memberId } = req.session;
    const member = await Member.findOne({ where: { id: memberId } });
    res.render('setting', {
      title: 'Setting',
      member,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSimulation = async (req, res) => {
  const { id } = req.query;
  const member = await Member.findOne({ where: { id } });
  try {
    res.render('simulation', {
      member,
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
    const { id, mothername, childname, address, nik, password, imgsrc } = req.body;

    await Member.update(
      {
        nik,
        mothername,
        childname,
        address,

        password: password.toString().trim(),
        imgsrc,
      },
      {
        where: {
          id,
        },
      }
    );

    res.redirect('/user-setting');
  } catch (err) {
    console.log(err);
  }
};
