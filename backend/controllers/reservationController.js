const ErrorHandler = require('../utils/ErrorHandler');
const Reservations = require('../models/reservationSchema');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Rooms = require('../models/roomModel')

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { customer_id, checkInDate, checkOutDate, room_id, status } = req.body;
    if (!customer_id || !checkInDate || !checkOutDate || !room_id || !status) {
        return next(new ErrorHandler("Fields missing", 400));
    }

    const existingReservation = await Reservations.findOne({
        room_id: room_id,
        $or: [
            { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
            { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
            { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } }
        ]
    });

    if (existingReservation) {
        return next(new ErrorHandler("Room is already reserved for the selected dates", 400));
    }

    const reservation = await Reservations.create({ customer_id, checkInDate, checkOutDate, room_id, status });
    res.status(201).json({
        message: "Operation successful",
        result: reservation
    });
});

exports.index = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Extract check-in and check-out dates from query parameters
    const query = {};
    if (req.query.checkInDate
        && req.query.checkOutDate) {
        query.checkInDate = { $lte: req.query.checkInDate }
        query.checkOutDate = { $gte: req.query.checkOutDate }
    }
    // Fetch reservations based on query and pagination
    const reservations = await Reservations.find(query).skip(startIndex).limit(limit);

    if (!reservations || reservations.length === 0) {
        return next(new ErrorHandler("No reservations found for the provided dates", 404));
    }

    res.status(200).json({
        message: 'Reservations retrieved successfully',
        result: reservations
    });
});



exports.get = catchAsyncErrors(async (req, res, next) => {
    const reservationId = req.params.id;
    const reservation = await Reservations.findById(reservationId);
    if (!reservation) {
        return next(new ErrorHandler('Reservation not found', 404));
    }
    res.status(200).json({
        message: 'Reservation found',
        result: reservation
    });
});

exports.update = catchAsyncErrors(async (req, res, next) => {
    const reservationId = req.params.id;
    const updateData = req.body;
    const updatedReservation = await Reservations.findByIdAndUpdate(reservationId, updateData, { new: true });
    if (!updatedReservation) {
        return next(new ErrorHandler('Reservation not found', 404));
    }
    res.status(200).json({
        message: 'Reservation updated successfully',
        result: updatedReservation
    });
});

exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const reservationId = req.params.id;
    const deletedReservation = await Reservations.findByIdAndDelete(reservationId);
    if (!deletedReservation) {
        return next(new ErrorHandler('Reservation not found', 404));
    }
    res.status(200).json({
        message: 'Reservation deleted successfully',
        result: deletedReservation
    });
});

// exports.checkAvailability = catchAsyncErrors(async (req, res, next) => {
//     const { checkInDate, checkOutDate } = req.body;

//     // Fetch all rooms
//     const rooms = await Rooms.find();

//     // Array to store available rooms
//     const availableRooms = [];

//     // Check availability for each room
//     for (const room of rooms) {
//         const existingReservation = await Reservations.findOne({
//             room_id: room._id,
//             $or: [
//                 { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
//                 { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
//                 { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } }
//             ]
//         });

//         // If no existing reservation found, room is available
//         if (!existingReservation) {
//             availableRooms.push(room);
//         }
//     }

//     // If there are available rooms, respond accordingly
//     if (availableRooms.length > 0) {
//         res.status(200).json({ available: true, message: "Rooms are available for the selected dates", rooms: availableRooms });
//     } else {
//         res.status(200).json({ available: false, message: "No rooms available for the selected dates" });
//     }
// });