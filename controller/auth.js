const Member = require('../model/Member');

exports.getLogin = async (req, res) => {
  try {
    const { memberId } = req.session.memberId;
    if (memberId) {
      const member = await Member.findOne({ where: { id: memberId } });
      if (member.getDataValue('role') === 'admin') {
        return res.redirect('/admin');
      }
      return res.redirect(`/home?id=${memberId}`);
    }
    res.render('login');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { nik, password } = req.body;

    const member = await Member.findOne({
      where: {
        nik,
      },
    });

    if (member) {
      console.log(member.get('id'));
      if (password === member.getDataValue('password')) {
        req.session.isLoggin = true;
        req.session.memberId = member.get('id');
        if (member.getDataValue('role') === 'admin') {
          return res.redirect('/admin');
        }
        res.redirect(`/home?id=${member.getDataValue('id')}`);
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postSingup = async (req, res) => {
  try {
    const { nik, mohterName, toddlerName, gender, dateOfBirth, address } =
      req.body;
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      res.clearCookie('session_member');
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
};
