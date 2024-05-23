const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Items = require("../models/itemsSchema");

exports.store = catchAsyncError(async (req, res, next) => {
  const items = await Items.create(req.body);
  res.status(200).json({
    messege: "Operation successfull",
    result: items,
  });
});

// Retrieve all items
exports.index = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const branch_id = req.query.branch_id;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 400));
  }
  const startIndex = (page - 1) * limit;
  const items = await Items.find({ branch_id }).skip(startIndex).limit(limit);
  res.status(200).json({
    message: "Items retrieved successfully",
    result: items,
  });
});

// Retrieve a single item by ID
exports.get = catchAsyncError(async (req, res, next) => {
  const item = await Items.findById(req.params.id);
  if (!item) {
    return next(new ErrorHandler("Item not found", 404));
  }
  res.status(200).json({
    message: "Item retrieved successfully",
    result: item,
  });
});

// Update an existing item
exports.update = catchAsyncError(async (req, res, next) => {
  let item = await Items.findById(req.params.id);
  if (!item) {
    return next(new ErrorHandler("Item not found", 404));
  }
  item = await Items.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    message: "Item updated successfully",
    result: item,
  });
});

// Delete an item
exports.destroy = catchAsyncError(async (req, res, next) => {
  const item = await Items.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Item deleted successfully",
  });
});
