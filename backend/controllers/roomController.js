const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Room = require('../models/roomModel')

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { room_category, room_number, image, hotel_id } = req.body;
    if (!room_category || !room_number || !image || !hotel_id) {
        return next(new ErrorHandler('Fields missing', 400))
    };
    const result = await Room.create({ room_category, room_number, image, hotel_id: req.user.id });
    res.status(201).json({
        message: "Operation Successfull",
        result
    })
});