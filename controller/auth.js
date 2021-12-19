const Member = require("../model/Member");

exports.getLogin = (_req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const nik = req.body.nik;
    const password = req.body.password;

    const member = await Member.findOne({
      where: {
        nik: nik,
      },
    });

    if (member) {
      if (password == member.getDataValue("password")) {
        res.redirect(`/home?id=${member.getDataValue("id")}`);
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};
