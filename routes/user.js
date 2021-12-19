const router = require("express").Router();
const userController = require("../controller/user");

router.get("/home", userController.getUserMainPage);
router.get("/nutrition-api", userController.getWeightApi);

module.exports = router;
