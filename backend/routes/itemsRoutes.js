const express = require('express');
const router = express.Router();
const {auth,isAuthorizedRole} = require('../middleware/authentication');

const { store, index, get, update, destroy, foodItemsForDropdown } = require('../controllers/itemsControllers')

router.post('/',auth,isAuthorizedRole(['owner','receptionist']),store)
router.get('/',auth,isAuthorizedRole(['owner','receptionist']),index)
router.get('/dropdown',auth,isAuthorizedRole(['owner','receptionist']),foodItemsForDropdown)
router.get('/:id',auth,isAuthorizedRole(['owner','receptionist']),get)
router.put('/:id',auth,isAuthorizedRole(['owner','receptionist']),update)
router.delete('/:id',auth,isAuthorizedRole(['owner','receptionist']),destroy)


module.exports = router