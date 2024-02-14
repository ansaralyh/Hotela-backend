const Owner = require('../models/ownerSchema')
const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken")
const Otp = require('../models/otp.model')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

/** Create hotel controller*/
exports.store = catchAsyncErrors(async (req, res, next) => {
 
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    req.body.password = hashedPassword;
    const owner = await Owner.create(req.body);

   res.status(200).json({
    success:true,
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

    sendToken(owner, 200, res);
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

        return next(new ErrorHandler(`User with this ${email} not found`))
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ansaralyh@gmail.com',
            pass: 'rbxi feyw kbix rjkd',
        },
    });

    const generatedOTP = crypto.randomBytes(3).toString('hex');
    console.log(generatedOTP)
    const mailOptions = {
        from: 'ansaralyh@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${generatedOTP}`,
    };
    const storedOTP = new Otp({
        otp: generatedOTP,
        email,
    });
    await storedOTP.save();

    res.status(200).json({
        message: 'OTP sent successfully',
        otp: generatedOTP
    });

})


// Verify OTP
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const user = await Owner.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Email does not exist", 400));
    }
    const storedOtp = await Otp.findOne({ email, otp });
    if (!storedOtp) {
        return next(new ErrorHandler("Invalid OTP", 400))
    }
    if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        Owner.password = hashedPassword;

        await user.save();
        await storedOtp.deleteOne();

        return res.status(200).json({ message: 'Password updated successfully' });
    } else {
        return next(new ErrorHandler('user not verified'))
    }

})