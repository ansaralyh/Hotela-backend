const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, index ,get, update, destroy, checkAvailability, getReservationsForDropdown, addItemstoReservationInvoice} = require('../controllers/reservationController');
const router = express.Router();

router.post('/',auth,isAuthorizedRole(['owner', 'receptionist']),store)

router.post('/items/:reservation_id',auth,isAuthorizedRole(['owner','receptionist']),addItemstoReservationInvoice)


router.get('/',auth,isAuthorizedRole(['owner', 'receptionist']),index)

router.get('/dropdown',auth,isAuthorizedRole(['owner', 'receptionist']),getReservationsForDropdown)

router.get('/:id',auth,isAuthorizedRole(['owner', 'receptionist']),get)

router.put('/:id',auth,isAuthorizedRole(['owner', 'receptionist']),update)

router.delete('/',auth,isAuthorizedRole(['owner', 'receptionist']),destroy)

// router.get('/checkAvailibility',auth,isAuthorizedRole(['owner', 'receptionist']),checkAvailability)
module.exports = router