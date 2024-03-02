const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Room = require('../models/roomModel')
const Reservations = require('../models/reservationSchema');
const { uploadFile } = require("../utils/uploadFiles")
const path = require("path")
const fs = require('fs')


exports.store = catchAsyncErrors(async (req, res, next) => {
    const { room_category, room_number } = req.body;
    const { image } = req.files;
    const uploadFolderPath = path.join(__dirname, "../uploads/room_images");
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
    if (!room_category || !room_number || !image) {
        return next(new ErrorHandler('Fields missing', 400))
    };
    const result = await Room.create({ room_category, room_number, image: req.body.image, hotel_id: req.user.hotel_id });
    res.status(201).json({
        message: "Operation Successful",
        result
    });
});



//Get all rooms 
exports.index = catchAsyncErrors(async (req, res, next) => {
    const { checkInDate, checkOutDate } = req.query;
    const query = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Validate that both check-in and check-out dates are provided
    if (!checkInDate || !checkOutDate) {
        return next(new ErrorHandler('Please provide both check-in and check-out dates', 400));
    }

    // Find reservations overlapping with the specified dates
    const existingReservations = await Reservations.find({
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
    }).distinct('room_id');

    // Find all rooms
    const rooms = await Room.find();

    // Filter available rooms
    const availableRooms = rooms.filter(room => !existingReservations.includes(room._id));

    res.status(200).json({
        message: 'Rooms availability checked successfully',
        availableRooms: availableRooms
    });
});


//function to find a room
exports.get = catchAsyncErrors(async (req, res, next) => {
    const room = await Room.findById(req.params.id).populate("room_category");
    if (!room) {
        return next(new ErrorHandler('Room not found', 404));
    }
    res.status(200).json({
        messege: "Operation successful",
        result: room
    })
})

//Function to reserve a room
exports.update = catchAsyncErrors(async (req, res, next) => {
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ErrorHandler('Room not found', 404));
    }
    room.isReserved = room.isReserved === 1 ? 0 : 1;
    await room.save();
    res.status(200).json({
        messege: "Room reserved successfully",
         result: room
    });
});
