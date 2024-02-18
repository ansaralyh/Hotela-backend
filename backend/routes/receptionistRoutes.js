const express = require('express');
const { store, } = require('../controllers/receptionistController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

router.post('/store',auth,isAuthorizedRole(['owner']),store)

module.exports = router