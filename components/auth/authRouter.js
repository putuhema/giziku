const router = require('express').Router();

const authController = require('./authController');

router.get('/', authController.getLogin);

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSingup);
router.post('/logout', authController.postLogout);

module.exports = router;
