const express = require('express');
const { store, index, get, reservingRoom, } = require('../controllers/roomController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

///Register a room
router.post('/store',auth,isAuthorizedRole(['owner','receptionist']),store)

//get all rooms
router.get('/index',auth,isAuthorizedRole(['owner','receptionist']),index)

//get single room

router.get('/get/:id',auth,isAuthorizedRole(['owner','receptionist']),get)

// room reservation route

router.post('/reserve/:id',auth,isAuthorizedRole(['owner','receptionist']),reservingRoom)
module.exports = router