const mongoose = require('mongoose');

const reservedRoomSchema = new mongoose.Schema({
    reservedRoomDetails: {
        booking_Id: {
            type: Number,
            // required: [true, 'Please enter a booking ID']
        },
        customer_Name: {
            type: String,
            // required: [true, 'Please enter a customer name']
        },
        reservedBy: {
            type: String,
            // required: [true, 'Please enter who reserved the room']
        },
        checkIn: {
            type: Date,
            // required: [true, 'Please enter check-in date']
        },
        checkOut: {
            type: Date,
            // required: [true, 'Please enter check-out date']
        },
        room_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'room',
            // required: [true, 'Please enter the room ID']
        },
    },
    otherDetails: {
        cnic: {
            type: Number,
            // required: [true, 'Please enter CNIC number without dashes'],
            min: [1000000000000, 'CNIC number cannot be less than 13 characters'],
            max: [9999999999999, 'CNIC number cannot be greater than 13 characters'],
        },
        bedType: {
            type: String,
            // required: [true, 'Please enter bed type']
        },
        roomCategory: {
            type: String,
            // default:'luxury',
            // required:[true , 'please select room category']
        },
        contact_Number: {
            type: Number,
            // required: [true, 'Please enter a contact number']
        },
        roomRate: {
            type: Number,
            // required: [true, 'Please enter room rate']
        },
        payment_Status: {
            type: String,
            default: 'un-paid',
            // required: [true, 'Please enter payment status'],
            enum: ['paid', 'un-paid'],
        }
    }
});

const Reservation = mongoose.model('Reservation', reservedRoomSchema);

module.exports = Reservation;
