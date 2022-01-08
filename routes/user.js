const router = require('express').Router();
const userController = require('../controller/user');

const { isAuth } = require('../middleware/is-auth');

router.get('/home', isAuth, userController.getUserMainPage);
router.get('/nutrition-api', userController.getWeightApi);
router.get('/setting', isAuth, userController.getUserSetting);
router.get('/simulation', isAuth, userController.getSimulation);

router.post('/notes-state', isAuth, userController.postNoteState);
router.post('/update-profile', isAuth, userController.postUserSetting);

module.exports = router;
