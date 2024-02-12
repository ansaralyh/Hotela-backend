const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { createRoom, getSingleRoom, getAllRooms, updateRoom, deleteRoom, getAllAvailableRooms } = require('../controllers/roomControllers');

const router = express.Router();

router.route('/room/create').post(auth,isAuthorizedRole("owner","receptionist") ,createRoom);
/**Single room route */
router.route('/room/view/:roomId').get(auth,isAuthorizedRole("owner","receptionist") ,getSingleRoom);

/**Get All Rooms */
router.route('/room/view').get(auth,isAuthorizedRole("owner","receptionist") ,getAllRooms);

/**Update a room */
router.route('/room/update/:roomId').put(auth,isAuthorizedRole("owner","receptionist") ,updateRoom);

/**Delete room */
router.route('/room/delete/:roomId').delete(auth,isAuthorizedRole("owner","receptionist") ,deleteRoom);

/**Get all available rooms */
router.route('/room/available').get(auth,isAuthorizedRole("owner","receptionist"),getAllAvailableRooms) 

module.exports = router;





