const router = require('express').Router();
const dbController = require('../controllers/dbController');

// Get user details
router
    .route('/getdetails/:address')
    .get(dbController.getDetails)

// get all tx
router
    .route('/getalltx')
    .get(dbController.getAllTx)

// get all users
router
    .route('/getallusers')
    .get(dbController.getAllUsers)


// Additional Feature : To update the database from previous update to latest block
// not implemented
router
    .route('/update')
    .get(dbController.updateDatabase)

// To fetch latest 10k blockc
router
    .route('/genesis')
    .get(dbController.genesis)

//Testing Purpose    
router
    .route('/test')
    .get(dbController.test)

module.exports = router;