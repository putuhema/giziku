const router = require('express').Router();

const apiController = require('./apiController');

router.get('/', apiController.getAtropometri);

module.exports = router;
