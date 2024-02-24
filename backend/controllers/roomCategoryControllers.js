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
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) ||10; 
    const startIndex = (page - 1) * limit; 
    const categories = await Category.find({ hotel_id:req.user.hotel_id}).skip(startIndex).limit(limit);

    res.status(200).json({
        message: "Operation Successfull",
        result: categories
    })

});


exports.get = catchAsyncErrors(async (req, res, next) => {
    const roomCategoryId = req.params.id;
    const category = await Category.findById(roomCategoryId);
    if (!category) {
        return next(new ErrorHandler('Reservation not found', 404));
    }
    res.status(200).json({
        message: 'Reservation found',
        result: category
    });
});

exports.update = catchAsyncErrors(async (req, res, next) => {
    const roomCategoryId = req.params.id;
    const updateData = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(roomCategoryId, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      }
      
  res.status(200).json({
    success: true,
    updatedCategory,
  });
  });

  exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const removeCategory = await Category.findById(req.params.id);
    if (!removeCategory) {
      return next(new ErrorHandler("category not found", 404));
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Category deleted successfully!",
    });
  });