const express = require('express');
const { store, get, index, update, destroy, deleteAllCustomers } = require('../controllers/cutomerControllers');
const { auth, isAuthorizedRole } = require('../middleware/authentication');

const router = express.Router();


router.post('/',auth,isAuthorizedRole(['owner','receptionist']), store)
router.get('/:id',auth,isAuthorizedRole(['owner','receptionist']), get);
router.get('/',auth,isAuthorizedRole(['owner','receptionist']), index);
router.put('/:id',auth,isAuthorizedRole(['owner','receptionist']), update)
router.delete('/:id',auth,isAuthorizedRole(['owner','receptionist']), destroy)






module.exports = router;
