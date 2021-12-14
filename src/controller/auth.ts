import { Request, Response } from "express";
import Member from "../model/Member";

export const getLogin = (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};

export const postLogin = async (req: Request, res: Response) => {
  try {
    const nik = req.body.nik;
    const password = req.body.password;

    const member = await Member.findOne({
      where: {
        nik: nik,
      },
    });

    if (member) {
      if (password == member.getDataValue("password")) {
        res.redirect(`/home?id=${member.getDataValue("id")}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
