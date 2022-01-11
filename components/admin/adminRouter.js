const router = require('express').Router();

const adminController = require('./adminController');

router.get('/', adminController.getIndex);

router.get('/add-user', adminController.getAddUser);
router.get('/edit-user', adminController.getEditUser);
router.post('/add-user', adminController.postAddUser);
router.post('/edit-user', adminController.postEditUser);
router.post('/delete-user', adminController.postDeleteUser);

router.get('/add-measurement', adminController.getAddMeasurement);
router.get('/edit-measurement', adminController.getEditMeasurement);
router.post('/add-measurement', adminController.postAddMeasurement);
router.post('/edit-measurement', adminController.postEditMeasurement);
router.post('/delete-measurement', adminController.postDeleteMeasurement);

router.get('/detail', adminController.getDetail);
router.get('/nutrition-api', adminController.getWeightApi);
router.get('/profile', adminController.getProfile);
router.get('/fuzzy', adminController.getFuzzy);
router.post('/setting', adminController.postUpdateSetting);

module.exports = router;
