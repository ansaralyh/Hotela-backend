const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.post('/crate',auth,isAuthorizedRole(['owner']),store);

/**Get single employee */
router.get('/:id',auth,isAuthorizedRole(['owner']),get);

/**Get all employees */
router.get('/',auth,isAuthorizedRole(['owner']),index);

/**Update employee */
router.put('/:id',auth,isAuthorizedRole(['owner']),update);


/**Delete employee */
router.delete('/delete/:id',destroy)
module.exports = router;