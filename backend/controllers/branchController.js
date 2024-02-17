
const Branch = require('../models/branchSchema')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')


exports.store = catchAsyncErrors(async (req, res, next) => {
    const { name, location,description,branchImage} = req.body;
    if(!name || !location || !branchImage || !description) {
        return next(new ErrorHandler("Fields missing",400))
    }

    const newBranch = await Branch.create({name, location,description,branchImage,hotel_id:req.user.id});


    res.status(201).json({
        message: 'Branch created successfully',
        result: newBranch,
    });
});


/**Get single Branch */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleBranch = await Branch.findById(req.params.id)
       

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
        messege:"Operation successfulll",
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