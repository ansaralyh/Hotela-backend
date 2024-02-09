const express = require('express');
const { createCustomer, getSingleCustomer, getAllCustomers, updateCustomer, deleteCustomer, deleteAllCustomers } = require('../controllers/cutomerControllers');

const router = express.Router();


router.route('/customer/create').post(createCustomer)
router.route('/customer/view/:customer_id').get(getSingleCustomer);
router.route('/customer/view').get(getAllCustomers)
router.route('/customer/update/:customer_id').post(updateCustomer)
router.route('/customer/delete/:customer_id').delete(deleteCustomer)
router.route('/customer/delete').delete(deleteAllCustomers)





module.exports = router;
