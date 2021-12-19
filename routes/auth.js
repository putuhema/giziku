const router = require("express").Router();
const authController = require("../controller/auth");

router.get("/", authController.getLogin);

router.post("/login", authController.postLogin);

module.exports = router;
