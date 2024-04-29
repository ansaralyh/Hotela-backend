const express=require("express")
const router=express.Router();

const ownerRoutes = require('./userRoutes');
const branchRoutes = require('./branchRoute');
const employeeRoutes = require('./employeeRoute');
const customerRoutes = require('./customerRoutes');
const categoryRoutes = require('./roomCategoryRoutes');
const roomRoutes = require('./roomRoutes');
const receptionistRoutes = require('./receptionistRoutes')
const hotelRoutes = require('./hotelRoutes');
const reservationRoutes = require('./reservationRoutes');
const itemsRoutes = require('./itemsRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const complainsRoutes = require('./complainsRoutes')
const lookupTypeRoutes = require('./LookuptypeRoute')




router.use('/hotel',hotelRoutes)
router.use("/users",ownerRoutes)
router.use("/branch",branchRoutes)
router.use("/employee",employeeRoutes)
router.use('/customer',customerRoutes)
router.use('/category',categoryRoutes)
router.use('/room',roomRoutes)
router.use('/receptionist',receptionistRoutes)
router.use('/reservation',reservationRoutes)
router.use('/items',itemsRoutes)
router.use('/invoice',invoiceRoutes)    
router.use('/complains',complainsRoutes)
router.use('/lookupType',lookupTypeRoutes)

module.exports = router