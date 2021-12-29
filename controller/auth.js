const Member = require("../model/Member");

exports.getLogin = async (req, res) => {
  try {
    const id = req.session.memberId;
    if (id) {
      const member = await Member.findOne({ where: { id: id } });
      if (member.getDataValue("role") == "admin") {
        return res.redirect("/admin");
      }
      return res.redirect(`/home?id=${id}`);
    }
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
      console.log(member.get("id"));
      if (password == member.getDataValue("password")) {
        req.session.isLoggin = true;
        req.session.memberId = member.get("id");
        if (member.getDataValue("role") == "admin") {
          return res.redirect("/admin");
        }
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

exports.postSingup = async (req, res) => {
  try {
    const nik = req.body.nik;
    const mohterName = req.body.mohterName;
    const toddlerName = req.body.toddlerName;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;
    const address = req.body.address;
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      res.clearCookie("session_member");
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};
