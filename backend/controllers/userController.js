const users = require("../models/userSchema");
const ErrorHandler = require("../utils/ErrorHandler");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Hotel = require("../models/hotelSchema");

/**  hotel controller*/
exports.store = catchAsyncErrors(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;
  const result = await users.create(req.body);
  res.status(200).json({
    success: true,
    messege: "User created successfully",
  });
});


exports.getUser = catchAsyncErrors(async (req,res,next)=>{
  const user_id = req.query.user_id;

  if(!user_id){
    return next(new ErrorHandler('Please provide user id',401))
  }
  const user = await users.findById(user_id).populate('branch_id').populate('hotel_id')

  if(!user){
    return next(new ErrorHandler('User Not Found',404))
  }

  res.status(200).json({
    message: 'Operation Successfull',
    result:user
  })
})


/**Login Owner */
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide an email and password", 400));
  }
  const result = await users
    .findOne({ email })
    .populate("hotel_id")
    .populate("branch_id");
  if (!result) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  
  const isPasswordMatched = await bcrypt.compare(password, result.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid credentials", 401));
  } else {
    let token = "";
    if (result.role === "receptionist") {
      if (result.branch_id) {

        token = jwt.sign(
          {
            id: result._id,
            hotel_id: result.hotel_id._id,
            branch_id: result.branch_id._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );
      } else {
        return next(new ErrorHandler("No branch associated with this receptiionist"))
      }
    } else {
      token = jwt.sign(
        { id: result._id, hotel_id: result.hotel_id._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
    }
    const hotel = await Hotel.findById(result.hotel_id);
    res.status(200).json({
      message: "Logged in successfully",
      result,
      role: result.role,
      accessToken: token,
    });
  }
});

// Forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const result = await users.findOne({ email });
  if (!result) {
    return next(new ErrorHandler(`User with this ${email} not found`));
  }
  const generatedOTP = crypto.randomBytes(3).toString("hex");

  try {
    await sendEmail(email, "Password Reset OTP", `Your OTP is ${generatedOTP}`);
    result.forgetPasswordOtp = generatedOTP;
    await users.save();
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: generatedOTP,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
});

// Verify OTP
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await users.findOne({ email });
  if (!result) {
    return next(new ErrorHandler("Email does not exist", 400));
  }
  if (result.forgetPasswordOtp === otp) {
    result.isPasswordOtpVerified = true;
    await result.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return next(new ErrorHandler("Invalid OTP"));
  }
});

// Reset Password Controller
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const result = await users.findOne({ email });
  if (!result) {
    return next(new ErrorHandler("Email does not exist", 400));
  }
  if (result.isPasswordOtpVerified) {
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    result.password = hashedPassword;
    result.isPasswordOtpVerified = false;
    result.forgetPasswordOtp = null;
    result.isPasswordOtpVerified = null;
    await result.save();
    res.status(200).json({ message: "Password reset successfully" });
  } else {
    return next(
      new ErrorHandler("OTP verification required before resetting password")
    );
  }
});
