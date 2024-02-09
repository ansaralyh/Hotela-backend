const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require('../utils/ErrorHandler');
const ownerSchema = require('../models/ownerSchema')
 
// Auth middleware
exports.auth = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token)

    if (!token) {
        return next(new ErrorHandler("Not authorized", 401));
    }

    try {
        const finalToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded Token:', finalToken);

        // console.log(finalToken.id)
        // console.log('Token Expiry:', new Date(finalToken.exp * 1000));
        req.user = await ownerSchema.findById(finalToken.id);

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler("JWT token has expired", 401));
        } else {
            return next(new ErrorHandler("Invalid token", 401));
        }
    }
});


exports.isAuthorizedRole = (...roles) => {
    return (req, res, next) => {
        // console.log('User Role:', req.user);
        if (req.user && req.user.role && roles.includes(req.user.role)) {
            return next();
        }
        return next(new ErrorHandler(`User is not authorized to access this resource`, 403));
    };
    next();
};



