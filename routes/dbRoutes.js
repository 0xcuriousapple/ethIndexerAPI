const router = require('express').Router();
const dbController = require('../controllers/dbController');

router
    .route('/:address')
    .get(dbController.getDetails)


router
    .route('/update')
    .post(dbController.updateDatabase)

router
    .route('/genesis')
    .get(dbController.genesis)

module.exports = router;