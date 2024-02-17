const Owner = require('../models/ownerSchema')
const ErrorHandler = require('../utils/ErrorHandler');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken")
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail')

/** Create hotel controller*/
exports.store = catchAsyncErrors(async (req, res, next) => {

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const owner = await Owner.create(req.body);

    res.status(200).json({
        success: true,
        owner
    })

});
/**Login Owner */

exports.login = catchAsyncErrors(async (req, res, next) => {
    
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide an email and password", 400));
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
        return next(new ErrorHandler("Invalid email", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, owner.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 401));
    }
    else{
        const token=await jwt.sign({id:owner._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            owner,
            accessToken:token,
          
        });
      
    }

    
});


// Forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await Owner.findOne({ email });

    if (!user) {
        return next(new ErrorHandler(`User with this ${email} not found`));
    }

    const generatedOTP = crypto.randomBytes(3).toString('hex');

    try {
       
        await sendEmail(email, 'Password Reset OTP', `Your OTP is ${generatedOTP}`);

    
        user.forgetPasswordOtp = generatedOTP;
        await user.save();

        
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: generatedOTP
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});


// Verify OTP
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;


    const user = await Owner.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("Email does not exist", 400));
    }


    if (user.forgetPasswordOtp === otp) {
        user.isPasswordOtpVerified = true;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return next(new ErrorHandler('Invalid OTP'));
    }
});


// Reset Password Controller
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { email, newPassword } = req.body;

    const user = await Owner.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("Email does not exist", 400));
    }
     if (user.isPasswordOtpVerified) {
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.isPasswordOtpVerified = false;
        user.forgetPasswordOtp = null;
        user.isPasswordOtpVerified = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } else {
        return next(new ErrorHandler('OTP verification required before resetting password'));
    }
});
