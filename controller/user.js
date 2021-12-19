const Member = require("../model/Member");
const Nutrition = require("../model/Nutrition");

let nutritionAPI = {
  weight: [],
  height: [],
  month: [],
};
exports.getUserMainPage = async (req, res) => {
  try {
    const id = req.query.id;

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

    const weight = [];
    const height = [];
    const month = [];

    nutritions.forEach((nutrition) => {
      weight.push(nutrition.getDataValue("weight"));
      height.push(nutrition.getDataValue("height"));
      month.push(nutrition.getDataValue("month"));
    });
    nutritionAPI = {
      weight,
      height,
      month,
    };

    res.render("index", {
      member: member,
      nutrition: nutritionsInOrder[0] || [],
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
