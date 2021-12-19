const path = require("path");
const express = require("express");
const { urlencoded } = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");

const sequelize = require("./util/database");
const Member = require("./model/Member");
const Nutrition = require("./model/Nutrition");

// routes handlers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

const options = {
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(urlencoded({ extended: false }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET,
    store: new MySQLStore(options),
  })
);

app.use(authRouter);
app.use(userRouter);
app.use("/admin", adminRouter);

Member.hasMany(Nutrition, {
  foreignKey: "nutritionId",
  sourceKey: "id",
});

Nutrition.belongsTo(Member, {
  foreignKey: "memberId",
});

sequelize
  .sync()
  .then(() => {
    app.listen(8080, () => {
      console.log("listening to port 8080 on http http://localhost:8080/");
    });
  })
  .catch((err) => {
    console.log(err);
  });
