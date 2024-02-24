const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({

    type: {
        type: Number, //1.Manager 2.Chef, 3.Room Cleaner 

    },
    name: {
        type: String,
    },
    cnic: {
        type: String,
        unique: true,
    },
    gender: {
        type: String,
    },
    contact: {
        type: String,
    },
    joiningDate: {
        type: Date,
    },
    email: {
        type: String,

    },
    maritalStatus: {
        type: String,
    },
    emergencyContact: {
        type: String,
    },
    city: {
        type: String,
    },
    currentAddress: {
        type: String,

    },
    permanentAddress: {
        type: String,

    },

    dob: {
        type: Date
    },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    branch_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }



});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
