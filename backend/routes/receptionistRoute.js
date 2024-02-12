const express = require('express')
const { createReceptionist, getSingleReceptionist, getAllReceptionist, updateReceptionist, deleteReceptionist } = require('../controllers/receptionistController');
const {auth} = require('../middleware/authentication');

const router = express.Router();
//create recceptionist
router.post('/receptionist/create',auth,store);
//get single receptionist
router.get("/receptionist/view/:id",auth,get)

//get ala receptionist 
router.get("/receptionist/view",auth,index)

//update receptionist

router.put("/receptionist/update/:id",auth,update)

//remove receptionist

router.delete("/receptionist/delete/:id",auth,destroy);
module.exports = router;