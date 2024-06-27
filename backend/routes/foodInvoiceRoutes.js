const express = require('express')
const { getAllFoodInvoices, createFoodInvoice, getSingleFoodInvoice } = require('../controllers/foodInvoiceController')
const { auth, isAuthorizedRole } = require('../middleware/authentication')

const router = express.Router()

router.get('/',auth,isAuthorizedRole(['owner', 'receptionist']),getAllFoodInvoices)
router.post('/',auth,isAuthorizedRole(['owner', 'receptionist']),createFoodInvoice)
router.get('/:id',auth,isAuthorizedRole(['owner', 'receptionist']),getSingleFoodInvoice)

module.exports = router