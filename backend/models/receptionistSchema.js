const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const receptionistSchema = new mongoose.Schema({
    receptionist_id: {
        type: String,
        unique: true,
    },

    name:{
        type:String
    },
    email:{
        type:String
    },
    password: {
        type:String
    },
    confirmPasswrod: {
        type : String,
    },
    phoneNumber: {
        type: Number,
    },
    dob:{
        type:Date
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

const Receptionist = mongoose.model('receptionist',receptionistSchema)

module.exports = Receptionist;