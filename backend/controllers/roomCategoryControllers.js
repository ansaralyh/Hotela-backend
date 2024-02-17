const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Category = require('../models/roomCategorySchema')


exports.store = catchAsyncErrors(async (req,res,next)=>{
    
    const {cost,name,occupancy,hotel_id,ammenities} = req.body;
    if(!cost || !name || !occupancy || !hotel_id || !ammenities){
        return next(ErrorHandler("Fields missing"),400)
    }
    const result = await Category.create(req.body);

    res.status(201).json({
        message:"Operation Successfull",
        result
    })
})

exports.index = catchAsyncErrors(async (req,res,next)=>{
    const {hotel_id} = req.body

    if(!hotel_id){
        return next(ErrorHandler("Fields missing"),400)
    }
    const categories = await Category.find({hotel_id})

    res.status(200).json({
        message:"Operation Successfull",
        result: categories
    })

})