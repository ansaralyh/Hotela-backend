const mongoose = require('mongoose');
const validator = require('validator');
;

const employeeSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        unique: true,
    },
    employeeName: {
        type: String,
        required: [true, 'please enter your name'],
    },
    cnic: {
        type: String,
        unique: true,
        required: [true, 'please enter your cnic number'],
    },
    position: {
        type: String,
        required: [true, 'Enter your position'],
    },
    gender: {
        type: String,
        required: [true, 'Enter your gender'],
    },
    contact: {
        type: String,
        required: [true, 'Enter your contact number'],
    },
    joiningDate: {
        type: Date,
        required: [true, 'Enter your joining date'],
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address',
        },
    },
    maritalStatus: {
        type: String,
        required: [true, 'Enter your marital status'],
    },
    emergencyContact: {
        type: String,
        required: [true, 'Enter an emergency number'],
    },
    city: {
        type: String,
        required: [true, 'Enter your city'],
    },
    currentAddress: {
        type: String,
        required: [true, 'Enter current address'],
    },
    permanentAddress: {
        type: String,
        required: [true, 'Enter permanent address'],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
