const express=require("express")
const router=express.Router();

const ownerRoutes = require('./ownerRoute');
const branchRoutes = require('./branchRoute');
// const roomRoutes = require('./roomRoutes');
const employeeRoutes = require('./employeeRoute');
const customerRoutes = require('./customerRoutes');
const reservation = require('./reservedRoom.routes');

router.use("/users",ownerRoutes)
router.use("/branch",branchRoutes)
// router.use("/room",roomRoutes)
router.use("/employee",employeeRoutes)
router.use('/customer',customerRoutes);
// router.use('/reserve',reservation)


module.exports = router