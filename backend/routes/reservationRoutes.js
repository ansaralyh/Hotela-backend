const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, index ,get, update, destroy, checkAvailability} = require('../controllers/reservationController');
const router = express.Router();

router.post('/',auth,isAuthorizedRole(['owner', 'receptionist']),store)

router.get('/',auth,isAuthorizedRole(['owner', 'receptionist']),index)

router.get('/:id',auth,isAuthorizedRole(['owner', 'receptionist']),get)

router.put('/:id',auth,isAuthorizedRole(['owner', 'receptionist']),update)

router.delete('/',auth,isAuthorizedRole(['owner', 'receptionist']),destroy)

// router.get('/checkAvailibility',auth,isAuthorizedRole(['owner', 'receptionist']),checkAvailability)
module.exports = router