import { Router } from "express";

import { getUserMainPage } from "../controller/userpage";
const router = Router();

router.get("/home", getUserMainPage);

export default router;
