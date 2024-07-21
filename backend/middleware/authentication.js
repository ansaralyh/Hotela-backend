const jsonwebtoken = require('jsonwebtoken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler');
const users = require('../models/userSchema')
 
// Auth middleware

exports.auth = async (req, res, next) => {
  
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'User not authenticated', message: 'Invalid token format.' });
        }

        const token = authHeader.split(' ')[1];
        // console.log("token :",token)
        
        if (!token) {
            return res.status(401).json({ error: 'User not authenticated', message: 'Token not provided.' });
        }

        // console.log(process.env.JWT_SECRET,token)

        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const user = await users.findById(decoded.id);
        // console.log(user)
        if(!user){
            return next(new ErrorHandler('User not found'),404)
        }
        req.user = user;
        
        // console.log("decoded",decoded);
        next();
    } catch (error) {
        console.error('Authentication error :', error.message);
        return res.status(401).json({ error: 'User not authenticated', message: 'Invalid token.' });
    }
};

exports.isAuthorizedRole = (roles) => {
    return (req, res, next) => {
        console.log('user role',req.user.role)
        if (roles.includes(req.user.role)) {
            return next();
        }
        return next(new ErrorHandler(`User is not authorized to access this resource`, 403));
    };
};




