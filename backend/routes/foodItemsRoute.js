const express = require('express');
const { auth, isAuthorizedRole } = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/food-item-controller');

const router = express.Router();

/** Create food item */
router.post('/', auth, isAuthorizedRole(['owner', 'receptionist']), store);

/** Get single food item */
router.get('/:id', auth, isAuthorizedRole(['owner', 'receptionist']), get);

/** Get all food items */
router.get('/', auth, isAuthorizedRole(['owner', 'receptionist']), index);

/** Update food item */
router.put('/:id', auth, isAuthorizedRole(['owner', 'receptionist']), update);

/** Delete food item */
router.delete('/:id', auth, isAuthorizedRole(['owner', 'receptionist']), destroy);

module.exports = router;
