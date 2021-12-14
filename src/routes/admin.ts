import { Router } from "express";

import * as adminController from "../controller/admin";

const router = Router();

router.get("/", adminController.getReport);
router.get("/add-member", adminController.getAddNewMember);
router.get("/edit-member", adminController.getEditMember);
router.get("/add-data", adminController.getAddData);
router.get("/edit-data", adminController.getEditData);
router.get("/nutrition-report", adminController.getIndividualReport);
router.get("/nutrition-api", adminController.getWeightApi);

router.post("/add-member", adminController.postNewMember);
router.post("/edit-member", adminController.postEditMember);
router.post("/delete-member", adminController.deleteMember);
router.post("/add-data", adminController.postNutritionData);
router.post("/edit-data", adminController.postEditNutrition);
router.post("/delete-data", adminController.postDeleteNutritionData);

export default router;
