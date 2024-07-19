const express = require('express')
const { getAllTransactions } = require('../controllers/transactionController')
const { auth, isAuthorizedRole } = require('../middleware/authentication')

const router = express.Router()


router.get('/',auth,isAuthorizedRole(['owner','receptionist']),getAllTransactions)


module.exports = router