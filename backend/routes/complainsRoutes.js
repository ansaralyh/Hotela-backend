const express = require('express');
const router = express.Router();
const {auth, isAuthorizedRole} = require('../middleware/authentication');
const { store, index, get, getAllCountComplains, updateComplainStatus } = require('../controllers/complainController');



router.post('/',auth,isAuthorizedRole(["owner","receptionist"]),store);
router.get('/',auth,isAuthorizedRole(["owner","receptionist"]),index)
router.get('/:id',auth,isAuthorizedRole(["owner","receptionist"]),get)
router.put('/:id',auth,isAuthorizedRole(["owner","receptionist"]),updateComplainStatus)


module.exports = router