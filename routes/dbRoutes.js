const router = require('express').Router();
const dbController = require('../controllers/dbController');

router
    .route('/getdetails/:address')
    .get(dbController.getDetails)


router
    .route('/update')
    .get(dbController.updateDatabase)


router
    .route('/genesis')
    .get(dbController.genesis)

router
    .route('/test')
    .get(dbController.test)
module.exports = router;