const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const mongoose = require("mongoose");
const users = require("../models/userSchema");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

exports.store = catchAsyncErrors(async (req, res, next) => {
  const { branch_id, name, email, contact, password, hotel_id, dateOfBirth } =
    req.body;
  if (!contact || !branch_id || !name || !email || !password || !hotel_id) {
    return next(new ErrorHandler("Fields missing", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(branch_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid branch ObjectId",
    });
  }

  const existingReceptionist = await users.findOne({ branch_id, role: "receptionist" });
  if (existingReceptionist) {
    return res.status(400).json({
      success: false,
      message: "Receptionist already associated with this branch",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;
  const newReceptionist = await users.create({
    branch_id,
    name,
    email,
    password: hashedPassword,
    contact,
    role: "receptionist",
    hotel_id,
    dateOfBirth,
  });

  res.status(200).json({
    message: "Operation successful",
    result: newReceptionist,
  });
});


//Get all receptionist
exports.index = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) ||10; 
  const startIndex = (page - 1) * limit; 
  const receptionist = await users.find({ role: "receptionist" }).skip(startIndex).limit(limit);
  if(!receptionist){
    return next(new ErrorHandler("Receptionist not found", 404));
  }
  res.status(200).json({
    messege: "Operation successfull",
    result: receptionist,
  });
});

//Get single receptionist
exports.get = catchAsyncErrors(async (req, res, next) => {
  const receptionist = await users.findById(req.params.id);
  if (!receptionist) {
    return next(new ErrorHandler("receptionist", 404));
  }
  res.status(200).json({
    messege: "Operation successful!",
    result: receptionist,
  });
});

/**update receptionist */

exports.update = catchAsyncErrors(async (req, res, next) => {
  const receptionist = await users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!receptionist) {
    return next(new ErrorHandler("receptionist", 404));
  }
  res.status(200).json({
    messege: "Operation successful!",
    result: receptionist,
  });
});

// delete  a receptionist

exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const receptionist = await users.findByIdAndDelete(req.params.id);
  if (!receptionist) {
    return next(new ErrorHandler("receptionist not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Operation successfully!",
  });
});
