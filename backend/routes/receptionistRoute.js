const express = require('express')
const { store, get, index, update, destroy } = require('../controllers/receptionistController');
const {auth} = require('../middleware/authentication');

const router = express.Router();
//create recceptionist
router.post('/create',auth,store);
//get single receptionist
router.get("/get/:id",auth,get)

//get ala receptionist 
router.get("/get",auth,index)

//update receptionist

router.put("/update/:id",auth,update)

//remove receptionist

router.delete("/delete/:id",auth,destroy);
module.exports = router;