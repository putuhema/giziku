const router = require('express').Router();

const adminController = require('../controller/admin');
const antropometriController = require('../controller/antropometri');

router.get('/', adminController.getMain);
router.get('/add-member', adminController.getAddNewMember);
router.get('/edit-member', adminController.getEditMember);
router.get('/add-measurement', adminController.getAddMeasurement);
router.get('/edit-measurement', adminController.getEditMeasurement);
router.get('/detail', adminController.getDetail);
router.get('/nutrition-api', adminController.getWeightApi);
router.get('/profile', adminController.getProfile);

router.get('/bbu', antropometriController.getBBU);
router.get('/add-bbu', antropometriController.getAddBBU);
router.post('/add-bbu', antropometriController.postAddBBU);
router.post('/delete-bbu', antropometriController.postDeleteBBU);

router.get('/tbu', antropometriController.getTBU);
router.get('/add-tbu', antropometriController.getAddTBU);
router.post('/add-tbu', antropometriController.postAddTBU);
router.post('/delete-tbu', antropometriController.postDeleteTBU);

router.get('/bbpb', antropometriController.getBBPB);
router.get('/add-bbpb', antropometriController.getAddBBPB);
router.post('/add-bbpb', antropometriController.postAddBBPB);
router.post('/delete-bbpb', antropometriController.postDeleteBBPB);

router.get('/bbtb', antropometriController.getBBTB);
router.get('/add-bbtb', antropometriController.getAddBBTB);
router.post('/add-bbtb', antropometriController.postAddBBTB);
router.post('/delete-bbtb', antropometriController.postDeleteBBTB);

router.post('/add-member', adminController.postNewMember);
router.post('/edit-member', adminController.postEditMember);
router.post('/delete-member', adminController.deleteMember);
router.post('/add-measurement', adminController.postMeasurement);
router.post('/edit-measurement', adminController.postEditMeasurement);
router.post('/delete-measurement', adminController.postDeleteMeasurement);
router.post('/setting', adminController.postUpdateSetting);

module.exports = router;
