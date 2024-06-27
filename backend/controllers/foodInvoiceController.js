const FoodInvoice = require('../models/foodInvoiceSchema')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.createFoodInvoice = catchAsyncErrors(async (req,res,next)=>{
    const {name, items,branch_id} = req.body;
    if(!name || !items?.length > 0 || !branch_id){
       return next(new ErrorHandler('Fields Missing',404))
    }
    const total_amount = items.map(item => item.total_price).reduce((first,second)=> first+second ,0)
    const foodInvoice = await FoodInvoice.create({name,items,total_amount,hotel_id:req.user.hotel_id,branch_id})

    res.status(200).json({
        message: 'Operation Successfull',
        foodInvoice,
    })
})


exports.getAllFoodInvoices = catchAsyncErrors(async (req,res,next)=>{
    const branch_id = req.query.branch_id;
    if(!branch_id){
        return next(new ErrorHandler('Please provide branch id',404))
    }
    const foodInvoices = await FoodInvoice.find({branch_id}).populate('items.item_id');
    res.status(200).json({
        message:"Operational successfull",
        result:{
            items:foodInvoices,
            meta:{}
        }
    })
})

exports.getSingleFoodInvoice = catchAsyncErrors(async (req,res,next)=>{
    const id = req.params.id

    if(!id){
        return next(new ErrorHandler('Please provide invoice id',404))
    }
    const foodInvoice = await FoodInvoice.findById(id)
    res.status(200).json({
        message:"Operation successfull",
        result: foodInvoice
    })
})