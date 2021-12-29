const Member = require("../model/Member");
const Note = require("../model/Note");
const Nutrition = require("../model/Nutrition");
const { zScore } = require("../util/helper");

let nutritionAPI = {
  weight: {},
  height: {},
  month: [],
};

exports.getUserMainPage = async (req, res) => {
  try {
    const id = req.session.memberId;
    const member = await Member.findOne({ where: { id: id } });
    const nutritionsInOrder = await Nutrition.findAll({
      where: {
        memberId: id,
      },
      order: [["createdAt", "DESC"]],
    });
    const nutritions = await Nutrition.findAll({
      where: {
        memberId: id,
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

    nutritions.forEach(async (nutrition) => {
      weight.weight.push(nutrition.get("weight"));
      height.height.push(nutrition.get("height"));
      month.push(nutrition.get("month").toString().slice(0, 3));

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
    });

    nutritionAPI = {
      weight,
      height,
      month,
    };

    res.render("index", {
      member: member,
      nutrition: nutritionsInOrder[0] || [],
      notes: notes,
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
    const id = req.session.memberId;
    const member = await Member.findOne({ where: { id: id } });
    console.log(member.getDataValue("imgsrc"));
    res.render("settings", {
      member: member,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNoteState = async (req, res) => {
  try {
    const memberId = req.session.memberId;
    const states = req.body.state;

    if (typeof states == "object") {
      states.forEach(async (id) => {
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
    const id = req.body.id;
    const imgsrc = req.body.imgsrc;
    const nik = req.body.nik;
    const mothername = req.body.mothername;
    const childname = req.body.childname;
    const address = req.body.address;
    const village = req.body.village;
    const subregency = req.body.subregency;
    const regency = req.body.regency;
    const province = req.body.province;
    const password = req.body.password;

    await Member.update(
      {
        nik,
        mothername,
        childname,
        address,
        village,
        subregency,
        regency,
        province,
        password: password.toString().trim(),
        imgsrc,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.redirect("/user-setting");
  } catch (err) {
    console.log(err);
  }
};
