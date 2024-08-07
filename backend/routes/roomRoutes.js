const express = require('express');
const { store, index, get, update,destroy, getRoomsDropDown, checkAvailability } = require('../controllers/roomController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

///Register a room
router.post('/',auth,isAuthorizedRole(['owner','receptionist']),store)

//get all rooms
router.get('/',auth,isAuthorizedRole(['owner','receptionist']),index)

//rooms dropdown
router.get('/dropdown',auth,isAuthorizedRole(['owner','receptionist']),getRoomsDropDown)
router.get('/check-availability',auth,isAuthorizedRole(['owner','receptionist']),checkAvailability)

//get single room
router.get('/:id',auth,isAuthorizedRole(['owner','receptionist']),get)

// room reservation route
router.put('/:id',auth,isAuthorizedRole(['owner','receptionist']),update);

// roo deletion route
router.delete('/:id',auth,isAuthorizedRole(['owner','receptionist']),destroy);


module.exports = router 