const ErrorHandler = require('../utils/ErrorHandler');
const branch = require('../models/branchSchema')
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const receptionist = require('../models/receptionistSchema');

exports.createReceptionist = catchAsyncErrors(async (req, res, next) => {
    const { name, password, confirmPassword, phoneNumber, dob } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm Password do not match',
        });
    }

    const newReceptionist = new receptionist({
        name,
        password,
        confirmPassword,
        phoneNumber,
        dob,
    });

    await newReceptionist.save();

    res.status(201).json({
        success: true,
        newReceptionist,
    });
});

/**Get single receptionist */

exports.getSingleReceptionist = catchAsyncErrors(async (req, res, next) => {
    const singleReceptionist = await receptionist.findById(req.params.id);
    
    if (!singleReceptionist) {
        return next(new ErrorHandler(`Receptionist with this ${req.params.id} not found`, 404));
    }
    
    res.status(200).json({
        success: true,
        singleReceptionist
    });
});



/**Get all receptionsts */

exports.getAllReceptionist = catchAsyncErrors(async (req,res,next) => {
    const allReceptionists = await receptionist.find();

    if(!allReceptionists){
        return next(new ErrorHandler("Receptionists not found",404))
    }
    res.status(200).json({
        success: true,
        allReceptionists
    })
});



/** Update a receptionist */
exports.updateReceptionist = catchAsyncErrors(async (req, res, next) => {
    const receptionistId = req.params.id;
    const updateData = req.body; 
    const updatedReceptionist = await receptionist.findByIdAndUpdate(receptionistId, updateData, {
        new: true, 
        runValidators: true, 
    });

    if (!updatedReceptionist) {
        return res.status(404).json({
            success: false,
            message: 'Receptionist not found',
        });
    }

    res.status(200).json({
        success: true,
        updatedReceptionist,
    }); 
});

/**Delete receptionist  */

exports.deleteReceptionist = catchAsyncErrors(async (req, res, next) => {
    const removeReceptionist = await receptionist.findById(req.params.id);
    if(!removeReceptionist)
    {
        return next(new ErrorHandler("receptionist not found",404));

    }
    await receptionist.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "receptionist deleted successfully!"
    });
});