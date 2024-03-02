const Customer = require("../models/customerScehma");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create customer
exports.store = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    cnic,
    gender,
    email,
    branch_id,
    contact,
    city,
    currentAddress,
  } = req.body;

  if (
    !name ||
    !cnic ||
    !gender ||
    !email ||
    !branch_id ||
    !contact ||
    !city ||
    !currentAddress
  ) {
    return next(new ErrorHandler("Fields are missing", 400));
  }
  const result = await Customer.create({
    ...req.body,
    hotel_id: req.user.hotel_id,
  });
  res.status(201).json({
    messege: "Customer registered successfully",
    result,
  });
});

// Get single customer by customer_id

exports.get = catchAsyncErrors(async (req, res, next) => {
  try {
    const result = await Customer.findById(req.params.id)
      .populate("hotel_id")
      .populate("branch_id");

    if (!result) {
      return next(new ErrorHandler("No customer found with that Id", 404));
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Get all customers

exports.index = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const accessTokenBranchId = req.user.branch_id;

  const allCustomers = await Customer.find({ branch_id: accessTokenBranchId })
    .skip(startIndex)
    .limit(limit);

  if (!allCustomers) {
    return next(new ErrorHandler("Customers not found"));
  }

  res.status(200).json({
    success: true,
    result: allCustomers,
  });
});

//Update customer details
exports.update = catchAsyncErrors(async (req, res, next) => {
  const customer_id = req.params.id;
  const updatedFields = req.body;

  delete updatedFields.customer_id;

  const result = await Customer.findById(customer_id);

  if (!result) {
    return next(
      new ErrorHandler(`Customer not found with this ID: ${customer_id}`)
    );
  }

  Object.assign(result, updatedFields);
  await result.save();

  res.status(200).json({
    success: true,
    updatedCustomer: result,
  });
});

// Delete a customer by customer id

exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const customer_id = req.params.id;
  const result = await Customer.findByIdAndDelete(customer_id);
  if (!result) {
    return next(
      new ErrorHandler(`Customer not found with this ID: ${customer_id}`)
    );
  }
  res.status(200).json({
    message: "Customer removed successfully",
  });
});
