const Member = require('../model/Member');

exports.getLogin = async (req, res) => {
  try {
    const { memberId } = req.session;
    if (memberId) {
      const member = await Member.findOne({ where: { id: memberId } });
      if (member.getDataValue('role') === 'admin') {
        return res.redirect('/admin');
      }
      return res.redirect(`/home?id=${memberId}`);
    }
    res.render('login', {
      title: 'Login',
      data: req.cookies.nik,
    });
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
    const { nik, mothername, toddlername, gender, dateOfBirth, address } = req.body;

    console.log(nik, mothername, toddlername, gender, dateOfBirth, address);

    const member = await Member.findOne({ where: { nik } });

    if (!member) {
      await Member.create({
        nik,
        mothername,
        toddlername,
        gender,
        dateOfBirth,
        address,
        role: 'kader',
        password: nik,
        imgSeed: toddlername,
      });
      res.cookie('nik', nik, {
        maxAge: 10000,
      });

      res.redirect('/?success');
    } else {
      res.redirect('/?duplicate');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res) => {
  try {
    req.session.destroy(err => {
      res.clearCookie('session_member');
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
};
