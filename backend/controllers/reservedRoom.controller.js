// reservationController.js
const Room = require('../models/roomSchema');
const Reservation = require('../models/reservedRoom.model');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.reserveRoom = catchAsyncErrors(async(req,res,next) => {
    console.log('Room reservation')
    const { roomId, bookingId, customerName, reservedBy, checkIn, checkOut, cnic, bedType, roomCategory, contactNumber, roomRate, paymentStatus } = req.body;

    try {
    
        const room = await Room.findOne({ _id: roomId, status: 'available' });
        console.log('Room:', room);

        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found or already reserved' });
        }

        // Create a reservation
        const reservationDetails = {
            reservedRoomDetails: {
                booking_Id: bookingId,
                customer_Name: customerName,
                reservedBy: reservedBy, 
                checkIn: checkIn,
                checkOut: checkOut
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
        console.log('Reservation:', reservation);

        // Update room status to reserved
        room.status = 'reserved';
        await room.save();
        await reservation.save();

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
