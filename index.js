const path = require('path');
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sequelize = require('./config/db');
const { User, Measurement, Note, Fuzzy } = require('./components/users');
const { authRouter } = require('./components/auth');
const { userRouter } = require('./components/users');
const { adminRouter } = require('./components/admin');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'components');

app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  session({
    key: 'session_user',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
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

User.hasMany(Measurement);
Measurement.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Fuzzy);
Fuzzy.belongsTo(User);

Measurement.hasMany(Note);
Note.belongsTo(Measurement);

sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    const user = await User.findOne({ where: { nik: 'admin' } });
    if (!user) {
      User.create({
        nik: 'admin',
        password: 'admin',
        mothername: 'admin',
        role: 'admin',
        imgSeed: 'admin',
      });
    }
  })
  .then(() => {
    app.listen(8080, () => {
      console.log('listening to port 8080 on http http://localhost:8080/');
    });
  })
  .catch(err => {
    console.log(err);
  });
