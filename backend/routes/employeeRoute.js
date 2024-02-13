const express = require('express');
const auth = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.post('/employee/create',store);

/**Get single employee */
router.get('/employee/view/:employeeId',get);

/**Get all employees */
router.get('/employee/view',index);

/**Update employee */
router.put('/employee/update/:employeeId',update);


/**Delete employee */
router.delete('/employee/delete/:employeeId',destroy)
module.exports = router;