const mongoose = require('mongoose');

const roomScehma = new mongoose.Schema({
    room_id: {
        type: String,
        unique: true,
    },
    room_status: {
        type: String,
        enum: ['available', 'reserved'],
        default: 'available',
    },
    roomRate: {
        type:Number,
        // default:"20,000/-",
        // required:[true,'Please enter room rate']
    },
    roomCategory : {
        type:String,
        // default:'luxury',
        // required:[true , 'please select room category']
    },
    roomNumber : {
        type : String,
        // default:'R2234',
        required: [true,'Please enter room number']

    },
    bedType : {
        type: String,
        // default:'Sinlge',
        required:[true, 'Please enter bed type']
    },
    occupancy : {
        type: Number,
        required: true,
        // default:'2-3 people',
    },
    amenities: {
        airConditioner: {
          type: Boolean,
        //   default: false, // Default value is false, indicating not selected
        },
        hotWater: {
          type: Boolean,
        //   default: false,
        },
        wifi: {
          type: Boolean,
        //   default: false,
        },
        tvScreen : {
            type:Boolean,
            // default:false
        },
        refrigeraor : {
            type:Boolean,
            // default:false
        },
        roomImage : {
            public_id: {
                type: String,
                // default:'sample id'
                required: true,
            },
            url: {
                type: String,
                // default:'sample uri'
                required: true,
            },
        }
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const room = mongoose.model('room',roomScehma);
module.exports = room;