const express = require('express');
const { store, } = require('../controllers/roomController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

router.post('/store',auth,isAuthorizedRole(['owner','receptionist']),store)


module.exports = router