const express = require('express');
const { store, index,get,update,destroy,dropdown } = require('../controllers/roomCategoryControllers');
const { auth, isAuthorizedRole } = require('../middleware/authentication');
const router = express.Router();

router.post('/', auth, isAuthorizedRole(['owner', 'receptionist']), store)

router.get('/all', auth, isAuthorizedRole(['owner', 'receptionist']),index)
router.get('/dropdown', auth, isAuthorizedRole(['owner', 'receptionist']),dropdown)

router.get('/:id', auth, isAuthorizedRole(['owner', 'receptionist']),get)


router.put('/:id', auth, isAuthorizedRole(['owner', 'receptionist']),update)

router.delete('/:id', auth, isAuthorizedRole(['owner', 'receptionist']),destroy)

module.exports = router;