const express=require("express")
const router=express.Router();

const ownerRoutes = require('./userRoutes');
const branchRoutes = require('./branchRoute');
const employeeRoutes = require('./employeeRoute');
const customerRoutes = require('./customerRoutes');
const categoryRoutes = require('./roomCategoryRoutes');
const roomRoutes = require('./roomRoutes');
const receptionistRoutes = require('./receptionistRoutes');
const hotelRoutes = require('./hotelRoutes');
const reservationRoutes = require('./reservationRoutes');
const itemsRoutes = require('./itemsRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const complainsRoutes = require('./complainsRoutes');
const lookupTypeRoutes = require('./LookuptypeRoute');
const lookupsRoutes = require('./lookupsRoute');
const foodInvoiceRoutes = require('./foodInvoiceRoutes');
const expensesRoutes = require('./expensesRoutes')
const transactionRoutes = require('./transactionRoutes')


router.use('/hotel',hotelRoutes)
router.use("/users",ownerRoutes)
router.use("/branch",branchRoutes)
router.use("/employee",employeeRoutes)
router.use('/customers',customerRoutes)
router.use('/category',categoryRoutes)
router.use('/room',roomRoutes)
router.use('/receptionist',receptionistRoutes)
router.use('/reservation',reservationRoutes)
router.use('/food-items',itemsRoutes)
router.use('/invoice',invoiceRoutes)    
router.use('/complains',complainsRoutes)
router.use('/lookup-type',lookupTypeRoutes)
router.use('/lookup',lookupsRoutes)
router.use('/food-invoices',foodInvoiceRoutes)
router.use('/expenses',expensesRoutes)
router.use('/transactions',transactionRoutes)

module.exports = router