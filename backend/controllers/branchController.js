const Branch = require("../models/branchSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const { uploadFile } = require("../utils/uploadFiles");
const path = require("path");


exports.store = catchAsyncErrors(async (req, res, next) => {
  const { name, location, description } = req.body;

  const { image } = req.files;
  const uploadFolderPath = path.join(__dirname, "../uploads/branch_image");
  if (image) {
    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath, { recursive: true });
    }
    const fileName = image.name;
    const imagePath = path.join(uploadFolderPath, fileName);
    await image.mv(imagePath);
    const imageUrl = `${req.protocol}://${req.get("host")}/${fileName}`;
    req.body.image = imageUrl;
  }

  if (!name || !location || !image || !description) {
    return next(new ErrorHandler("Fields missing", 400));
  }

  const newBranch = await Branch.create({
    name,
    location,
    description,
    image: req.body.image,
    hotel_id: req.user.hotel_id,
  });

  res.status(201).json({
    message: "Branch created successfully",
    result: newBranch,
  });
});

/**Get single Branch */
exports.get = catchAsyncErrors(async (req, res, next) => {
  const singleBranch = await Branch.findById(req.params.id);

  if (!singleBranch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  res.status(200).json({
    success: true,
    result: singleBranch,
  });
});

/**Get all branches */
exports.index = catchAsyncErrors(async (req, res, next) => {
  const allBranches = await Branch.find();
  if(!allBranches){
    return next(new ErrorHandler("Branches not found", 404));
  }
  res.status(200).json({
    messege: "Operation successfulll",
    result:allBranches,
  });
});

/**Update a Branch */

exports.update = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;
  const updateData = req.body;
  const updatedBranch = await Branch.findByIdAndUpdate(branchId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBranch) {
    return res.status(404).json({
      success: false,
      message: "branch not found",
    });
  }

  res.status(200).json({
    success: true,
    updatedBranch,
  });
});

/**Delete a branch */
exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const removeBranch = await Branch.findById(req.params.id);
  if (!removeBranch) {
    return next(new ErrorHandler("branch not found", 404));
  }
  await Branch.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "branch deleted successfully!",
  });
});
