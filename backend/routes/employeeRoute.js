const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.post('/create',auth,isAuthorizedRole(['owner']),store);

/**Get single employee */
router.get('/get/:id',auth,isAuthorizedRole(['owner']),get);

/**Get all employees */
router.get('/index',auth,isAuthorizedRole(['owner']),index);

/**Update employee */
router.put('/update/:id',auth,isAuthorizedRole(['owner']),update);


/**Delete employee */
router.delete('/delete/:id',destroy)
module.exports = router;