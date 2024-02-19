const express = require('express');
const { store, get, index, update, destroy, deleteAllCustomers } = require('../controllers/cutomerControllers');
const { auth, isAuthorizedRole } = require('../middleware/authentication');

const router = express.Router();


router.post('/store',auth,isAuthorizedRole(['owner','receptionist']), store)
router.get('/get/:id',auth,isAuthorizedRole(['owner','receptionist']), get);
router.get('/index',auth,isAuthorizedRole(['owner','receptionist']), index);
router.put('/update/:id',auth,isAuthorizedRole(['owner','receptionist']), update)
router.delete('/destroy/:id',auth,isAuthorizedRole(['owner','receptionist']), destroy)






module.exports = router;
