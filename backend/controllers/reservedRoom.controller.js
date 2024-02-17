const Room = require('../models/roomCategorySchema.model');
const Reservation = require('../models/reservedRoom.model');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
// const ErrorHandler = require('../utils/ErrorHandler');


exports.reserveRoom = catchAsyncErrors(async (req, res, next) => {
    
    try {
        const { reservedRoomDetails, otherDetails } = req.body;

        const { room_id ,booking_Id,customer_Name,reservedBy,checkIn,checkOut} = reservedRoomDetails;
        const {cnic, bedType, roomCategory, contact_Number, roomRate, payment_Status } = otherDetails;

        

      
        const room = await Room.findOne({ _id: room_id, room_status: 'available' });
        // console.log(room_id)
        console.log(room);

        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found or already reserved' });
        }

       
        const existingReservation = await Reservation.findOne({ 'reservedRoomDetails.room_id': room_id });
        // console.log(existingReservation)
        if (existingReservation) {
            return res.status(400).json({ success: false, message: 'Room is already reserved' });
        }

        // Create a reservation
        const reservation = await createReservation(booking_Id, customer_Name, reservedBy, checkIn, checkOut, cnic, bedType, roomCategory, contact_Number, roomRate, payment_Status, room_id);

        res.status(200).json({
            success: true,
            message: 'Room reserved successfully',
            reservation
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
        next(error);
    }
});


// Function to create a reservation
const createReservation = async (bookingId, customerName, reservedBy, checkIn, checkOut, cnic, bedType, roomCategory, contactNumber, roomRate, paymentStatus, room_id) => {
    const reservationDetails = {
        reservedRoomDetails: {
            booking_Id: bookingId,
            customer_Name: customerName,
            reservedBy: reservedBy,
            checkIn: checkIn,
            checkOut: checkOut,
            room_id: room_id
        },
        otherDetails: {
            cnic: cnic,
            bedType: bedType,
            roomCategory: roomCategory,
            contact_Number: contactNumber,
            roomRate: roomRate,
            payment_Status: paymentStatus
        }
    };

    const reservation = new Reservation(reservationDetails);
    await reservation.save();

    // Updating room status to reserved
    const updatedRoom = await Room.findByIdAndUpdate(room_id, { room_status: 'reserved' }, { new: true });

    return reservation;
};

//Upadte reserve room
exports.updateReservedRoom = catchAsyncErrors(async (req, res, next) => {
    const reservedRoomId = req.params.room_id; 
    // console.log(reservedRoomId);
    const updateData = req.body;
    // console.log(req.body);
    const updatedData = await Reservation.findByIdAndUpdate(reservedRoomId, updateData, {
        new: true,
        runValidators: true
    });
    // console.log(updatedData);
    if (!updatedData) {
        return next(new ErrorHandler('Reserved room not found'), 404);
    }

    res.status(200).json({
        success: true,
        updateData
    });
});



//Delete anyr reserved room
exports.deleteReservedRoom = catchAsyncErrors(async (req, res, next) => {
    const { reservationId } = req.params;

    try {
        const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

        if (!deletedReservation) {
            return res.status(404).json({ success: false, message: 'Reserved room not found' });
        }

    //updating the room status back to 'available'
        const room_id = deletedReservation.reservedRoomDetails.room_id;
        await Room.findByIdAndUpdate(room_id, { room_status: 'available' });

        res.status(200).json({
            success: true,
            message: 'Reserved room deleted successfully'
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
        next(error);
    }
});



//Get all reserved rooms from

exports.getAllReservedRooms = catchAsyncErrors(async (req, res, next) => {
    try {
        const reservedRooms = await Reservation.find();

        res.status(200).json({
            success: true,
            count: reservedRooms.length,
            reservedRooms
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
        next(error);
    }
});


//Get single resved room
exports.getSingleReservedRoom = catchAsyncErrors(async (req, res, next) => {
    const { reservationId } = req.params;

    try {
        const reservedRoom = await Reservation.findById(reservationId);

        if (!reservedRoom) {
            return res.status(404).json({ success: false, message: 'Reserved room not found' });
        }

        res.status(200).json({
            success: true,
            reservedRoom
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
        next(error);
    }
});
