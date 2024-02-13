const express = require('express');
const { store, get, index, update, destroy, deleteAllCustomers } = require('../controllers/cutomerControllers');

const router = express.Router();


router.post('/customer/create',store)
router.get('/customer/view/:customer_id',get);
router.get('/customer/view',index);
router.put('/customer/update/:customer_id',update)
router.delete('/customer/delete/:customer_id',destroy)

router.route('/customer/delete').delete(deleteAllCustomers)





module.exports = router;
