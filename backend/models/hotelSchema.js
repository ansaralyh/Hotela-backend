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
    
})
module.exports = mongoose.model('Hotel',hotelSchema)