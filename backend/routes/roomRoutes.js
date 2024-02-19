const express = require('express');
const { store, index, } = require('../controllers/roomController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

router.post('/store',auth,isAuthorizedRole(['owner','receptionist']),store)
router.get('/index',auth,isAuthorizedRole(['owner','receptionist']),index)

module.exports = router