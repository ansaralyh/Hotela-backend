const express = require('express');
const router = express.Router();
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, index, get, update, destroy } = require('../controllers/LookupTypeController');

router.post('/',store)
router.get('/',index)
router.get('/:id',get)
router.put('/:id',update)
router.delete('/:id',destroy)




module.exports = router