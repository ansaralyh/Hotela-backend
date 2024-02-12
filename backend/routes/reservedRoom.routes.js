const express = require('express');

const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { reserveRoom, updateReservedRoom, deleteReservedRoom, getAllReservedRooms, getSingleReservedRoom } = require('../controllers/reservedRoom.controller');

const router = express.Router();


// Route to reserve a room
router.route('/reserve').post( auth, isAuthorizedRole("owner","receptionist"), reserveRoom);

//route for updating a room
router.route('/reserve/update/:room_id').put( auth, isAuthorizedRole("owner","receptionist"), updateReservedRoom);

//route for deleting a reserved room
router.route('/reserve/delete/:id').post( auth, isAuthorizedRole("owner","receptionist"), deleteReservedRoom);

//route for getting all reserved rooms

router.route('/reserve/view').get( auth, isAuthorizedRole("owner","receptionist"), getAllReservedRooms);

//Route for getting a single reserved room
router.route('/reserve/view/:id').post( auth, isAuthorizedRole("owner","receptionist"),getSingleReservedRoom);



module.exports = router;    