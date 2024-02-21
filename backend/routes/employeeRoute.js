const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.post('/',auth,isAuthorizedRole(['owner','receptionist']),store);

/**Get single employee */
router.get('/:id',auth,isAuthorizedRole(['owner','receptionist']),get);

/**Get all employees */
router.get('/',auth,isAuthorizedRole(['owner','receptionist']),index);

/**Update employee */
router.put('/:id',auth,isAuthorizedRole(['owner','receptionist']),update);

/**Delete employee */
router.delete('/:id',auth,isAuthorizedRole(['owner','receptionist']),destroy)
module.exports = router;