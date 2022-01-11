const { User } = require('../users');

exports.getLogin = async (req, res) => {
  try {
    const { userId } = req.session;
    if (userId) {
      const user = await User.findOne({ where: { id: userId } });
      if (user.getDataValue('role') === 'admin') {
        return res.redirect('/admin');
      }
      return res.redirect(`/home?id=${userId}`);
    }
    res.render('auth/views/login', {
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

    const user = await User.findOne({
      where: {
        nik,
      },
    });

    if (user) {
      if (password === user.get('password')) {
        req.session.isLoggin = true;
        req.session.userId = user.get('id');
        if (user.get('role') === 'admin') {
          return res.redirect('/admin');
        }
        res.redirect(`/home?id=${user.get('id')}`);
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
    const user = await User.findOne({ where: { nik } });

    if (!user) {
      await User.create({
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
