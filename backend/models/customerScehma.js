const mongoose = require('mongoose');
const Counter = require('./counter.model');

const customerSchema = new mongoose.Schema({

    name: {
        type: String,

    },
    cnic: {
        type: Number,

    },
    gender: {
        type: String,

    },
    checkIn: {
        type: Date,

    },
    checkOut: {
        type: Date,

    }, email: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String,
    }
});



const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
