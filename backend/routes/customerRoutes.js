const express = require('express');
const { store, get, index, update, destroy, deleteAllCustomers } = require('../controllers/cutomerControllers');
const { auth, isAuthorizedRole } = require('../middleware/authentication');

const router = express.Router();


router.post('/store',auth,isAuthorizedRole('owner'), store)
router.get('/get/:id',auth,isAuthorizedRole('owner'), get);
router.get('/index',auth,isAuthorizedRole('owner'), index);
router.put('/update/:id',auth,isAuthorizedRole('owner'), update)
router.delete('/destroy/:id',auth,isAuthorizedRole('owner'), destroy)






module.exports = router;
