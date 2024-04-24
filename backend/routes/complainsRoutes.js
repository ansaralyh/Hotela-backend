const express = require('express');
const router = express.Router();
const {auth, isAuthorizedRole} = require('../middleware/authentication');
const { store, index, get, getAllCountComplains } = require('../controllers/complainController');



router.post('/',auth,isAuthorizedRole(["owner","receptionist"]),store);
router.get('/',auth,isAuthorizedRole(["owner","receptionist"]),index)
router.get('/:id',auth,isAuthorizedRole(["owner","receptionist"]),get)
// router.get('/count',auth,isAuthorizedRole(["owner","receptionist"]),getAllCountComplains)



module.exports = router