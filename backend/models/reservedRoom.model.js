 const mongoose = require('mongoose');

 const reservedRoomSchema = new mongoose.Schema({
    reservedRoomDetails:{
        bookind_Id :{
            type:Number,
            required:[true,'Please enter a booking ID']
        },
        customer_Name:{
            type:String,
            required:[true,'Please enter a customer name']
        },
        reservedBy:{
            type:String,
            required:true
        },
        checkIn:{
            type:Date,
            required:[true,'Please enter check in date']
        },
        checkOut:{
            type:Date,
            required:[true,'Please enter check out date']
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
    },
    otherDetails:{
        cnic:{
            type:Number,
            required:[true,'Please enter cnic number without dashes'],
            minLength:[13,'CNIC number cannot be greater than 13 characters'],
        },
        bedType : {
            type: String,
            // default:'Sinlge',
            required:[true, 'Please enter beed type']
        },
        roomCategory : {
            type:String,
            // default:'luxury',
            // required:[true , 'please select room category']
        },

        contact_Number:{
            type:Number,
            required:[true,'Please enter a contact number']
        },
        roomRate:{
            type:Number,
            required:[true,'Please enter rrom rate']
        },
        payment_Status:{
            type: String,
            default: 'un-paid',
            required: [true, 'Please enter status'],
            enum: ['paid', 'un-paid'],
        }
    }

 });
 const Reservation = mongoose.model('Reservation', reservedRoomSchema);

module.exports = Reservation;