const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({

    type:{
        type:Number, //1.Manager 2.Chef, 3.Room Cleaner 4.Receptionist
        
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
    password:{
        type:String
    },
    dob:{
        type:Date
    },
   



});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
