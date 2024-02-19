const express = require('express');
const { store,index } = require('../controllers/receptionistController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

router.post('/store',auth,isAuthorizedRole(['owner']),store);

router.get('/index',auth,isAuthorizedRole(['owner']),index);
module.exports = router