const express = require('express');
const auth = require('../middleware/authentication');
const { createEmployee, getSingleEmployee, getAllEmp, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

const router = express.Router();

/**Create employee */
router.route('/employee/create').post(createEmployee);

/**Get single employee */
router.route('/employee/view/:employeeId').get(getSingleEmployee);

/**Get all employees */
router.route('/employee/view').get(getAllEmp);

/**Update employee */
router.route('/employee/update/:employeeId').put(updateEmployee);


/**Delete employee */
router.route('/employee/delete/:employeeId').delete(deleteEmployee)
module.exports = router;