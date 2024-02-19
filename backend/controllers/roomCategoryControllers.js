const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Category = require('../models/roomCategorySchema')


exports.store = catchAsyncErrors(async (req, res, next) => {

    const { cost, name, occupancy, ammenities } = req.body;
    if (!cost || !name || !occupancy  || !ammenities) {
        return next(ErrorHandler("Fields missing"), 400)
    }
    const result = await Category.create({ cost, name, occupancy, hotel_id:req.user.hotel_id, ammenities });

    res.status(201).json({
        message: "Operation Successfull",
        result
    })
})  

exports.index = catchAsyncErrors(async (req, res, next) => {

    const categories = await Category.find({ hotel_id:req.user.hotel_id})

    res.status(200).json({
        message: "Operation Successfull",
        result: categories
    })

});
