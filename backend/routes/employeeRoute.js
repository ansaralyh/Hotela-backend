const express = require('express');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.post('/create',auth,isAuthorizedRole('owner'),store);

/**Get single employee */
router.get('/get/:id',get);

/**Get all employees */
router.get('/get',index);

/**Update employee */
router.put('/update/:id',update);


/**Delete employee */
router.delete('/delete/:employeeId',destroy)
module.exports = router;