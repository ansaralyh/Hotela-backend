const express = require('express');

const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { reserveRoom } = require('../controllers/reservedRoom.controller');

const router = express.Router();


// Route to reserve a room
router.route('/reserve').post( auth, isAuthorizedRole("owner","receptionist"), reserveRoom);

//route 

module.exports = router;