const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    branch_id:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    },
    items:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Items"
        }
    ],
    customer_name:{
        type:String
    },
    status:{
        type:String,
        enum:['paid','unpaid'],
        default:'unpaid',
    },
    total_spent_days:{
        type:Number
    },
    rent_per_day:{
        type:Number
    },
    total_room_rent:{
        type:Number
    },
    total_order_amount:{
        
        type:Number
    },
    checkInDate:{
        type:Date
    },
    checkOutDate:{
        type:Date
    },
    amount_received:{
        type:Number
    },
    return_amount:{
        type:Number
    }

});

module.exports = mongoose.model("Invoice",invoiceSchema);