const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const mongoose = require('mongoose');
const users = require('../models/userSchema');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


exports.store = catchAsyncErrors(async (req, res, next) => {
    const { branch_id, name, email, contact, password, hotel_id } = req.body;
    if (!contact || !branch_id || !name || !email || !email || !password || !hotel_id) {
        return next(new ErrorHandler('Fields missing', 400))
    }
    if (!mongoose.Types.ObjectId.isValid(branch_id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid branch ObjectId',
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newReceptionist = await users.create({ branch_id, name, email, password: hashedPassword, contact, role: "receptionist", hotel_id});

    res.status(200).json({
        messege: "Oeration successful",
        result: newReceptionist
    })


});

//Get all receptionist
exports.index = catchAsyncErrors(async (req, res, next) => {
    const receptionist = await users.find({ role: 'receptionist' });
    res.status(200).json({
        messege:"Operation successfull",
        result: receptionist
    })
})