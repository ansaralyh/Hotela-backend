const ErrorHandler = require('../utils/ErrorHandler');
const Reservations = require('../models/reservationSchema');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

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
    const reservations = await Reservations.find().skip(startIndex).limit(limit);
    if (!reservations) {
        return next(new ErrorHandler("Reservations not found", 404));
    }
    res.status(200).json({
        message: 'All reservations retrieved successfully',
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

exports.checkAvailability = catchAsyncErrors(async (req, res, next) => {
    const { room_id, checkInDate, checkOutDate } = req.body;

    const existingReservation = await Reservations.findOne({
        room_id: room_id,
        $or: [
            { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
            { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
            { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } }
        ]
    });

    if (existingReservation) {
        return res.status(200).json({ available: false, message: "Room is already reserved for the selected dates" });
    } else {
        return res.status(200).json({ available: true, message: "Room is available for the selected dates" });
    }
});