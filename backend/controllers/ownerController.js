const Owner = require('../models/ownerSchema')
const ErrorHandler = require('../utils/ErrorHandler');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken")
const Otp = require('../models/otp.model')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

/** Create hotel controller*/
exports.store = catchAsyncErrors(async (req, res, next) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
        return next(new ErrorHandler("Invalid email ", 401));
    }

    const isPasswordMatched = await owner.comparePassword(password);
    if (!isPasswordMatched) {

        return next(new ErrorHandler("Invalid email and password", 401));
    }

    res.status(200).json({
        success:true,
        messege:"Logged in successfully",
    })
});



//Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        messege: "Logged out successfully",

    })
})
// Forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await Owner.findOne({ email });

    if (!user) {
        return next(new ErrorHandler(`User with this ${email} not found`));
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ansaralyh@gmail.com',
            pass: 'wgfu cpye unto qsht',
        },
    });

    const generatedOTP = crypto.randomBytes(3).toString('hex');

    const mailOptions = {
        from: 'ansaralyh@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${generatedOTP}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        user.forgetPasswordOtp = generatedOTP;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: generatedOTP
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return next(new ErrorHandler('Failed to send email. Please try again later.'));
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
        user.forgetPasswordOtp = undefined; 
        user.isPasswordOtpVerified = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } else {
        return next(new ErrorHandler('OTP verification required before resetting password'));
    }
});
