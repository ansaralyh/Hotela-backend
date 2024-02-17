const mongoose = require('mongoose');
// const Counter = require('./counter.model');

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
    checkInDate: {
        type: Date,

    },
    checkOutDate: {
        type: Date,

    },
    email: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String,
        enum: ["married", "single"]
    },
    emergencyContactNumber: {
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
});



const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
