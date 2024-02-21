const express = require('express');
const { store, index } = require('../controllers/roomCategoryControllers');
const { auth, isAuthorizedRole } = require('../middleware/authentication');
const router = express.Router();

router.post('/', auth, isAuthorizedRole(['owner', 'receptionist']), store)

router.get('/', auth, isAuthorizedRole(['owner', 'receptionist']),index)

module.exports = router;