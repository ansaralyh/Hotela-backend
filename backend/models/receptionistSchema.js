const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const receptionistSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password: {
        type:String
    },
    phoneNumber: {
        type: Number,
    },
    dob:{
        type:Date
    },
   

},
{
    timestamps:true
})

const Receptionist = mongoose.model('receptionist',receptionistSchema)

module.exports = Receptionist;