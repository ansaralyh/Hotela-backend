// const ErrorHandler = require('../utils/ErrorHandler');
const branch = require('../models/branchSchema')
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const Receptionist = require('../models/receptionistSchema');

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm Password do not match',
        });
    }
    const existingReceptionist = await Receptionist.findOne({ email: req.body.email });
    if (existingReceptionist) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists',
        });
    }
    const newReceptionist = await Receptionist.create(req.body);


    res.status(201).json({
        success: true,
        newReceptionist,
    });

});


/**Get single receptionist */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleReceptionist = await Receptionist.findById(req.params.id);

    if (!singleReceptionist) {
        return next(new ErrorHandler(`Receptionist with this ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        singleReceptionist
    });
});



/**Get all receptionsts */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const allReceptionists = await Receptionist.find();

    if (!allReceptionists) {
        return next(new ErrorHandler("Receptionists not found", 404))
    }
    res.status(200).json({
        success: true,
        allReceptionists
    })
});



/** Update a receptionist */
exports.update = catchAsyncErrors(async (req, res, next) => {
    const receptionistId = req.params.id;
    const updateData = req.body;
    const updatedReceptionist = await Receptionist.findByIdAndUpdate(receptionistId, updateData, {
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
exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const removeReceptionist = await Receptionist.findById(req.params.id);
    if (!removeReceptionist) {
        return next(new ErrorHandler("receptionist not found", 404));

    }
    await Receptionist.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "receptionist deleted successfully!"
    });
});