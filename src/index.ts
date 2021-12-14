import path from "path";
import express from "express";
import { urlencoded } from "body-parser";
import cors from "cors";

import sequelize from "./util/database";
import Member from "./model/Member";
import Nutrition from "./model/Nutrition";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(urlencoded({ extended: false }));

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
