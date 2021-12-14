import { Request, Response, NextFunction } from "express";
import Member from "../model/Member";
import Nutrition from "../model/Nutrition";

export const getUserMainPage = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    const member = await Member.findOne({ where: { id: id } });
    const nutritions = await Nutrition.findAll({
      where: {
        memberId: id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.render("index", {
      member: member,
      nutrition: nutritions[0],
    });
  } catch (err) {
    console.log(err);
  }
};
