const express = require('express');
const router = express.Router();
const { auth, isAuthorizedRole } = require('../middleware/authentication');
const { store, index, get, update, destroy, getLookupsForDropdown } = require('../controllers/LookupController');

router.post('/',  store);
router.get('/', index);
router.get('/get/:id',getLookupsForDropdown)
router.get('/:id', get);
router.put('/:id',update);
router.delete('/:id', destroy);


module.exports = router;