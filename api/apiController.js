const antropometri = require('../data/antropometri.json');

exports.getAtropometri = (_req, res) => {
  try {
    res.status(200).json(antropometri);
  } catch (err) {
    console.log(err);
  }
};
