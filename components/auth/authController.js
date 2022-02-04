const { hash, compare } = require('bcrypt');

const { Admin } = require('../admin');
const { User } = require('../users');

exports.getLogin = async (req, res) => {
  try {
    const { userId } = req.session;
    const { err, n, p } = req.query;
    if (userId) {
      const admin = await Admin.findOne({ where: { id: userId } });
      if (admin) {
        return res.redirect('/admin');
      }
      return res.redirect(`/home?id=${userId}`);
    }
    res.render('auth/views/login', {
      title: 'Login',
      error: err,
      nik: n,
      password: p,
      data: req.cookies.nik,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { nik, password } = req.body;

    const user = await User.findOne({ where: { nik } });
    const admin = await Admin.findOne({ where: { username: nik } });

    if (user) {
      const result = await compare(password, user.get('password'));
      if (result) {
        req.session.isLoggin = true;
        req.session.userId = user.get('id');
        res.redirect(`/home?id=${user.get('id')}`);
      } else {
        res.redirect(`/?err=true&n=${nik}&p=${password}`);
      }
    } else if (admin) {
      const result = await compare(password, admin.get('password'));
      if (result) {
        req.session.isLoggin = true;
        req.session.userId = admin.get('id');
        res.redirect(`/admin`);
      } else {
        res.redirect(`/?err=true&n=${nik}&p=${password}`);
      }
    } else {
      res.redirect(`/?err=true&n=${nik}&p=${password}`);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postSingup = async (req, res) => {
  try {
    const { nik, mothername, toddlername, gender, dateOfBirth, address } = req.body;
    const user = await User.findOne({ where: { nik } });
    const hashPassword = await hash(nik, 10);
    if (!user) {
      await User.create({
        nik,
        mothername,
        toddlername,
        gender,
        dateOfBirth,
        address,
        role: 'kader',
        password: hashPassword,
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
