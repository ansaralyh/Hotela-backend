const mongoose = require('mongoose');
const { generateCustomIDMiddleware } = require('../utils/customeIdGenerator')

const customerSchema = new mongoose.Schema({

    name: {
        type: String,

    },
    cnic: {
        type: Number,
        unique:true

    },
    gender: {
        type: String,
        enum: ['male', 'female']

    },
   
    email: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String
    },
    contact:{
        type:String
    },
    emergencyContact: {
        type: Number
    },
    city: {
        type: String,
    },
    currentAddress: {

        type: String,
    },
    permanentAddress: {
        type: String,
    }
    ,
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    branch_id:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    }
});




const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
