const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    location:{
        type:String
    },
    contact:{
        type:Number
    },
    logo:{
        type:String
    },
    
},{
    timestamps:true,
    toJSON:{virtuals:true}
})

hotelSchema.virtual('id').get(function(){
    return this._id
})
module.exports = mongoose.model('Hotel',hotelSchema)