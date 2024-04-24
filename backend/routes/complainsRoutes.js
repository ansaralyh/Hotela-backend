const express = require('express');
const router = express.Router();
const {auth, isAuthorizedRole} = require('../middleware/authentication');
const { store, index } = require('../controllers/complainController');



router.post('/',auth,isAuthorizedRole(["owner","receptionist"]),store);
router.get('/',auth,isAuthorizedRole(["owner","receptionist"]),index)


module.exports = router