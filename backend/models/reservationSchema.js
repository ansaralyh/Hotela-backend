const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    },
    branch_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    },
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
        enum : ['unpaid', 'paid'],
        default:"unpaid"
    },
    cnic:{
        type:String,
        unique:true
    }
    
},{
    timestamps:true,
    toJSON:{virtuals:true} 
})
reservationSchema.virtual('id').get(function(){

    return this._id
})

module.exports = mongoose.model('Reservations', reservationSchema);
