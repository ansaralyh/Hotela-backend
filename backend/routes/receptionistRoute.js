const express = require('express')
const { createReceptionist, getSingleReceptionist, getAllReceptionist, updateReceptionist, deleteReceptionist } = require('../controllers/receptionistController');
const {auth} = require('../middleware/authentication');

const router = express.Router();
//create recceptionist
router.route('/receptionist/create').post(auth,createReceptionist);
//get single receptionist
router.route("/receptionist/view/:id").get(auth,getSingleReceptionist)

//get ala receptionist 
router.route("/receptionist/view").get(auth,getAllReceptionist);

//update receptionist

router.route("/receptionist/update/:id").put(auth,updateReceptionist);

//remove receptionist

router.route("/receptionist/delete/:id").delete(auth,deleteReceptionist)
module.exports = router;