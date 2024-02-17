const mongoose = require('mongoose');

const roomCategoryScehma = new mongoose.Schema({
    cost:{
        type:Number,
    },
    name:{
        type:String,
    },
    occupancy:{
        type:String,
    },
    ammenities:{
        //0 for false, 1 for true
        air_conditioner:{type:Number,default:0},
        hot_water:{type:Number,default:0},
        wifi: {type:Number,default:0},
        tv:{type:Number,default:0},
        refrigerator: {type:Number,default:0}
    },
    hotel_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
});

module.exports = mongoose.model("Category",roomCategoryScehma)