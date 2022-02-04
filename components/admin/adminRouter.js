const router = require('express').Router();
const { body } = require('express-validator');

const User = require('../users/user');
const Admin = require('./admin');
const adminController = require('./adminController');

router.get('/', adminController.getIndex);

router.get('/add-user', adminController.getAddUser);
router.get('/edit-user', adminController.getEditUser);
router.post(
  '/add-user',
  body('nik').custom(value =>
    User.findOne({
      where: {
        nik: value,
      },
    }).then(user => {
      if (user) {
        return Promise.reject(new Error('Nik sudah terdaftar'));
      }
    })
  ),
  body(['nik', 'mothername', 'toddlername', 'address', 'gender', 'dateOfBirth']).notEmpty(),
  adminController.postAddUser
);
router.post('/edit-user', adminController.postEditUser);
router.post('/delete-user', adminController.postDeleteUser);

router.get('/add-admin', adminController.getAdminForm);
router.post(
  '/add-admin',
  body('username').custom(value =>
    Admin.findOne({ where: { username: value } }).then(admin => {
      if (admin) {
        return Promise.reject(new Error('username sudah terdaftar'));
      }
    })
  ),
  body(['username', 'name', 'password']).notEmpty(),
  adminController.postAddAdmin
);
router.get('/edit-admin', adminController.getEditAdmin);
router.post('/edit-admin', adminController.postEditAdmin);

router.get('/add-measurement', adminController.getAddMeasurement);
router.get('/edit-measurement', adminController.getEditMeasurement);
router.post(
  '/add-measurement',
  body(['weight', 'height', 'date']).notEmpty(),
  body(['weight', 'height']).isNumeric(),
  adminController.postAddMeasurement
);
router.post('/edit-measurement', adminController.postEditMeasurement);
router.post('/delete-measurement', adminController.postDeleteMeasurement);

router.get('/detail', adminController.getDetail);
router.get('/nutrition-api', adminController.getWeightApi);
router.get('/fuzzy', adminController.getFuzzy);

router.get('/antro/:index/:gender', adminController.getAntropometriIndex);
router.get('/fuzzy-details', adminController.getFuzzyDetails);

module.exports = router;
