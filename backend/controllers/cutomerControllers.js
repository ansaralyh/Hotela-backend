const Customer = require("../models/customerScehma");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { Query } = require("mongoose");

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
    current_address,
    permanent_address,
    marital_status,
  } = req.body;

  if (
    !name ||
    !cnic ||
    !gender ||
    !email ||
    !branch_id ||
    !contact ||
    !city ||
    !current_address ||
    !permanent_address ||
    !marital_status
  ) {
    return next(new ErrorHandler("Fields are missing", 400));
  }

  const emailExists = await Customer.findOne({ branch_id, email });
  if (emailExists) {
    return next(
      new ErrorHandler("Customer with this email already registered")
    );
  }
  const cnicExists = await Customer.findOne({ branch_id, cnic });
  if (cnicExists) {
    return next(new ErrorHandler("Customer with this CNIC already registered"));
  }
  const result = await Customer.create({
    ...req.body,
    hotel_id: req.user.hotel_id,
  });
  res.status(200).json({
    messege: "Customer registered successfully",
    result,
  });
});

// Get single customer by customer_id

exports.get = catchAsyncErrors(async (req, res, next) => {
  try {
    const result = await Customer.findById(req.params.id)
      .populate("hotel_id")
      .populate("branch_id")
      .populate("gender")
      .populate("marital_status");

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
  const branch_id = req.query.branch_id;

  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id"));
  }
  const allCustomers = await Customer.find({ branch_id })
    .populate("gender")
    .populate("marital_status")
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    result: {
      items: allCustomers,
      meta: {},
    },
  });
});

exports.dropdown = catchAsyncErrors(async (req, res, next) => {
  const cnic = req.query.cnic;
  const branch_id = req.query.branch_id;

  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 400));
  }
  const query = {};
  query.branch_id = branch_id;
  if (cnic) {
    query.cnic = { $regex: new RegExp(cnic, "i") };
  }

  const customers = await Customer.find(query);
  res.status(200).json({
    message: "operation successfull",
    result: customers,
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
