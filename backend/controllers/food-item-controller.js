const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const FoodItem = require('../models/foodItemSchema');

/** Create FoodItem */
exports.store = catchAsyncErrors(async (req, res, next) => {
    const { name, cnic, contact, itemObjectId } = req.body;

    const foodItem = await FoodItem.create({ name, cnic, contact, itemObjectId });
    res.status(200).json({
        message: "Operation successful",
        result: foodItem
    });
});

/** Get single food item by ID */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleFoodItem = await FoodItem.findById(req.params.id);
    if (!singleFoodItem) {
        return next(new ErrorHandler(`Food item with ID ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        message: "Operation successful",
        result: singleFoodItem
    });
});
    
/** Get all food items */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const allFoodItems = await FoodItem.find().skip(startIndex).limit(limit);
    if (!allFoodItems) {
        return next(new ErrorHandler("Food items not found", 404));
    }
    res.status(200).json({
        message: "Operation successful",
        result: allFoodItems
    });
});

/** Update food item */
exports.update = catchAsyncErrors(async (req, res, next) => {
    const foodItemId = req.params.id;
    const updateField = req.body;

    const updatedData = await FoodItem.findByIdAndUpdate(foodItemId, updateField, {
        new: true,
        runValidators: true
    });
    if (!updatedData) {
        return res.status(404).json({
            success: false,
            message: "Food item not found"
        });
    }
    await updatedData.save();
    res.status(200).json({
        message: "Operation successful",
        result: updatedData
    });
});

/** Delete a food item */
exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const foodItemId = req.params.id;

    const currentFoodItem = await FoodItem.findByIdAndDelete(foodItemId);
    if (!currentFoodItem) {
        return next(new ErrorHandler('Food item not found', 404));
    }

    res.status(200).json({
        message: 'Operation successful'
    });
});
