const Owner = require('../models/ownerSchema')
const branch = require('../models/branchSchema')
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

exports.createBranch = catchAsyncErrors(async (req, res, next) => {
    
    const {
        branch_id,
        name,
        receptionists,
        location,
        description,
        branchImage
    } = req.body;
        
    const newBranch = new branch({
        branch_id,
        name,
        receptionists,
        location,
        description,
        branchImage,
      });
      await newBranch.save();
      res.status(201).json({
         message: 'Branch created successfully',
         data: newBranch });
});

/**Get single Branch */
exports.getSingleBranch = catchAsyncErrors(async (req, res, next) =>{
    const singleBranch = await branch.findById(req.params.id);
    if(!singleBranch)
    {
        return next(new ErrorHandler("Branch not found",404));
    }
    res.status(200).json({
        success:true,
        singleBranch
    })
});

/**Get all branches */
exports.getAllBranches = catchAsyncErrors(async (req,res,next) => {
    const allBranches = await branch.find();

    if(!allBranches){
        return next(new ErrorHandler("Branches not found",404))
    }
    res.status(200).json({
        success: true,
        allBranches
    })
});

/**Update a Branch */

exports.updateBranch = catchAsyncErrors(async (req, res, next) => {
    const branchId = req.params.id;
    const updateData = req.body; 
    const updatedBranch = await branch.findByIdAndUpdate(branchId, updateData, {
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
exports.deleteBranch = catchAsyncErrors(async (req, res, next) => {
    const removeBranch = await branch.findById(req.params.id);
    if(!removeBranch)
    {
        return next(new ErrorHandler("branch not found",404));

    }
    await branch.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "receptionist deleted successfully!"
    });
})