const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        minLength: [8, "Password cannot be less than 8 characters"],
        required: [true, 'Please enter password'],
    },
    firstName: {
        type: String,
        required: [true, 'Please enter first name'],
        maxLength: [10, "First name cannot exceed 10 characters"],
        minLength: [3, "First name cannot be less than 3 characters"]
    },
    lastName: {
        type: String,
        required: [true, 'Please enter last name'],
        maxLength: [10, "Last name cannot exceed 10 characters"],
        minLength: [3, "Last name cannot be less than 3 characters"]
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please enter mobile number']
    },
    cnic: {
        type: String, 
        required: [true, 'Please enter CNIC number']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please enter date of birth']
    },
    profilePicture: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        default: "owner"
    },
    forgetPasswordOtp:{
        type: String,
    },
    isPasswordOtpVerified :{
        type: Boolean,
    }
});

/**JWT token */
ownerSchema.methods.getJWTToken = function () {
    const expiresIn = process.env.JWT_EXPIRE || '1h';

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });
};


/**Compare passwords */
ownerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("owner", ownerSchema)