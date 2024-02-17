const express=require("express")
const router=express.Router();

const ownerRoutes = require('./ownerRoute');
const branchRoutes = require('./branchRoute');
const employeeRoutes = require('./employeeRoute');
const customerRoutes = require('./customerRoutes');

router.use("/users",ownerRoutes)
router.use("/branch",branchRoutes)
router.use("/employee",employeeRoutes)
router.use('/customer',customerRoutes);


module.exports = router