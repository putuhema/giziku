const path = require('path');
const express = require('express');
const { urlencoded } = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sequelize = require('./util/database');
// data models
const Member = require('./model/Member');
const Nutrition = require('./model/Nutrition');
const Note = require('./model/Note');

// routes handlers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({ extended: false }));
app.use(
  session({
    key: 'session_member',
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

Member.hasMany(Nutrition);
Nutrition.belongsTo(Member);

Member.hasMany(Note);
Note.belongsTo(Member);

Nutrition.hasMany(Note);
Note.belongsTo(Nutrition);

sequelize
  .sync()
  .then(async () => {
    const member = await Member.findOne({ where: { nik: 'admin' } });
    if (!member) {
      Member.create({
        nik: 'admin',
        password: 'admin',
        mothername: 'admin',
        role: 'admin',
        imgsrc: '/assets/img/ava-1.png',
      });
    }
  })
  .then(() => {
    app.listen(8080, () => {
      console.log('listening to port 8080 on http http://localhost:8080/');
    });
  })
  .catch((err) => {
    console.log(err);
  });
