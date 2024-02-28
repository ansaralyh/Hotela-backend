
const ErrorHandler = require('../utils/ErrorHandler');
const Reservations = require('../models/reservationSchema');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.store = catchAsyncErrors(async (req, res,next) =>{
    const {customer_id,checkInDate,checkOutDate,room_id,status} = req.body;
    if(!customer_id || !checkInDate || !checkOutDate || !room_id || !status){
        return next(new ErrorHandler("Fields missing",400))
    }
    const reservation = await Reservations.create(req.body);
    res.status(201).json({
        messege:"Operation successful",
        result:reservation
    })
})

exports.index = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) ||10; 
    const startIndex = (page - 1) * limit; 
    const reservations = await Reservations.find().skip(startIndex).limit(limit);
    if(!reservations){
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
