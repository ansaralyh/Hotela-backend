const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() 
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'customer'
    },
    checkInDate:{
        type:Date
    },
    checkOutDate:{
        type:Date
    },
    room_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Room'
    },
    status:{

        type:String,
        enum : ['un-paid', 'paid'],
    },
    
});

module.exports = mongoose.model('Reservations', reservationSchema);
