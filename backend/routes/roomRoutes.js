const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { createRoom, getSingleRoom, getAllRooms, updateRoom, deleteRoom } = require('../controllers/roomControllers');

const router = express.Router();

router.route('/room/create').post(auth,isAuthorizedRole("owner","receptionist") ,createRoom);
/**Single room route */
router.route('/room/view/:roomId').get(getSingleRoom);

/**Get All Rooms */
router.route('/room/view').get(getAllRooms);

/**Update a room */
router.route('/room/update/:roomId').put(updateRoom);

/**Delete room */
router.route('/room/delete/:roomId').delete(deleteRoom);

module.exports = router;





