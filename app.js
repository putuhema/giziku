const path = require('path');
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const { User, Measurement, Note, Fuzzy } = require('./components/users');
const { authRouter } = require('./components/auth');
const { userRouter } = require('./components/users');
const { adminRouter } = require('./components/admin');
const { router: apiRouter } = require('./api');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'components');

app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'libs')));
app.use(express.static(path.join(__dirname, 'script')));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  session({
    key: 'session_user',
    resave: false,
    secret: process.env.SECRET,
    saveUninitialized: false,
    store: new MySQLStore({
      host: process.env.HOST,
      port: 3306,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
    }),
    cookie: {
      maxAge: 36000000,
    },
  })
);

app.use(authRouter);
app.use(userRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use((err, _req, res) => {
  const { message } = err;

  res.render('admin/views/error-page', {
    message,
  });
});

User.hasMany(Measurement);
Measurement.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Fuzzy);
Fuzzy.belongsTo(User);

Measurement.hasMany(Note);
Note.belongsTo(Measurement);

module.exports = app;
