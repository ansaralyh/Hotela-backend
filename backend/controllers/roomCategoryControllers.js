const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Category = require('../models/roomCategorySchema')


exports.store = catchAsyncErrors(async (req, res, next) => {

    const { cost, name, occupancy, hotel_id, ammenities } = req.body;
    if (!cost || !name || !occupancy || !hotel_id || !ammenities) {
        return next(ErrorHandler("Fields missing"), 400)
    }
    const result = await Category.create({ cost, name, occupancy, hotel_id: req.user.id, ammenities });

    res.status(201).json({
        message: "Operation Successfull",
        result
    })
})

exports.index = catchAsyncErrors(async (req, res, next) => {
    
    const categories = await Category.find({ hotel_id:req.user.id })

    res.status(200).json({
        message: "Operation Successfull",
        result: categories
    })

})