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
        minLength: [8, "password cannot be less than 8characters"],
        required: [true, 'Please enter password'],
    },
    firstName: {
        type: String,
        required: [true, 'Please enter first name'],
        maxLength: [10, "First name cannot exceed 10 Characters"],
        minLength: [3, "First name cannot be less than 5 characters "]
    },
    lastName: {
        type: String,
        required: [true, 'Please enter last name'],
        maxLength: [10, "last name cannot exceed 10 Characters"],
        minLength: [3, "last name cannot be less than 5 characters "]
    },
    phoneNumber: {
        type: Number,

        required: [true, 'Please enter mobile number']
    },
    cnic: {
        type: Number,
        required: [true, 'Please enter cnic number']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    profilePicture: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    role:{
        type:String,
        default:"receptionist"
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