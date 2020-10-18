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

module.exports = router;