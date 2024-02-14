const Owner = require('../models/ownerSchema')
const Branch = require('../models/branchSchema')
// const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const mongoose = require('mongoose')

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { receptionist } = req.body;

    if (!receptionist) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a receptionist ObjectId for the branch',
        });
    }
    if (!mongoose.Types.ObjectId.isValid(receptionist)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid receptionist ObjectId',
        });
    }

    const existingBranchWithReceptionist = await Branch.findOne({ receptionist });
    if (existingBranchWithReceptionist) {
        return res.status(400).json({
            success: false,
            message: 'This receptionist is already assigned to another branch',
        });
    }


    const newBranch = await Branch.create(req.body);


    res.status(201).json({
        success: true,
        message: 'Branch created successfully',
        data: newBranch,
    });
});


/**Get single Branch */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleBranch = await Branch.findById(req.params.id)
        .populate({
            path: 'receptionist',
            select: 'name'
        });

    if (!singleBranch) {
        return next(new ErrorHandler("Branch not found", 404));
    }
    res.status(200).json({
        success: true,
        singleBranch
    })
});

/**Get all branches */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const allBranches = await Branch.find();
    res.status(200).json({
        success: true,
        allBranches
    })
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
            message: 'branch not found',
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
        message: "receptionist deleted successfully!"
    });
})