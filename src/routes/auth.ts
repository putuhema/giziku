import { Router } from "express";

import * as authController from "../controller/auth";

const router = Router();

router.get("/", authController.getLogin);

router.post("/login", authController.postLogin);

export default router;
