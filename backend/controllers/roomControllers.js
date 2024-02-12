const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const room = require('../models/roomSchema');
const ApiFeatures = require("../utils/apiFeatures");

exports.createRoom = catchAsyncErrors(async (req, res, next) => {
    const { roomId, roomRate, roomCategory, roomNumber, bedType, occupancy, amenities, roomImage, room_status } = req.body;

    const newRoom = new room({
        roomId,
        roomRate,
        roomCategory,
        roomNumber,
        bedType,
        occupancy,
        amenities,
        roomImage,
        room_status
    });
    await newRoom.save();
    res.status(201).json({
        success: true,
        newRoom
    });
});


/**Get single room by roomID */
exports.getSingleRoom = catchAsyncErrors(async (req, res, next) => {
    const singleRoom = await room.findOne({ roomId: req.params.roomId }).populate('roomId');

    if (!singleRoom) {
        const error = new Error(`Room with ID ${req.params.roomId} not found`, 404);
        return next(error);
    }

    res.status(200).json({
        success: true,
        singleRoom,
    });
});

//Get all rooms

exports.getAllRooms = catchAsyncErrors(async (req, res, next) => {
    const rooms = await room.find();
    if(!rooms){
        return next(new ErrorHandler("Rooms not found",404))
    }
    res.status(201).json({
        success:true,
        rooms
    })
});


// Get all available rooms  
exports.getAllAvailableRooms = async (req, res, next) => {
    try {
        console.log('API is working fine')
        const availableRooms = await room.find({room_status:'available'});
        
        if (!availableRooms || availableRooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No rooms with available status found"
            });
        }
        res.status(200).json({
            success: true,
            availableRooms
        });
    } catch (error) {
        console.log(error)
        return next(error);
    }
};



/** Update room */
exports.updateRoom = catchAsyncErrors(async (req, res, next) => {
    const roomId = req.params.roomId;
    const updatedFields = req.body;

    const existingRoom = await room.findOne({ roomId });

    if (!existingRoom) {
        const error = new Error(`Room with ID ${roomId} is not found`);
        error.status = 404;
        return next(error);
    }

    Object.assign(existingRoom, updatedFields);
    await existingRoom.save();

    res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        updatedRoom: existingRoom,
    });
});

/**Delete room */
exports.deleteRoom = catchAsyncErrors(async (req, res, next) => {
    const roomId = req.params.roomId;
    const existingRoom = await room.findOne({ roomId });

    if (!existingRoom) {
        const error = new Error(`Room with ID ${roomId} is not found`);
        error.status = 404;
        return next(error);
    }

    await room.deleteOne({ roomId });

    res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
    });
});


