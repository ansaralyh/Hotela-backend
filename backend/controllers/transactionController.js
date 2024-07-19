const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Reservation = require('../models/reservationSchema')
const Invoice = require('../models/foodInvoiceSchema');
const ErrorHandler = require("../utils/ErrorHandler");

exports.getAllTransactions = catchAsyncErrors(async (req,res,next)=>{
    const branch_id = req.query.branch_id
    if(!branch_id){
        return next(new ErrorHandler('Please provide branch id',404))
    }

    const reservations = await Reservation.find({branch_id,hotel_id: req.user.hotel_id}).populate('customer_id')
    const invoices = await Invoice.find({branch_id,hotel_id: req.user.hotel_id})

    const result = []

    reservations.forEach((reservation)=>{
        result.push({name:reservation.customer_id.name,amount:reservation.invoice.total_amount})
    })
    invoices.forEach((invoice)=>{
        result.push({name:invoice.name,amount:invoice.total_amount})
    })

    res.status(200).json({
        message:"Operation Successfull",
        result
    })
})