const Member = require("../model/Member");

exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggin) {
    return res.redirect("/");
  }
  next();
};
